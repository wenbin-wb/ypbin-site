import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import SourceCitation from './components/SourceCitation.vue'
import StatusBadge from './components/StatusBadge.vue'
import VersionScope from './components/VersionScope.vue'
import '@pagefind/default-ui/css/ui.css'
import './styles/tokens.css'
import './styles/site.css'
import './styles/components.css'
import './styles/responsive.css'
import './styles/motion.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('SourceCitation', SourceCitation)
    app.component('StatusBadge', StatusBadge)
    app.component('VersionScope', VersionScope)
  }
} satisfies Theme
