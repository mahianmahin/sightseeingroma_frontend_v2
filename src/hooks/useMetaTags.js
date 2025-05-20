import { useEffect } from 'react';

const useMetaTags = ({ title, description }) => {
  useEffect(() => {
    // Update title
    if (title) {
      document.title = title;
    }

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    if (description) {
      metaDescription.setAttribute('content', description);
    }

    // Cleanup function
    return () => {
      // Reset to default title if needed
      document.title = 'Sightseeing Roma';
      // Reset to default description if needed
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Discover Rome with Sightseeing Roma - Your trusted partner for Rome tours and tickets');
      }
    };
  }, [title, description]);
};

export default useMetaTags; 