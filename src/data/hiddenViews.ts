/**
 * Views that stay in the codebase (routes, components, copy) but are not
 * linked from anywhere: the desktop sidebar, the mobile Explore row and the
 * Home cards all filter through this. To bring one back, delete its path
 * from the list - nothing else needs to change.
 *
 * The routes themselves are untouched, so a direct URL still opens the page.
 */
export const HIDDEN_VIEWS: readonly string[] = ['/showcase', '/testimonials']

export const isHiddenView = (to: string): boolean => HIDDEN_VIEWS.includes(to)
