declare module '@pagefind/default-ui' {
  export class PagefindUI {
    constructor(options: {
      element: string | HTMLElement
      showSubResults?: boolean
      translations?: Record<string, string>
    })
  }
}
