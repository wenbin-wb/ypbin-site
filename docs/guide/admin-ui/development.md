---
title: Admin UI 页面开发规范
description: 列表页、表格、表单弹层、API 层与 i18n 的标准写法，以及项目硬性约束。
---

# Admin UI 页面开发规范

本页是 ypbin-admin-ui 页面开发的标准写法。应用位于 `apps/web-antd`，基于 Vue 3 + TypeScript + Ant Design Vue，构建在开源管理前端框架 Vben Admin 之上。这里只讲项目如何落地，不重复框架通用说明。

## 优先复用，不重造

写任何 UI 前，先按此顺序找现成的：

1. `#/adapter`：项目封装层（表单组件注册、vxe-table、请求客户端、`VbenTableAction`）；
2. `@vben/common-ui`：`Page`、`Tree`、`useVbenForm`、`useVbenModal`、`useVbenDrawer` 等；
3. `playground/src/views/examples/*`：官方示例（form / modal / drawer / vxe-table）。

确认没有再自己写。找到就照它的用法来。

## 标准列表页

页面采用「列表组件只做编排」的结构，三个文件：

```
views/system/<模块>/
  list.vue            # 编排：Page + Grid + 弹层
  data.ts             # useColumns / useGridFormSchema(搜索) / useFormSchema(表单)
  modules/form.vue    # 新增/编辑弹层
```

`list.vue` 骨架：

```vue
<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemXxxApi } from '#/api';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';
import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid, VbenTableAction } from '#/adapter/vxe-table';
import { deleteXxx, getXxxList } from '#/api';
import { $t } from '#/locales';
import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormDrawer, formDrawerApi] = useVbenDrawer({ connectedComponent: Form });

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: { schema: useGridFormSchema(), submitOnChange: true },
  gridOptions: {
    columns: useColumns(),
    height: 'auto',
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) =>
          getXxxList({ page: page.currentPage, pageSize: page.pageSize, ...formValues }),
      },
    },
    rowConfig: { keyField: 'id' },
    toolbarConfig: { custom: true, refresh: true, search: true, zoom: true },
  } as VxeTableGridOptions<SystemXxxApi.SystemXxx>,
});

function onRefresh() { gridApi.query(); }
function onCreate() { formDrawerApi.setData(null).open(); }
function onEdit(row: SystemXxxApi.SystemXxx) { formDrawerApi.setData(row).open(); }
function onDelete(row: SystemXxxApi.SystemXxx) { deleteXxx(row.id).then(onRefresh); }
</script>

<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <Grid :table-title="$t('system.xxx.list')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.xxx.name')]) }}
        </Button>
      </template>
      <template #action="{ row }">
        <VbenTableAction
          :actions="[
            { text: $t('common.edit'), icon: 'lucide:edit', onClick: () => onEdit(row) },
            { text: $t('common.delete'), icon: 'lucide:trash-2', danger: true,
              auth: 'AC_xxx',
              popConfirm: { title: $t('ui.actionMessage.deleteConfirm', [row.name]), confirm: () => onDelete(row) } },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
```

要点：

- 列定义与表单 schema 抽到 `data.ts`，`list.vue` 不做内联；
- 弹层标题用 `ui.actionTitle.create/edit` 并传入实体名；
- 表格请求返回 `{ items, total }`，Long ID 在 TypeScript 中保持字符串。

## 表格

表格必须走 `useVbenVxeGrid`，不手写 `<a-table>`。数据走 `proxyConfig.ajax.query`，单元格渲染用已注册的渲染器，不在列里手写 `h(Tag)` / `h(Switch)`：

| 渲染器 | 用途 |
|---|---|
| `CellTag` | 状态标签 |
| `CellSwitch` | 开关（可配 `beforeChange` 二次确认） |
| `CellImage` | 图片 |
| `CellLink` | 链接 |

缺渲染器时在 `vxe-table.ts` 里 `vxeUI.renderer.add` 注册。

操作列用 `VbenTableAction`，权限在 action 的 `auth` 字段声明（内部已注入 `hasPermission`），删除用 `popConfirm`。

