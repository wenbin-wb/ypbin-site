---
title: ypbin-starter-storage
description: 文件存储 模块能力说明与配置参考。
---

# storage — 文件存储

本地 + S3 兼容对象存储（阿里云 OSS / 腾讯云 COS / MinIO / 七牛等），支持多存储源共存、按 platform 路由：

```yaml
ypbin:
  storage:
    default-platform: local-disk
    local:
      - platform: local-disk
        base-path: /data/files
        domain: https://cdn.example.com
    oss:
      - platform: aliyun
        endpoint: https://oss-cn-hangzhou.aliyuncs.com
        bucket: my-bucket
        access-key: ${OSS_AK}
        secret-key: ${OSS_SK}
```

```java
@Autowired
private FileStorageService fileStorageService;

FileInfo info = fileStorageService.upload(inputStream, "a.png")
    .platform("aliyun")       // 不指定则用默认平台
    .path("images/")
    .execute();
```

扩展点：`StorageStrategy`（新增存储后端）、`FileProcessor`（上传前校验/改名/生成路径责任链）、`FileRecorder`（记录文件元数据）。S3 上传对未知大小的流会落临时文件规避 OOM，直链自动 URL 编码。

**后台动态配置**：存储源默认读 `ypbin.storage.*`，也可由业务方实现 `StorageConfigProvider` 从数据库读取，后台改完调 `StorageStrategyRebuilder.rebuild()` 即时生效（`StorageRouter` 原子刷新，新增/修改/删除的源立即路由，无需重启）：

```java
@Component
public class DbStorageConfigProvider implements StorageConfigProvider {
    @Override public List<LocalConfig> getLocalConfigs() { /* 查存储配置表 */ }
    @Override public List<OssConfig> getOssConfigs() { /* 查存储配置表 */ }
    @Override public String getDefaultPlatform() { /* 默认平台 */ }
}

// 后台保存存储配置后：
storageStrategyRebuilder.rebuild();   // 即时生效
```
