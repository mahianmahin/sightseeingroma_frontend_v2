/**
 * Blog Conversion Stats island wrapper.
 * Wraps the existing BlogConversionStats component with the RouterProvider shim.
 */
import { RouterProvider } from '@/lib/router-shim.jsx';
import BlogConversionStats from '@/Page/BlogConversionStats';

export default function BlogAnalyticsIsland() {
  return (
    <RouterProvider>
      <BlogConversionStats />
    </RouterProvider>
  );
}
