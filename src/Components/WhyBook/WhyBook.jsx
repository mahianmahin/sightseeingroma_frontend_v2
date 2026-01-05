import React, { useState, useEffect } from 'react';
import { FaLandmark, FaHandshake, FaTag, FaHeadset } from 'react-icons/fa';
import { baseUrlHashless } from '../../utilities/Utilities';

const WhyBook = ({ isEditor = false, getImageByTag = null, loading = false }) => {
    // State to control background opacity and image URL
    const [bgOpacity, setBgOpacity] = useState(0.25);
    const [bgUrl, setBgUrl] = useState(null);

    useEffect(() => {
        if (!loading && getImageByTag) {
            const data = getImageByTag('why-book-bg');
            if (data && data.image && data.image.file) {
                setBgUrl(`${baseUrlHashless}${data.image.file}`);
                return;
            }
        }
        // fallback (optional local image path)
        setBgUrl('/Banner/Background.jpg');
    }, [getImageByTag, loading]);

    const boxes = [
        {
            icon: <FaLandmark className="text-lg md:text-xl" />,
            title: 'Rome-focused expertise',
            desc: 'Local knowledge and curated tours to make the most of your time in Rome.'
        },
        {
            icon: <FaHandshake className="text-lg md:text-xl" />,
            title: 'Trusted operators',
            desc: 'We partner with trusted local operators who prioritize safety and quality.'
        },
        {
            icon: <FaTag className="text-lg md:text-xl" />,
            title: 'Transparent pricing',
            desc: 'No hidden fees — clear pricing and easy booking so you can book with confidence.'
        },
        {
            icon: <FaHeadset className="text-lg md:text-xl" />,
            title: 'Customer support',
            desc: 'Friendly support to help before, during, and after your trip.'
        }
    ];

    return (
        <section id="why-book" className="relative py-8 md:py-14">
            {/* Background image layer */}
            <div className="absolute inset-0 -z-0">
                <div
                    className="w-full h-full bg-center bg-cover"
                    style={{ backgroundImage: `url(${bgUrl})`, opacity: bgOpacity }}
                />
                <div className="absolute inset-0 bg-white/75 md:bg-white/50"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4">
                <div className="text-center mb-6 md:mb-10">
                    <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-gray-900">Why book with us</h2>
                    <div className="w-20 h-1 bg-[#FAD502] mx-auto rounded-full mt-3"></div>
                    <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm md:text-base">Trusted services tailored for Rome travellers — we make planning easy so you can focus on exploring.</p>
                </div>

                {/* Icon boxes - mobile: 2 per row */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {boxes.map((b, i) => (
                        <div key={i} className="bg-white/80 backdrop-blur-sm rounded-lg p-3 md:p-5 flex flex-col items-start gap-3 shadow-sm">
                            <div className="bg-[#FAD502] text-[#930B31] p-2 md:p-3 rounded-full shadow-sm">
                                {b.icon}
                            </div>
                            <h3 className="text-sm md:text-lg font-bold text-gray-900">{b.title}</h3>
                            <p className="text-xs md:text-sm text-gray-600">{b.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Editor-only controls */}
                {isEditor && (
                    <div className="mt-4 md:mt-6 flex flex-col md:flex-row items-center gap-3 justify-center">
                        <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-700">Background opacity</label>
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.05}
                                value={bgOpacity}
                                onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
                                className="w-40"
                            />
                            <span className="text-sm text-gray-700">{Math.round(bgOpacity * 100)}%</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-700">Background image URL</label>
                            <input
                                type="text"
                                value={bgUrl || ''}
                                onChange={(e) => setBgUrl(e.target.value)}
                                className="rounded-md border border-gray-200 px-3 py-1 text-sm w-60"
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default WhyBook;
