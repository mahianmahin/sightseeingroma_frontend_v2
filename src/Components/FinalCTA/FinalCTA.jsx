import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrlHashless } from '../../utilities/Utilities';

const FinalCTA = ({ isEditor = false, getImageByTag = null, loading = false }) => {
    const navigate = useNavigate();

    // state for background image URL and opacity
    const [bgUrl, setBgUrl] = useState(null);
    const [bgOpacity, setBgOpacity] = useState(0.15);

    // default button link (can be changed by editor via bgUrl input control)
    const [buttonLink, setButtonLink] = useState('/company-packages/big-bus');

    const handleClick = () => {
        if (buttonLink) navigate(buttonLink);
    };

    return (
        <section className="relative py-8 md:py-12">
            {/* Background layer */}
            <div className="absolute inset-0 -z-0">
                {bgUrl ? (
                    <div className="w-full h-full bg-center bg-cover" style={{ opacity: bgOpacity }} />
                ) : (
                    <div className="w-full h-full bg-[#930B31]" style={{ opacity: 1 }} />
                )}
                {/* Brand color overlay with adjustable opacity to make sure CTA text is readable */}
                <div className="absolute inset-0 bg-[#930B31]" style={{ opacity: bgUrl ? (1 - bgOpacity) * 0.6 : 1 }}></div>
            </div>

            <div className="relative z-10 container mx-auto px-4">
                <div className="max-w-5xl mx-auto bg-transparent">
                    <div className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 md:gap-6">
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-white">Explore Rome the Smart Way</h2>
                            <p className="mt-2 text-sm md:text-base text-white/90">Save time, skip lines, and pick the perfect experience — all in one place.</p>
                        </div>

                        <div className="w-full md:w-auto">
                            <button
                                onClick={handleClick}
                                className="w-full md:w-auto bg-white text-[#930B31] font-bold py-3 px-6 rounded-md shadow-lg hover:shadow-xl transition-transform hover:-translate-y-0.5"
                            >
                                View All Tickets
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
