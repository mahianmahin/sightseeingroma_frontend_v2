/**
 * Router compatibility layer for React islands in Astro.
 *
 * Replaces react-router-dom hooks/components with plain browser APIs
 * so that existing React components can work without a client-side router.
 */
import { useCallback, useMemo } from 'react';

/* ------------------------------------------------------------------ */
/*  useNavigate – returns a navigate function using window.location   */
/* ------------------------------------------------------------------ */
export function useNavigate() {
  return useCallback((to, options = {}) => {
    if (typeof to === 'number') {
      window.history.go(to);
    } else if (options.replace) {
      window.location.replace(to);
    } else {
      window.location.href = to;
    }
  }, []);
}

/* ------------------------------------------------------------------ */
/*  useParams – reads route params passed as props by the Astro shell */
/* ------------------------------------------------------------------ */
// In Astro islands, params are passed as a `routeParams` prop.
// Usage: const { slug } = useParams();
// The component must receive `routeParams` from the Astro page.
let _params = {};
export function setRouteParams(params) {
  _params = params || {};
}
export function useParams() {
  return _params;
}

/* ------------------------------------------------------------------ */
/*  useSearchParams – wrapper over URLSearchParams                    */
/* ------------------------------------------------------------------ */
export function useSearchParams() {
  const searchParams = useMemo(
    () => new URLSearchParams(window.location.search),
    []
  );

  const setSearchParams = useCallback((newParams) => {
    const params = new URLSearchParams(newParams);
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', url);
  }, []);

  return [searchParams, setSearchParams];
}

/* ------------------------------------------------------------------ */
/*  useLocation – returns an object mimicking react-router location   */
/* ------------------------------------------------------------------ */
export function useLocation() {
  return useMemo(() => ({
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    state: window.history.state,
    key: 'default',
  }), []);
}

/* ------------------------------------------------------------------ */
/*  Link – a plain <a> tag replacement                                 */
/* ------------------------------------------------------------------ */
export function Link({ to, children, className, ...rest }) {
  return (
    <a href={to} className={className} {...rest}>
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Navigate – redirect component (like react-router's <Navigate>)    */
/* ------------------------------------------------------------------ */
export function Navigate({ to, replace = false }) {
  if (typeof window !== 'undefined') {
    if (replace) {
      window.location.replace(to);
    } else {
      window.location.href = to;
    }
  }
  return null;
}
