import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; // Correct import for createRoot
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Routes';

import './index.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // Correct usage of createRoot

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
