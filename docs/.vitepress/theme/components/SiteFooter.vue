<script setup lang="ts">
import { useData } from 'vitepress'

const { isDark } = useData()
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__brand">
      <img :src="isDark ? '/brand/logo-horizontal-dark.svg' : '/brand/logo-horizontal-light.svg'" width="150" height="40" alt="ypbin" />
      <p>系统级基础能力、后台服务与管理前端的协作边界。</p>
    </div>
    <nav aria-label="页脚导航">
      <div><strong>产品</strong><a href="/products/starter">starter</a><a href="/products/admin">admin</a><a href="/products/admin-ui">admin-ui</a></div>
      <div><strong>资源</strong><a href="/architecture">架构</a><a href="/releases">发布</a><a href="/contributing/">贡献</a></div>
      <div><strong>项目</strong><a href="https://github.com/wenbin-wb" target="_blank" rel="noreferrer">GitHub</a><a href="/.well-known/security.txt">安全联系</a></div>
    </nav>
    <p class="site-footer__meta">© 2026 ypbin · 文档事实以对应版本源码为准。</p>
  </footer>
</template>
