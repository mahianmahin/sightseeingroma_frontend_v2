import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaSearch } from 'react-icons/fa';
import { baseUrl, baseUrlHashless } from '../utilities/Utilities';
import GlobalSEO from '../Components/GlobalSEO';

const Blogs = () => {
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 12,
    total_count: 0,
    total_pages: 0
  });

  // Fetch blog posts
  useEffect(() => {
    setLoading(true);
    
    const params = new URLSearchParams();
    params.append('page', pagination.page.toString());
    params.append('page_size', pagination.page_size.toString());
    
    if (searchTerm) params.append('search', searchTerm);

    fetch(`${baseUrl}blog/posts/?${params.toString()}`)
      .then(res => res.json())
      .then(result => {
        if (result.status === 200) {
          setPosts(result.data);
          setPagination(result.pagination);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching posts:', err);
        setLoading(false);
      });
  }, [pagination.page, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      <GlobalSEO 
        title="Blog - SightseeingRoma"
        description="Discover Rome through our blog. Travel tips, guides, and stories about the Eternal City."
        keywords="Rome blog, travel guides, Italy travel, Rome tips"
      />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section */}
        <div className="bg-[#930B31] text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-center mb-4">Our Blog</h1>
            <p className="text-center text-white/90 text-base md:text-lg max-w-2xl mx-auto">
              Discover Rome through our stories, guides, and travel tips
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar */}
            <div className="w-full lg:w-1/4">
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 sticky top-24">
                
                {/* Search */}
                <form onSubmit={handleSearch} className="mb-6">
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search articles..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#930B31] focus:border-transparent text-sm"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </form>

                {/* Blog Info */}
                <div>
                  <h3 className="text-sm md:text-base font-bold text-gray-800 mb-3">About Our Blog</h3>
                  <p className="text-gray-600 text-sm">
                    Discover travel tips, guides, and stories about Rome. Your essential resource for exploring the Eternal City.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-3/4">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                      <div className="w-full h-48 bg-gray-200"></div>
                      <div className="p-5">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <p className="text-gray-500 text-lg">No blog posts found</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {posts.map((post) => (
                      <article
                        key={post.id}
                        onClick={() => navigate(`/blog/${post.slug}`)}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                      >
                        {/* Featured Image */}
                        <div className="relative overflow-hidden h-48">
                          {post.featured_image_url ? (
                            <img
                              src={`${baseUrlHashless}${post.featured_image_url}`}
                              alt={post.featured_image_alt || post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#930B31] to-[#FAD502] flex items-center justify-center">
                              <span className="text-white text-2xl font-bold opacity-50">No Image</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#930B31] transition-colors">
                            {post.title}
                          </h2>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>

                          {/* Meta Info */}
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <FaCalendarAlt />
                              <span>{formatDate(post.published_at)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaClock />
                              <span>{post.read_time}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.total_pages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
                      >
                        Previous
                      </button>
                      
                      <div className="flex gap-2">
                        {[...Array(pagination.total_pages)].map((_, i) => {
                          const page = i + 1;
                          if (
                            page === 1 ||
                            page === pagination.total_pages ||
                            (page >= pagination.page - 1 && page <= pagination.page + 1)
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-10 h-10 rounded-lg text-sm ${
                                  pagination.page === page
                                    ? 'bg-[#930B31] text-white'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                } transition-colors`}
                              >
                                {page}
                              </button>
                            );
                          } else if (page === pagination.page - 2 || page === pagination.page + 2) {
                            return <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>;
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.total_pages}
                        className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blogs;
