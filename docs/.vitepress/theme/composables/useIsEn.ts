import { computed } from 'vue'
import { useRoute } from 'vitepress'

/**
 * 是否位于英文站（/en/** 前缀）。
 *
 * 首页组件族统一用该判据切换英文/中文文案与链接：与 HomeNav 的路由前缀判据
 * 保持一致，保证中英文站切换时组件展示与顶部导航同源判断。
 */
export function useIsEn() {
  const route = useRoute()
  return computed(() => route.path.startsWith('/en'))
}
