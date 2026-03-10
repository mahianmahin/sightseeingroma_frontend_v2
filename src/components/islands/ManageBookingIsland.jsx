/**
 * ManageBooking island wrapper.
 * Wraps the existing ManageBookingMd/ManageBookingSm components with
 * the RouterProvider shim so they can access route params.
 *
 * Receives `status` and `id` props from the Astro page.
 */
import { RouterProvider } from '@/lib/router-shim.jsx';
import ManageBookingMd from '@/Components/ManageBooking/ManageBookingMd';
import ManageBookingSm from '@/Components/ManageBooking/ManageBookingSm';

export default function ManageBookingIsland({ status, id }) {
  return (
    <RouterProvider params={{ status, id }}>
      <div className="container mx-auto">
        <div className="hidden md:block">
          <ManageBookingMd />
        </div>
        <div className="block md:hidden">
          <ManageBookingSm />
        </div>
      </div>
    </RouterProvider>
  );
}
