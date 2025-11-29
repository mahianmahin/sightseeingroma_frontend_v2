import { useState, useEffect, useRef } from 'react';
import { FaStar, FaTicketAlt, FaRoute } from 'react-icons/fa';

const SectionNav = () => {
    const [activeSection, setActiveSection] = useState('features');
    const [isSticky, setIsSticky] = useState(false);
    const sectionNavRef = useRef(null);

    const sections = [
        { id: 'tickets', label: 'TICKETS', icon: FaTicketAlt },
        { id: 'features', label: 'FEATURES', icon: FaStar },
        { id: 'routes', label: 'ROUTES', icon: FaRoute }
    ];

    // Scroll to section
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 100; // Offset for fixed navbar
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveSection(sectionId);
        }
    };

    // Detect scroll position and update active section
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150;

            // Check if the component is actually stuck at the top
            // by comparing its position to the viewport top
            if (sectionNavRef.current) {
                const rect = sectionNavRef.current.getBoundingClientRect();
                // If the component is at the very top (position 0), it's stuck
                setIsSticky(rect.top <= 0);
            }

            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Call once on mount to set initial state
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div ref={sectionNavRef} className="sticky top-0 z-40 bg-white shadow-md">
            {/* Mobile View - Full Width Buttons */}
            <div className="lg:hidden">
                <div className="flex w-full">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        
                        return (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`flex-1 py-3 px-3 font-bold text-sm transition-all duration-300 relative ${
                                    isActive
                                        ? 'bg-[#930B31] text-white'
                                        : 'bg-[#FFF5F5] text-gray-700 hover:bg-[#FFE5E5]'
                                }`}
                            >
                                <div className="flex flex-col items-center justify-center gap-1">
                                    {/* Hide icons when sticky on mobile */}
                                    {!isSticky && (
                                        <Icon className={`text-lg ${isActive ? 'text-[#FAD502]' : 'text-[#930B31]'}`} />
                                    )}
                                    <span className={isSticky ? 'text-sm' : 'text-xs'}>{section.label}</span>
                                </div>
                                
                                {/* Active indicator line */}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FAD502]"></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Desktop View - Left Aligned Buttons */}
            <div className="hidden lg:block">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex gap-2 justify-start max-w-2xl">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;
                            
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 flex items-center gap-2 relative overflow-hidden ${
                                        isActive
                                            ? 'bg-[#930B31] text-white shadow-lg'
                                            : 'bg-[#FFF5F5] text-gray-700 hover:bg-[#FFE5E5] hover:shadow-md'
                                    }`}
                                >
                                    <Icon className={`text-lg ${isActive ? 'text-[#FAD502]' : 'text-[#930B31]'}`} />
                                    <span>{section.label}</span>
                                    
                                    {/* Active indicator */}
                                    {isActive && (
                                        <div className="absolute inset-0 border-2 border-[#FAD502] rounded-lg pointer-events-none"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectionNav;
