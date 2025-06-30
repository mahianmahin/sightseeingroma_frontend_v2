import { getUserIP, getUserCountry } from './userInfo';
import { baseUrl } from './Utilities';
import React, { useEffect } from 'react';

// Activity Types
export const ACTIVITY_TYPES = {
    // Page Views
    PAGE_VIEW: 'page_view',
    
    // Authentication
    USER_LOGIN: 'user_login',
    USER_LOGOUT: 'user_logout',
    USER_REGISTER: 'user_register',
    PASSWORD_RESET: 'password_reset',
    
    // Tickets
    TICKET_VIEW: 'ticket_view',
    TICKET_SEARCH: 'ticket_search',
    
    // Payments
    PAYMENT_INITIATED: 'payment_initiated',
    PAYMENT_COMPLETED: 'payment_completed',
    PAYMENT_CANCELLED: 'payment_cancelled',
    
    // User Actions
    PROFILE_UPDATE: 'profile_update',
    BOOKING_MANAGE: 'booking_manage'
};

// Format timestamp in GMT+6 with AM/PM
const formatTimestamp = () => {
    const date = new Date();
    date.setHours(date.getHours() + 6); // Convert to GMT+6
    return date.toLocaleString('en-US', {
        timeZone: 'Asia/Dhaka',
        hour12: true
    });
};

export const trackUserActivity = async (
    activityType,
    additionalData = {}
) => {
    try {
        const ip = await getUserIP();
        const locationInfo = ip ? await getUserCountry(ip) : null;
        const token = localStorage.getItem('access');
        const currentPath = window.location.pathname;
        const currentUrl = window.location.href;

        const activityData = {
            action: activityType,
            timestamp: formatTimestamp(),
            ipAddress: ip,
            page: currentPath,
            fullUrl: currentUrl,
            ...locationInfo,
            ...additionalData,
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            device: /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(navigator.userAgent) ? 'mobile' : 'desktop'
        };

        // Send activity data to backend
        await fetch(`${baseUrl}track-activity/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(activityData)
        });

    } catch (error) {
        console.error('Error tracking activity:', error);
    }
};

// Higher-order component for page view tracking
export const withPageTracking = (WrappedComponent, pageName) => {
    return function TrackingComponent(props) {
        useEffect(() => {
            trackUserActivity(ACTIVITY_TYPES.PAGE_VIEW, { pageName });
        }, []);

        return React.createElement(WrappedComponent, props);
    };
};

// Predefined activity types
export const ACTIVITIES = {
    PAGE_VIEW: (page) => `Viewed ${page} page`,
    TICKET_VIEW: (ticketType) => `Viewed ${ticketType} ticket`,
    PAYMENT_INITIATED: (amount) => `Initiated payment of €${amount}`,
    PAYMENT_COMPLETED: (amount) => `Completed payment of €${amount}`,
    PAYMENT_CANCELLED: (amount) => `Cancelled payment of €${amount}`,
    LOGIN: 'User logged in',
    LOGOUT: 'User logged out',
    REGISTRATION: 'User registered'
}; 