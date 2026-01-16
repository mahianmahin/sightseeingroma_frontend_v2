import React, { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';

const CountdownTimer = ({ endTime, compact = false }) => {
    const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

    function calculateTimeRemaining() {
        const now = new Date().getTime();
        const end = new Date(endTime).getTime();
        const difference = end - now;

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000),
            expired: false
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining());
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    if (timeRemaining.expired) {
        return (
            <div className={`flex items-center gap-1.5 text-red-600 ${compact ? 'text-xs' : 'text-sm'}`}>
                <FaClock className="flex-shrink-0" />
                <span className="font-semibold">Offer Expired</span>
            </div>
        );
    }

    if (compact) {
        return (
            <div className="flex items-center gap-1.5 text-[#930B31]">
                <FaClock className="text-xs flex-shrink-0" />
                <span className="text-xs font-semibold">
                    {timeRemaining.days > 0 && `${timeRemaining.days}d `}
                    {String(timeRemaining.hours).padStart(2, '0')}:
                    {String(timeRemaining.minutes).padStart(2, '0')}:
                    {String(timeRemaining.seconds).padStart(2, '0')}
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <FaClock className="text-[#930B31] text-lg" />
            <div className="flex gap-2">
                {timeRemaining.days > 0 && (
                    <div className="flex flex-col items-center bg-gray-100 rounded-lg px-3 py-2">
                        <span className="text-xl md:text-2xl font-bold text-[#930B31]">
                            {String(timeRemaining.days).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase">Days</span>
                    </div>
                )}
                <div className="flex flex-col items-center bg-gray-100 rounded-lg px-3 py-2">
                    <span className="text-xl md:text-2xl font-bold text-[#930B31]">
                        {String(timeRemaining.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase">Hrs</span>
                </div>
                <div className="flex flex-col items-center bg-gray-100 rounded-lg px-3 py-2">
                    <span className="text-xl md:text-2xl font-bold text-[#930B31]">
                        {String(timeRemaining.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase">Min</span>
                </div>
                <div className="flex flex-col items-center bg-gray-100 rounded-lg px-3 py-2">
                    <span className="text-xl md:text-2xl font-bold text-[#930B31]">
                        {String(timeRemaining.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase">Sec</span>
                </div>
            </div>
        </div>
    );
};

export default CountdownTimer;
