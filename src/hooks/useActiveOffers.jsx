import { useState, useEffect, createContext, useContext } from 'react';
import { baseUrl } from '../utilities/Utilities';
import { deferredFetch } from '../utilities/deferredFetch';

// Create context for active offers
const ActiveOffersContext = createContext(null);

// Module-level cache so multiple Card components share one fetch
let _cachedOffers = null;
let _fetchPromise = null;

function fetchOffersOnce() {
    if (_fetchPromise) return _fetchPromise;
    _fetchPromise = fetch(`${baseUrl}featured-offers/by-package/`)
        .then(r => r.ok ? r.json() : null)
        .then(d => {
            _cachedOffers = (d && d.status === 200) ? (d.data || {}) : {};
            return _cachedOffers;
        })
        .catch(() => {
            _cachedOffers = {};
            return _cachedOffers;
        });
    return _fetchPromise;
}

// Provider component to wrap the app (legacy SPA usage)
export const ActiveOffersProvider = ({ children }) => {
    const [activeOffers, setActiveOffers] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActiveOffers = async () => {
            try {
                const data = await deferredFetch(`${baseUrl}featured-offers/by-package/`);
                if (data.status === 200) {
                    setActiveOffers(data.data || {});
                }
            } catch (error) {
                console.error('Failed to fetch active offers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActiveOffers();

        // Refresh every 5 minutes
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`${baseUrl}featured-offers/by-package/`);
                const data = await res.json();
                if (data.status === 200) {
                    setActiveOffers(data.data || {});
                }
            } catch (error) {
                console.error('Failed to refresh active offers:', error);
            }
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <ActiveOffersContext.Provider value={{ activeOffers, loading }}>
            {children}
        </ActiveOffersContext.Provider>
    );
};

// Hook to use active offers — self-fetching when no provider is present (Astro islands)
export const useActiveOffers = () => {
    const context = useContext(ActiveOffersContext);
    const [standalone, setStandalone] = useState({ activeOffers: _cachedOffers || {}, loading: !_cachedOffers });

    useEffect(() => {
        // Only fetch independently if there's no provider wrapping us
        if (context) return;
        if (_cachedOffers) {
            setStandalone({ activeOffers: _cachedOffers, loading: false });
            return;
        }
        fetchOffersOnce().then(data => {
            setStandalone({ activeOffers: data, loading: false });
        });
    }, [context]);

    if (context) return context;
    return standalone;
};

// Helper function to check if a package has an active offer
export const getOfferForPackage = (activeOffers, packageTag) => {
    if (!activeOffers || !packageTag) return null;
    return activeOffers[packageTag] || null;
};

export default useActiveOffers;
