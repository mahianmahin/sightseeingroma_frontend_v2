import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaArrowLeft } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { baseUrl, baseUrlHashless } from '../utilities/Utilities';
import GlobalSEO from '../Components/GlobalSEO';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);
    
    fetch(`${baseUrl}blog/posts/${slug}/`)
      .then(res => {
        if (!res.ok) throw new Error('Blog post not found');
        return res.json();
      })
      .then(result => {
        if (result.status === 200) {
          setPost(result.data);
          setRelatedPosts(result.related_posts || []);
        } else {
          setError('Blog post not found');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching post:', err);
        setError('Blog post not found');
        setLoading(false);
      });
  }, [slug]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Helper function to strip HTML tags for meta tags and alt text
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading... - SightseeingRoma Blog</title>
          <meta name="description" content="Loading blog post" />
        </Helmet>
        <GlobalSEO />
        {/* Hero Section Skeleton */}
        <div className="relative w-full h-[400px] md:h-[500px] bg-gray-300 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto max-w-5xl">
              <div className="h-10 bg-white/30 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-white/20 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Helmet>
          <title>Blog Not Found - SightseeingRoma</title>
          <meta name="description" content="The requested blog post could not be found" />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <GlobalSEO />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/blogs')}
              className="bg-[#930B31] text-white px-6 py-3 rounded-lg hover:bg-[#7a0926] transition-colors"
            >
              Back to Blogs
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{post.meta_title || `${stripHtml(post.title)} - SightseeingRoma Blog`}</title>
        <meta name="description" content={post.meta_description || post.excerpt || stripHtml(post.title)} />
        {post.meta_keywords && <meta name="keywords" content={post.meta_keywords} />}
        <meta name="author" content={post.author_name || 'SightseeingRoma'} />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.meta_title || stripHtml(post.title)} />
        <meta property="og:description" content={post.meta_description || post.excerpt || stripHtml(post.title)} />
        <meta property="og:url" content={`https://www.sightseeingroma.com/blog/${post.slug}`} />
        {post.featured_image_url && (
          <meta property="og:image" content={`${baseUrlHashless}${post.featured_image_url}`} />
        )}
        <meta property="og:site_name" content="SightseeingRoma" />
        <meta property="article:published_time" content={post.published_at} />
        <meta property="article:modified_time" content={post.updated_at} />
        {post.author_name && <meta property="article:author" content={post.author_name} />}
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.meta_title || stripHtml(post.title)} />
        <meta name="twitter:description" content={post.meta_description || post.excerpt || stripHtml(post.title)} />
        {post.featured_image_url && (
          <meta name="twitter:image" content={`${baseUrlHashless}${post.featured_image_url}`} />
        )}
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://www.sightseeingroma.com/blog/${post.slug}`} />
        
        {/* Article Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": stripHtml(post.title),
            "description": post.meta_description || post.excerpt,
            "image": post.featured_image_url ? `${baseUrlHashless}${post.featured_image_url}` : undefined,
            "author": {
              "@type": "Person",
              "name": post.author_name || "SightseeingRoma"
            },
            "publisher": {
              "@type": "Organization",
              "name": "SightseeingRoma",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.sightseeingroma.com/logo.png"
              }
            },
            "datePublished": post.published_at,
            "dateModified": post.updated_at,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://www.sightseeingroma.com/blog/${post.slug}`
            }
          })}
        </script>
      </Helmet>
      <GlobalSEO />
      
      {/* Hero Section with Image and Title Overlay */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        {post.featured_image_url ? (
          <>
            <img
              src={`${baseUrlHashless}${post.featured_image_url}`}
              alt={post.featured_image_alt || stripHtml(post.title)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#930B31] to-[#7a0926]"></div>
        )}
        
        {/* Title and Meta Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12">
          <div className="container mx-auto max-w-5xl">
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg"
              dangerouslySetInnerHTML={{ __html: post.title }}
            />
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-[#FAD502]" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-[#FAD502]" />
                <span>{post.read_time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="bg-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Back Button */}
            <button
              onClick={() => navigate('/blogs')}
              className="flex items-center gap-2 text-[#930B31] hover:text-[#7a0926] mb-8 transition-colors text-sm md:text-base"
            >
              <FaArrowLeft />
              <span>Back to Blogs</span>
            </button>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                fontSize: '1.125rem',
                lineHeight: '1.75',
                color: '#374151'
              }}
            />

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="border-t border-gray-200 pt-12 mt-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <div
                      key={relatedPost.id}
                      onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    >
                      {relatedPost.featured_image_url ? (
                        <img
                          src={`${baseUrlHashless}${relatedPost.featured_image_url}`}
                          alt={relatedPost.featured_image_alt || stripHtml(relatedPost.title)}
                          className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-[#930B31] to-[#FAD502]"></div>
                      )}
                      <div className="p-4">
                        <h3 
                          className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm md:text-base group-hover:text-[#930B31] transition-colors"
                          dangerouslySetInnerHTML={{ __html: relatedPost.title }}
                        />
                        <p className="text-xs text-gray-500">
                          {formatDate(relatedPost.published_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogDetail;
