---
title: ypbin-starter-excel
description: 导入导出 模块能力说明与配置参考。
---

# excel — 导入导出

基于 FastExcel，注解驱动。实体字段用 `@ExcelProperty` 标注列名：

```java
public class UserExcel {
    @ExcelProperty("用户名")
    private String username;
    @ExcelProperty("年龄")
    private Integer age;
}

// 导入：同步全量 / 指定 sheet / 自定义表头行
List<UserExcel> list = ExcelUtils.read(inputStream, UserExcel.class);
List<UserExcel> s2 = ExcelUtils.read(inputStream, UserExcel.class, 1);          // 第 2 个 sheet
List<UserExcel> h2 = ExcelUtils.read(inputStream, UserExcel.class, 0, 2);       // 表头占 2 行

// 大文件分批流式读取，避免一次性载入内存
ExcelUtils.readInBatch(inputStream, UserExcel.class, 1000, batch -> saveBatch(batch));

// 导出到 HTTP 响应（浏览器下载，文件名自动 UTF-8 编码）
ExcelUtils.export(response, "用户列表", UserExcel.class, list);

// 仅导出/排除指定列（字段名）
ExcelUtils.writeIncludeColumns(out, "用户", UserExcel.class, list, List.of("username"));

// 多 sheet 导出
ExcelUtils.exportMultiSheet(response, "报表", List.of(
    ExcelUtils.SheetData.of("用户", UserExcel.class, users),
    ExcelUtils.SheetData.of("订单", OrderExcel.class, orders)));
```
