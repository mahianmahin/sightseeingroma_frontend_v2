

import React, { useState, useEffect } from 'react';
import PartnerLogosEditWrapper from '../Edit_Wrapper/PartnerLogosEditWrapper';
import { baseUrl, baseUrlHashless } from '../../utilities/Utilities';

const HeroBottom = () => {
    const [partnerLogos, setPartnerLogos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch partner logos from the API
    const fetchPartnerLogos = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}partner-logos`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch partner logos');
            }
            
            const data = await response.json();
            
            if (data.status === 200 && data.data) {
                setPartnerLogos(data.data);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error fetching partner logos:', err);
            setError(err.message);
            // Fallback to default logos if API fails
            setPartnerLogos([
                { id: 1, name: 'Partner 1', logo_url: 'https://iili.io/2TycEQ9.png', alt_text: 'Partner 1' },
                { id: 2, name: 'Partner 2', logo_url: 'https://iili.io/2Tyloaj.png', alt_text: 'Partner 2' },
                { id: 3, name: 'Partner 3', logo_url: 'https://iili.io/2Tyl7MF.png', alt_text: 'Partner 3' },
                { id: 4, name: 'Partner 4', logo_url: 'https://iili.io/2Tylv94.png', alt_text: 'Partner 4' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartnerLogos();
    }, []);

    // Handle logos update from the editor
    const handleLogosUpdate = () => {
        fetchPartnerLogos();
    };

    // Show loading state
    if (loading) {
        return (
            <PartnerLogosEditWrapper onLogosUpdate={handleLogosUpdate}>
                <div className="bg-[#FAD50266] py-4 md:py-12 overflow-hidden">
                    <div className="relative mb-0 md:mb-0 mb-0">
                        <div className="flex animate-pulse">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={`loading-${index}`} className="flex-shrink-0 mx-10 md:mx-20">
                                    <div className="h-6 md:h-8 w-16 md:w-20 bg-gray-300 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </PartnerLogosEditWrapper>
        );
    }

    // Show error state (with fallback logos)
    if (error && partnerLogos.length === 0) {
        return (
            <PartnerLogosEditWrapper onLogosUpdate={handleLogosUpdate}>
                <div className="bg-[#FAD50266] py-4 md:py-12 overflow-hidden">
                    <div className="relative mb-0 md:mb-0 mb-0">
                        <div className="text-center text-gray-500 text-sm">
                            Unable to load partner logos
                        </div>
                    </div>
                </div>
            </PartnerLogosEditWrapper>
        );
    }

    return (
        <PartnerLogosEditWrapper onLogosUpdate={handleLogosUpdate}>
            <div className="bg-[#FAD50266] py-4 md:py-12 overflow-hidden">
                <div className="relative mb-0 md:mb-0 mb-0">
                    {/* Scrolling Container */}
                    <div className="flex animate-scroll-right">
                        {/* Multiple sets to fill the entire row seamlessly */}
                        {Array.from({ length: 20 }).map((_, setIndex) =>
                            partnerLogos.map((logo, index) => {
                                // Construct full URL for the logo
                                const logoUrl = logo.logo_url?.startsWith('http') 
                                    ? logo.logo_url 
                                    : `${baseUrlHashless}${logo.logo_url}`;
                                
                                const logoElement = (
                                    <div key={`${setIndex}-${logo.id || index}`} className="flex-shrink-0 mx-10 md:mx-20">
                                        <img
                                            src={logoUrl}
                                            className="h-6 md:h-8 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
                                            alt={logo.alt_text || logo.name || `Partner ${index + 1}`}
                                            loading="lazy"
                                            onError={(e) => {
                                                // Fallback for broken images
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                );

                                // If the logo has a website URL, wrap it in a link
                                if (logo.website_url) {
                                    return (
                                        <a
                                            key={`link-${setIndex}-${logo.id || index}`}
                                            href={logo.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-shrink-0"
                                        >
                                            {logoElement}
                                        </a>
                                    );
                                }

                                return logoElement;
                            })
                        )}
                    </div>
                </div>
            </div>
        </PartnerLogosEditWrapper>
    );
};

export default HeroBottom;
