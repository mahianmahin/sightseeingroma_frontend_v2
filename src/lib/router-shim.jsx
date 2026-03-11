/**
 * RouterShim – Provides a minimal react-router-dom compatible context
 * for legacy React components that import from 'react-router-dom'.
 *
 * This works by aliasing 'react-router-dom' in Vite config to this file,
 * so existing imports continue to work without code changes.
 */
import React, { createContext, useContext, useMemo, useCallback } from 'react';

/* ─── Internal context for params passed by Astro shells ─── */
const ParamsContext = createContext({});
const LocationStateContext = createContext({});

/**
 * Wrap a legacy React component tree with this provider in the Astro page.
 * Pass `params` (from Astro.params) and `locationState` if any.
 */
export function RouterProvider({ params = {}, locationState = {}, children }) {
  return (
    <ParamsContext.Provider value={params}>
      <LocationStateContext.Provider value={locationState}>
        {children}
      </LocationStateContext.Provider>
    </ParamsContext.Provider>
  );
}

/* ─── react-router-dom API surface ─── */

export function useNavigate() {
  return useCallback((to, options = {}) => {
    if (typeof to === 'number') {
      window.history.go(to);
      return;
    }

    // Handle state: store in sessionStorage for cross-page persistence
    if (options.state) {
      sessionStorage.setItem('_router_state', JSON.stringify(options.state));
    }

    if (options.replace) {
      window.location.replace(to);
    } else {
      window.location.href = to;
    }
  }, []);
}

export function useParams() {
  return useContext(ParamsContext);
}

export function useSearchParams() {
  const isServer = typeof window === 'undefined';

  const searchParams = useMemo(
    () => isServer ? new URLSearchParams() : new URLSearchParams(window.location.search),
    [isServer]
  );

  const setSearchParams = useCallback((updater) => {
    if (isServer) return;
    let newParams;
    if (typeof updater === 'function') {
      newParams = updater(new URLSearchParams(window.location.search));
    } else {
      newParams = new URLSearchParams(updater);
    }
    window.history.pushState({}, '', `${window.location.pathname}?${newParams.toString()}`);
  }, [isServer]);

  return [searchParams, setSearchParams];
}

export function useLocation() {
  const state = useContext(LocationStateContext);

  return useMemo(() => {
    // Try to recover state from sessionStorage (set by navigate)
    let resolvedState = state;
    if ((!resolvedState || Object.keys(resolvedState).length === 0) && typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('_router_state');
        if (stored) {
          resolvedState = JSON.parse(stored);
          // Clear after reading (one-time use)
          sessionStorage.removeItem('_router_state');
        }
      } catch { /* ignore */ }
    }

    return {
      pathname: typeof window !== 'undefined' ? window.location.pathname : '/',
      search: typeof window !== 'undefined' ? window.location.search : '',
      hash: typeof window !== 'undefined' ? window.location.hash : '',
      state: resolvedState || null,
      key: 'default',
    };
  }, [state]);
}

export function Link({ to, children, className, state, replace, ...rest }) {
  const handleClick = (e) => {
    if (state) {
      e.preventDefault();
      sessionStorage.setItem('_router_state', JSON.stringify(state));
      if (replace) {
        window.location.replace(to);
      } else {
        window.location.href = to;
      }
    }
    // If no state, let normal <a> behavior happen
  };

  return (
    <a href={to} className={className} onClick={state ? handleClick : undefined} {...rest}>
      {children}
    </a>
  );
}

export function Navigate({ to, replace = false, state }) {
  if (typeof window !== 'undefined') {
    if (state) {
      sessionStorage.setItem('_router_state', JSON.stringify(state));
    }
    if (replace) {
      window.location.replace(to);
    } else {
      window.location.href = to;
    }
  }
  return null;
}

export function Outlet() {
  return null;
}

export function useOutletContext() {
  return {};
}

// No-op for compatibility
export function createBrowserRouter() { return {}; }
export function RouterProvider2() { return null; }
export function BrowserRouter({ children }) { return children; }
export function Routes({ children }) { return children; }
export function Route() { return null; }
