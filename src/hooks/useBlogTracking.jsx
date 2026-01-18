import { useCallback, useRef } from 'react';
import { baseUrl } from '../utilities/Utilities';

// Storage keys
const VISITOR_ID_KEY = 'blog_visitor_id';
const VISITOR_INITIALIZED_KEY = 'blog_visitor_initialized';
const BLOG_HISTORY_KEY = 'blog_visit_history';  // Persists across sessions

/**
 * Generate a unique visitor ID.
 * Format: VIS-{timestamp}-{random}
 */
const generateVisitorId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `VIS-${timestamp}-${random}`;
};

/**
 * Get or create a persistent visitor ID.
 * This ID persists across browser sessions (localStorage).
 */
const getVisitorId = () => {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  
  if (!visitorId) {
    visitorId = generateVisitorId();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  
  return visitorId;
};

/**
 * Check if visitor has been initialized with IP/country data.
 */
const isVisitorInitialized = () => {
  return localStorage.getItem(VISITOR_INITIALIZED_KEY) === 'true';
};

/**
 * Mark visitor as initialized.
 */
const setVisitorInitialized = () => {
  localStorage.setItem(VISITOR_INITIALIZED_KEY, 'true');
};

/**
 * Get the list of blogs this visitor has viewed (persists across sessions).
 */
const getBlogHistory = () => {
  const history = localStorage.getItem(BLOG_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

/**
 * Add a blog slug to the visitor's history.
 */
const addToBlogHistory = (blogSlug) => {
  const history = getBlogHistory();
  if (!history.includes(blogSlug)) {
    history.push(blogSlug);
    localStorage.setItem(BLOG_HISTORY_KEY, JSON.stringify(history));
  }
};

/**
 * Check if visitor has ever visited a blog.
 */
const hasVisitedAnyBlog = () => {
  return getBlogHistory().length > 0;
};

/**
 * Hook for tracking blog conversions.
 * 
 * Key features:
 * - Unique visitor ID persists across browser sessions
 * - Blog visit history persists (so tomorrow's purchase still counts as conversion)
 * - IP/Country detection done server-side for better reliability
 * - Tracks: blog visits → ticket visits → payment initiation → completion/cancellation
 */
const useBlogTracking = () => {
  const trackingRef = useRef({ hasTracked: {}, isInitializing: false });

  /**
   * Initialize visitor tracking with IP and country data.
   * Called automatically on first blog visit.
   * IP detection is now done server-side for better reliability.
   */
  const initializeVisitor = useCallback(async (blogSlug) => {
    // Prevent multiple simultaneous initializations
    if (trackingRef.current.isInitializing) return;
    if (isVisitorInitialized()) return;
    
    trackingRef.current.isInitializing = true;
    
    const visitorId = getVisitorId();
    
    try {
      // Send to backend - server will detect IP and country
      await fetch(`${baseUrl}init-visitor-tracking/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitor_id: visitorId,
          blog_slug: blogSlug,
        }),
      });
      
      setVisitorInitialized();
      if (blogSlug) {
        addToBlogHistory(blogSlug);
      }
    } catch (error) {
      console.error('Error initializing visitor tracking:', error);
    } finally {
      trackingRef.current.isInitializing = false;
    }
  }, []);

  /**
   * Track a blog visit - call this when user views a blog post.
   * If this is a new visitor, also initializes tracking with IP/country.
   */
  const trackBlogVisit = useCallback(async (blogSlug) => {
    if (!blogSlug) return;
    
    const visitorId = getVisitorId();
    
    // If visitor not initialized, do full initialization
    if (!isVisitorInitialized()) {
      await initializeVisitor(blogSlug);
      return;
    }
    
    // Avoid duplicate tracking for the same blog in this page session
    const trackingKey = `blog_${blogSlug}`;
    if (trackingRef.current.hasTracked[trackingKey]) return;
    
    try {
      await fetch(`${baseUrl}track-blog-visit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitor_id: visitorId,
          blog_slug: blogSlug,
        }),
      });
      
      trackingRef.current.hasTracked[trackingKey] = true;
      addToBlogHistory(blogSlug);
    } catch (error) {
      console.error('Error tracking blog visit:', error);
    }
  }, [initializeVisitor]);

  /**
   * Track a ticket/package page visit.
   * Tracks regardless of when the blog was visited (even days ago).
   */
  const trackTicketVisit = useCallback(async (packageTag) => {
    const visitorId = getVisitorId();
    
    // Only track if visitor has ever visited a blog (could be days ago)
    if (!hasVisitedAnyBlog()) return;
    
    // Avoid duplicate tracking for the same package in this page session
    const trackingKey = `ticket_${packageTag}`;
    if (trackingRef.current.hasTracked[trackingKey]) return;
    
    try {
      await fetch(`${baseUrl}track-ticket-visit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitor_id: visitorId,
          package_tag: packageTag || null,
        }),
      });
      
      trackingRef.current.hasTracked[trackingKey] = true;
    } catch (error) {
      console.error('Error tracking ticket visit:', error);
    }
  }, []);

  /**
   * Track payment initiation (user clicks checkout button).
   * Call this when user initiates payment before Stripe redirect.
   */
  const trackPaymentInitiate = useCallback(async (packageTag) => {
    const visitorId = getVisitorId();
    
    // Only track if visitor has ever visited a blog
    if (!hasVisitedAnyBlog()) return;
    
    try {
      await fetch(`${baseUrl}track-payment-initiate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitor_id: visitorId,
          package_tag: packageTag || null,
        }),
      });
    } catch (error) {
      console.error('Error tracking payment initiation:', error);
    }
  }, []);

  /**
   * Track successful payment completion - THIS IS A CONVERSION!
   * Call this on the payment success page.
   */
  const trackPaymentComplete = useCallback(async (packageTag) => {
    const visitorId = getVisitorId();
    
    // Only track if visitor has ever visited a blog
    if (!hasVisitedAnyBlog()) return;
    
    // Avoid duplicate tracking
    if (trackingRef.current.hasTracked['payment_complete']) return;
    
    try {
      await fetch(`${baseUrl}track-payment-complete/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitor_id: visitorId,
          package_tag: packageTag || null,
        }),
      });
      
      trackingRef.current.hasTracked['payment_complete'] = true;
    } catch (error) {
      console.error('Error tracking payment completion:', error);
    }
  }, []);

  /**
   * Track payment cancellation/abandonment.
   * Call this on the payment cancel page.
   */
  const trackPaymentCancel = useCallback(async () => {
    const visitorId = getVisitorId();
    
    // Only track if visitor has ever visited a blog
    if (!hasVisitedAnyBlog()) return;
    
    // Avoid duplicate tracking
    if (trackingRef.current.hasTracked['payment_cancel']) return;
    
    try {
      await fetch(`${baseUrl}track-payment-cancel/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitor_id: visitorId,
        }),
      });
      
      trackingRef.current.hasTracked['payment_cancel'] = true;
    } catch (error) {
      console.error('Error tracking payment cancellation:', error);
    }
  }, []);

  return {
    trackBlogVisit,
    trackTicketVisit,
    trackPaymentInitiate,
    trackPaymentComplete,
    trackPaymentCancel,
    getVisitorId,
    hasVisitedAnyBlog,
    getBlogHistory,
  };
};

export default useBlogTracking;
export { getVisitorId, hasVisitedAnyBlog, getBlogHistory };
