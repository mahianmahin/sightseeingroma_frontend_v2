import { useEffect, useState } from 'react';
import { baseUrl } from '../utilities/Utilities';

const Sitemap = () => {
  const [sitemapContent, setSitemapContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch sitemap from backend
    fetch(`${baseUrl}sitemap.xml`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch sitemap');
        return res.text();
      })
      .then(xml => {
        setSitemapContent(xml);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching sitemap:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'monospace'
      }}>
        Loading sitemap...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'monospace',
        color: 'red'
      }}>
        Error loading sitemap: {error}
      </div>
    );
  }

  // Display XML content in a pre tag with proper styling
  return (
    <div style={{ 
      backgroundColor: '#fff', 
      minHeight: '100vh',
      padding: '0',
      margin: '0'
    }}>
      <pre style={{ 
        fontFamily: 'monospace',
        fontSize: '14px',
        lineHeight: '1.4',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        margin: '0',
        padding: '20px',
        backgroundColor: '#fff',
        color: '#000'
      }}>
        {sitemapContent}
      </pre>
    </div>
  );
};

export default Sitemap;
