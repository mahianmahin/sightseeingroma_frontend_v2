/**
 * Your Purchased Tickets island wrapper.
 * Wraps the existing component with the router shim.
 */
import { RouterProvider } from '@/lib/router-shim.jsx';
import Your_Purchased_Tickets from '@/Page/Your_Purchased_Tickets';

export default function YourTicketsIsland() {
  return (
    <RouterProvider>
      <Your_Purchased_Tickets />
    </RouterProvider>
  );
}
