/**
 * Analytics island wrapper.
 * Wraps the existing Analytics component with the RouterProvider shim.
 */
import { RouterProvider } from '@/lib/router-shim.jsx';
import Analytics from '@/Page/Analytics';

export default function AnalyticsIsland() {
  return (
    <RouterProvider>
      <Analytics />
    </RouterProvider>
  );
}
