import { Helmet } from 'react-helmet-async';
import { baseUrl, baseUrlHashless } from '../../utilities/Utilities';

const SEO = ({ staticContentData, defaultTitle = "Sightseeing Roma", defaultDescription = "Explore Rome with our hop-on hop-off bus tours" }) => {
    // Since useStaticContent returns individual properties, not an object with .page
    // We need to handle the structure differently
    const loading = staticContentData?.loading;
    const pageData = staticContentData?.pageData;
    const error = staticContentData?.error;

    // If still loading or no page data, return minimal SEO
    if (loading || !pageData || error) {
        return (
            <Helmet>
                <title>{defaultTitle}</title>
                <meta name="description" content={defaultDescription} />
                {/* Allow crawling of default content */}
                <meta name="robots" content="index, follow" />
            </Helmet>
        );
    }

    const page = pageData;
    
    // Generate title - use meta_title if available, otherwise use page title, fallback to default
    const title = page.meta_title || page.title || defaultTitle;
    
    // Generate description - use meta_description if available, fallback to default
    const description = page.meta_description || defaultDescription;
    
    // Generate keywords - use meta_keywords if available
    const keywords = page.meta_keywords || "";
    
    // Parse schema JSON if available
    let schemaJson = null;
    if (page.schema_json) {
        try {
            schemaJson = typeof page.schema_json === 'string' 
                ? JSON.parse(page.schema_json) 
                : page.schema_json;
        } catch (error) {
            console.warn('Invalid schema JSON:', error);
        }
    }

    // Generate canonical URL safely
    const getCanonicalUrl = () => {
        if (typeof window === 'undefined') {
            // Server-side rendering fallback
            return page.slug ? `${baseUrl}${page.slug}` : baseUrlHashless;
        }
        return page.slug ? `${window.location.origin}/${page.slug}` : window.location.href;
    };
    
    const canonicalUrl = getCanonicalUrl();

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            
            {/* Canonical URL */}
            <link rel="canonical" href={canonicalUrl} />
            
            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Sightseeing Roma" />
            
            {/* Twitter Card Meta Tags */}
            {/* <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} /> */}
            
            {/* Additional Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="author" content="Sightseeing Roma" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            
            {/* Schema.org Structured Data */}
            {schemaJson && (
                <script type="application/ld+json">
                    {JSON.stringify(schemaJson)}
                </script>
            )}
            
            {/* Default Schema.org for pages without custom schema */}
            {!schemaJson && (
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": title,
                        "description": description,
                        "url": canonicalUrl,
                        "isPartOf": {
                            "@type": "WebSite",
                            "name": "Sightseeing Roma",
                            "url": typeof window !== 'undefined' ? window.location.origin : `${baseUrlHashless}`
                        },
                        "inLanguage": "en",
                        "potentialAction": {
                            "@type": "ReadAction",
                            "target": canonicalUrl
                        }
                    })}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
