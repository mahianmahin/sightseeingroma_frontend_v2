import { useEffect } from 'react';
import { baseUrl } from '../utilities/Utilities';

const Sitemap = () => {
  useEffect(() => {
    // Redirect to the backend sitemap URL
    window.location.href = `${baseUrl}sitemap.xml`;
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'monospace',
      fontSize: '16px'
    }}>
      Redirecting to sitemap...
    </div>
  );
};

export default Sitemap;
