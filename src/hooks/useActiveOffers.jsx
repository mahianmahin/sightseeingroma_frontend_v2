import { useState, useEffect, createContext, useContext } from 'react';
import { baseUrl } from '../utilities/Utilities';

// Create context for active offers
const ActiveOffersContext = createContext(null);

// Provider component to wrap the app
export const ActiveOffersProvider = ({ children }) => {
    const [activeOffers, setActiveOffers] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActiveOffers = async () => {
            try {
                const response = await fetch(`${baseUrl}featured-offers/by-package/`);
                const data = await response.json();
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
        const interval = setInterval(fetchActiveOffers, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <ActiveOffersContext.Provider value={{ activeOffers, loading }}>
            {children}
        </ActiveOffersContext.Provider>
    );
};

// Hook to use active offers
export const useActiveOffers = () => {
    const context = useContext(ActiveOffersContext);
    if (!context) {
        // Return empty object if not wrapped in provider (graceful fallback)
        return { activeOffers: {}, loading: false };
    }
    return context;
};

// Helper function to check if a package has an active offer
export const getOfferForPackage = (activeOffers, packageTag) => {
    if (!activeOffers || !packageTag) return null;
    return activeOffers[packageTag] || null;
};

export default useActiveOffers;
