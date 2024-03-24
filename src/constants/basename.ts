/**
 * Use this for **assets** to look for in the `https://<username>.github.io/<repo-name>`
 *
 * - When using `BrowserRouter` update basename to `/repo-name`
 * - When using `HashRouter` always use the basename to default `/`
 * BUT still add `/repo-name` path for **assets**
 */
export const basename = import.meta.env.PROD // vite-env.d.ts
  ? '/draft-test-labs/'
  : '';
