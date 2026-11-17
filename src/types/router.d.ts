import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    header?: boolean
    goBackButton?: boolean
    /** Render the page edge to edge, without the layout's padding and vertical centering */
    fullBleed?: boolean
    /** Reachable without a LINE login (404, maintenance) */
    public?: boolean
  }
}