## 表单弹层

弹层用 `useVbenForm` 出表单 + `useVbenDrawer` / `useVbenModal` 管弹层，标题按有无 id 切「新增/修改 + 实体名」：

```ts
const [Form, formApi] = useVbenForm({ schema: useFormSchema(), showDefaultActions: false });
const id = ref<string>();

// 新增传 null，编辑传整行
type XxxFormData = null | SystemXxxApi.SystemXxx;

const [Drawer, drawerApi] = useVbenDrawer<XxxFormData>({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    (id.value ? updateXxx(id.value, values) : createXxx(values))
      .then(() => { emits('success'); drawerApi.close(); })
      .catch(() => { drawerApi.unlock(); });
  },
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    const data = drawerApi.getData();
    formApi.reset();
    id.value = data?.id;
    await nextTick();
    if (data) formApi.setValues(data);
  },
});

defineExpose({ drawerApi });
```

### 弹层共享数据契约

- `useVbenDrawer` 的类型由 hook 上的泛型决定，`getData()` 没有类型参数，不要在调用处写 `getData<Xxx>()`；
- 「新增」语义一律 `setData(null)`，不用 `setData({})`（`{}` 是 truthy，`if (data)` 判不出来）；
- 打开时 `reset()` → `nextTick()` → `setValues()` 顺序不能乱，否则回填丢失；
- `lock()` / `unlock()` 防止重复提交，失败要解锁并暴露错误，不能静默吞掉；
- 不要改写 `getData()` 返回的共享对象（它是父组件传入的同一个引用），要调整取值就展开成新对象。

## API 层

一个模块一个文件，类型收进 `namespace`：

```ts
import { requestClient } from '#/api/request';

export namespace SystemXxxApi {
  export interface SystemXxx {
    id: string;        // Long 全程字符串
    name: string;
    status: 0 | 1;
  }
}

async function getXxxList(params: Recordable<any>) {
  return requestClient.get('/system/xxx/list', { params });
}
```

- `requestClient` 已配置自动解包到 `data`，页面直接拿业务数据；
- 字段与后端 DTO 完全同名，不做 key 转换。

## 文件下载与导入导出

前端导入导出遵循模块化规范：

1. **文件下载**：调用通用工具 `downloadByBlob(blob, fileName)`（位于 `#/utils/file`），负责创建临时链接、触发下载并安全释放内存：
   ```ts
   import { downloadByBlob } from '#/utils/file';

   const blob = await exportUsers(params);
   downloadByBlob(blob as Blob, $t('system.user.exportFileName') || '用户列表.xlsx');
   ```
2. **导入模态框**：在 `modules/import.vue` 中使用 `useVbenModal` 封装独立弹窗，内置模板下载、`Upload.Dragger` 拖拽上传与错误明细折叠展示，主列表页仅做挂载与编排。

## i18n

每个用户可见文案在 `zh-CN` 和 `en-US` 两份都加，key 路径一致。实体名放 `system.<模块>.name`，字段标签用独立 key。带占位符的 key 传数组：

```ts
$t('ui.actionTitle.create', [$t('system.xxx.name')])
```

## 权限与动态路由

登录后从后端读取菜单与权限码：菜单映射为前端路由，按钮通过权限码控制显隐。受保护按钮在 `VbenTableAction` 或页面里用权限码声明。路由或组件无法解析时必须暴露配置问题，不能静默回退到虚构页面。

## 项目硬性约束

- **字段全程同名**：DB 字段 = 后端实体 = 接口 JSON = 前端 TS 类型 / 表单 fieldName / 表格字段，禁止改名映射；
- **Long ID 全程按字符串**：`id` / `deptId` / `roleId` 在 TS 里是 `string`，不 `Number()`；
- **不做静默降级**：接口/渲染异常要暴露（`console.error` + 用户可感知提示），不 catch 后吞掉假装正常。

更多配置入口见 [Admin UI 全量配置参考](/guide/config/admin-ui)，后端接口契约见 [Admin 接口契约](/guide/admin/api)。
