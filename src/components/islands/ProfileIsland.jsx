/**
 * Profile island wrapper.
 * Wraps the existing Profile component with the router shim.
 */
import { RouterProvider } from '@/lib/router-shim.jsx';
import Profile from '@/Page/Profile';

export default function ProfileIsland() {
  // Client-side auth check
  if (typeof window !== 'undefined' && !localStorage.getItem('access')) {
    window.location.href = '/login';
    return null;
  }

  return (
    <RouterProvider>
      <Profile />
    </RouterProvider>
  );
}
