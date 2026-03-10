import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaClock } from 'react-icons/fa';
import { baseUrl, baseUrlHashless } from '../../utilities/Utilities';
import OptimizedImage from '../OptimizedImage/OptimizedImage';

/**
 * HeroFeaturedOffer — sleek full-bleed image card for the Hero right column
 * on mobile.  The entire card IS the image; a dark gradient fades in from the
 * bottom so price / timer / CTA are legible on top of it.
 *
 * Only essential info is shown — discount %, price, original price, timer,
 * and a CTA button.  Title / company omitted for a minimal, smart look.
 *
 * Behaviour:
 *   • Fetches /featured-offers/ on mount, picks the best-discount offer.
 *   • Calls `onHasOffer(true|false)` so the parent knows whether to swap.
 *   • Returns null while loading or when there's no offer to show.
 */
const HeroFeaturedOffer = ({ onHasOffer }) => {
    const navigate = useNavigate();
    const [offersData, setOffersData] = useState(null);

    useEffect(() => {
        fetch(`${baseUrl}featured-offers/`)
            .then(r => r.ok ? r.json() : null)
            .then(d => {
                const offers = d?.status === 200 && d.data?.length ? d.data : [];
                setOffersData(offers);
            })
            .catch(() => setOffersData([]));
    }, []);

    const bestOffer = useMemo(() => {
        if (!offersData || !offersData.length) return null;
        const withDiscount = offersData
            .filter(o => o.original_adult_price && o.offer_adult_price &&
                parseFloat(o.original_adult_price) > parseFloat(o.offer_adult_price))
            .map(o => ({
                ...o,
                discountPct: Math.round(
                    ((parseFloat(o.original_adult_price) - parseFloat(o.offer_adult_price)) /
                        parseFloat(o.original_adult_price)) * 100
                ),
            }));
        if (!withDiscount.length) return null;
        withDiscount.sort((a, b) => b.discountPct - a.discountPct);
        return withDiscount[0];
    }, [offersData]);

    // Notify parent whether an offer is available
    useEffect(() => {
        if (offersData === null) return; // still loading
        onHasOffer?.(!!bestOffer);
    }, [bestOffer, offersData, onHasOffer]);

    if (!bestOffer) return null;

    const {
        id,
        badge_text,
        offer_adult_price,
        original_adult_price,
        offer_image_url,
        offer_image_webp_url,
        offer_title,
        time_remaining,
        discountPct,
    } = bestOffer;

    const formatTime = (seconds) => {
        if (!seconds || seconds <= 0) return null;
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (d > 0) return `${d}d ${h}h`;
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    const timeLabel = formatTime(time_remaining);

    const imageUrl = offer_image_url
        ? (offer_image_url.startsWith('http') ? offer_image_url : `${baseUrlHashless}${offer_image_url}`)
        : null;
    const imageWebpUrl = offer_image_webp_url
        ? (offer_image_webp_url.startsWith('http') ? offer_image_webp_url : `${baseUrlHashless}${offer_image_webp_url}`)
        : undefined;

    return (
        <div
            onClick={() => navigate(`/featured-offers?highlight=${id}`)}
            className="relative rounded-2xl overflow-hidden max-w-sm w-full cursor-pointer
                       shadow-2xl ring-2 ring-[#FAD502]/60 hover:ring-[#FAD502]
                       transform hover:scale-[1.02] transition-all duration-300"
        >
            {/* Full-bleed image */}
            <div className="w-full aspect-[4/3]">
                {imageUrl ? (
                    <OptimizedImage
                        src={imageUrl}
                        srcWebp={imageWebpUrl}
                        alt={offer_title || 'Featured offer'}
                        className="w-full h-full object-cover"
                        wrapperClassName="w-full h-full"
                        sizes="(max-width: 768px) 85vw, 400px"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                )}
            </div>

            {/* Dark gradient overlay — fades in from bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/50 to-transparent pointer-events-none" />

            {/* Top badges */}
            <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-3 z-10">
                {/* Featured ribbon */}
                <span className="bg-[#930B31] text-white text-[10px] font-bold py-1 px-2.5 rounded-md uppercase tracking-wider shadow-lg">
                    {badge_text || 'Featured Today'}
                </span>

                {/* Discount badge */}
                {discountPct > 0 && (
                    <span className="bg-[#FAD502] text-gray-900 font-black text-sm px-2.5 py-1 rounded-md shadow-lg flex flex-col items-center leading-none">
                        <span className="text-base">{discountPct}%</span>
                        <span className="text-[8px] font-bold uppercase tracking-wider">OFF</span>
                    </span>
                )}
            </div>

            {/* Bottom content — overlaid on gradient */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                {/* Timer */}
                {timeLabel && (
                    <div className="flex items-center gap-1.5 mb-3">
                        <FaClock className="text-[#FAD502] text-xs" />
                        <span className="text-xs text-white/90 font-medium">
                            Ends in <span className="font-bold text-[#FAD502]">{timeLabel}</span>
                        </span>
                    </div>
                )}

                {/* Price row */}
                <div className="flex items-baseline gap-2.5 mb-3">
                    <span className="text-3xl font-black text-white drop-shadow-lg">
                        €{offer_adult_price}
                    </span>
                    {original_adult_price && parseFloat(original_adult_price) > parseFloat(offer_adult_price) && (
                        <span className="text-sm text-white/50 line-through font-medium">
                            €{original_adult_price}
                        </span>
                    )}
                    <span className="text-[10px] text-white/60 font-medium">/ person</span>
                </div>

                {/* CTA button */}
                <button className="w-full bg-[#FAD502] hover:bg-[#e5c302] text-gray-900 font-bold text-sm py-2.5 rounded-lg
                                   flex items-center justify-center gap-2 shadow-lg transition-colors duration-200">
                    View Offer
                    <FaArrowRight className="text-xs" />
                </button>
            </div>
        </div>
    );
};

export default HeroFeaturedOffer;
