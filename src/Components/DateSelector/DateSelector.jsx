import { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const DateSelector = ({ selectedDate, onDateChange, isMobile = false, ticketCount = 1 }) => {
    const [activeOption, setActiveOption] = useState('today');
    const [showCalendar, setShowCalendar] = useState(false);
    const [calendarDate, setCalendarDate] = useState('');

    // Calculate min and max dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const minDate = today.toISOString().split('T')[0];
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 5);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    // Format date for display
    const formatDate = (date) => {
        const d = new Date(date);
        const day = d.getDate();
        const month = d.toLocaleDateString('en-US', { month: 'short' });
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const handleTodayClick = () => {
        const todayStr = today.toISOString().split('T')[0];
        setActiveOption('today');
        setShowCalendar(false);
        onDateChange(todayStr);
    };

    const handleTomorrowClick = () => {
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        setActiveOption('tomorrow');
        setShowCalendar(false);
        onDateChange(tomorrowStr);
    };

    const handlePickDateClick = () => {
        setActiveOption('pick');
        setShowCalendar(true);
    };

    const handleCalendarChange = (e) => {
        const selectedDateStr = e.target.value;
        setCalendarDate(selectedDateStr);
        onDateChange(selectedDateStr);
        setShowCalendar(false);
    };

    // Set today as default on mount
    useEffect(() => {
        if (!selectedDate) {
            const todayStr = today.toISOString().split('T')[0];
            onDateChange(todayStr);
            setActiveOption('today');
        }
    }, []);

    // Determine which option is active based on selectedDate
    useEffect(() => {
        if (selectedDate) {
            const todayStr = today.toISOString().split('T')[0];
            const tomorrowStr = tomorrow.toISOString().split('T')[0];
            
            if (selectedDate === todayStr) {
                setActiveOption('today');
            } else if (selectedDate === tomorrowStr) {
                setActiveOption('tomorrow');
            } else {
                setActiveOption('pick');
                setCalendarDate(selectedDate);
            }
        }
    }, [selectedDate]);

    return (
        <div className={`${isMobile ? 'w-full' : 'w-full md:w-auto'}`}>
            <h3 className="text-sm md:text-lg lg:font-bold mb-3">
                I need the ticket{ticketCount > 1 ? 's' : ''} for: 
            </h3>
            
            {/* Date Options */}
            <div className={`grid ${isMobile ? 'grid-cols-3 gap-2' : 'grid-cols-1 md:grid-cols-3 gap-3'} mb-4`}>
                {/* Today Button */}
                <button
                    onClick={handleTodayClick}
                    className={`py-3 px-4 rounded lg:rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 ${
                        activeOption === 'today'
                            ? 'bg-[#930B31] text-white shadow-lg'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#930B31] hover:text-[#930B31]'
                    }`}
                >
                    Today
                </button>

                {/* Tomorrow Button */}
                <button
                    onClick={handleTomorrowClick}
                    className={`py-3 px-4 rounded lg:rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 ${
                        activeOption === 'tomorrow'
                            ? 'bg-[#930B31] text-white shadow-lg'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#930B31] hover:text-[#930B31]'
                    }`}
                >
                    Tomorrow
                </button>

                {/* Pick a Date Button */}
                <button
                    onClick={handlePickDateClick}
                    className={`py-3 px-4 rounded lg:rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                        activeOption === 'pick'
                            ? 'bg-[#930B31] text-white shadow-lg'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#930B31] hover:text-[#930B31]'
                    }`}
                >
                    <FaCalendarAlt className="text-xs" />
                    Date
                </button>
            </div>

            {/* Calendar Input */}
            {showCalendar && (
                <div className="mb-4 p-4 bg-gradient-to-br from-red-50 to-yellow-50 border-2 border-[#930B31] rounded-lg shadow-lg animate-fadeIn">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FaCalendarAlt className="text-[#930B31]" />
                        Select Your Preferred Date
                    </label>
                    <input
                        type="date"
                        value={calendarDate}
                        min={minDate}
                        max={maxDateStr}
                        onChange={handleCalendarChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#930B31] focus:ring-2 focus:ring-[#930B31] focus:ring-opacity-20 text-gray-700 cursor-pointer transition-all duration-200 hover:border-[#930B31]"
                        style={{
                            colorScheme: 'light',
                        }}
                    />
                    <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                        <svg className="w-3 h-3 text-[#930B31]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Available: {formatDate(minDate)} to {formatDate(maxDateStr)}
                    </p>
                </div>
            )}

            {/* Selected Date Display */}
            {selectedDate && (
                <div className="">
                    <p className="text-sm text-red-800 flex items-center gap-2">
                        <FaCalendarAlt className="text-red-600" />
                        <span className="font-semibold">Selected Date:</span>
                        <span>{formatDate(selectedDate)}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default DateSelector;
