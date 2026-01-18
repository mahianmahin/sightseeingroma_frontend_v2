import { useState, useEffect } from 'react';
import useEditorCheck from '../hooks/useEditorCheck';
import { baseUrl } from '../utilities/Utilities';
import { FaEye, FaTicketAlt, FaCheckCircle, FaTimesCircle, FaChartLine, FaFilter, FaArrowUp, FaArrowDown, FaGlobe, FaUsers, FaCreditCard } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';

// Convert country code to flag emoji
const getCountryFlag = (countryCode) => {
  if (!countryCode) return '🌐';
  return countryCode
    .toUpperCase()
    .split('')
    .map(char => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join('');
};

const BlogConversionStats = () => {
  const { isEditor, loading: editorLoading } = useEditorCheck();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);
  const [sortBy, setSortBy] = useState('visitors');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeTab, setActiveTab] = useState('overview');

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`${baseUrl}blog-conversion-stats/?days=${days}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status === 200) {
        setStats(data);
      } else {
        setError(data.error || 'Failed to fetch stats');
      }
    } catch (err) {
      console.error('Error fetching blog conversion stats:', err);
      setError('Failed to fetch conversion stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditor) {
      fetchStats();
    }
  }, [isEditor, days]);

  // Sort the per_blog_stats
  const sortedBlogStats = stats?.per_blog_stats ? [...stats.per_blog_stats].sort((a, b) => {
    let aVal = a[sortBy] || 0;
    let bVal = b[sortBy] || 0;
    if (sortBy === 'blog_slug') {
      aVal = a.blog_slug.toLowerCase();
      bVal = b.blog_slug.toLowerCase();
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  }) : [];

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (editorLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#930B31]"></div>
      </div>
    );
  }

  if (!isEditor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4">
          <h2 className="text-2xl font-bold text-[#930B31] mb-4">Access Restricted</h2>
          <p className="text-gray-600">This page can only be accessed by editors.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchStats}
            className="mt-4 px-4 py-2 bg-[#930B31] text-white rounded-lg hover:bg-[#7a0929]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#930B31]">Blog Conversion Analytics</h1>
          <p className="text-gray-600 text-sm md:text-base">Track how blog visitors convert to paying customers</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-4 rounded-lg shadow-sm">
          <FaFilter className="text-gray-500" />
          <span className="text-sm text-gray-600">Time Range:</span>
          <div className="flex gap-2 flex-wrap">
            {[7, 14, 30, 60, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  days === d 
                    ? 'bg-[#930B31] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {d} days
              </button>
            ))}
          </div>
          <button 
            onClick={fetchStats}
            className="ml-auto flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
          >
            <MdRefresh /> Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['overview', 'visitors', 'countries', 'blogs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-[#930B31] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Overall Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
              <StatCard 
                icon={<FaUsers />}
                title="Blog Visitors"
                value={stats?.overall_stats?.total_blog_visitors || 0}
                color="bg-blue-500"
              />
              <StatCard 
                icon={<FaTicketAlt />}
                title="Ticket Visits"
                value={stats?.overall_stats?.total_ticket_visits || 0}
                subtitle={`${stats?.overall_stats?.visitors_who_visited_tickets || 0} visitors`}
                color="bg-purple-500"
              />
              <StatCard 
                icon={<FaCreditCard />}
                title="Initiations"
                value={stats?.overall_stats?.total_initiation_count || 0}
                subtitle={`${stats?.overall_stats?.total_payment_initiations || 0} visitors`}
                color="bg-orange-500"
              />
              <StatCard 
                icon={<FaCheckCircle />}
                title="Conversions"
                value={stats?.overall_stats?.total_conversions || 0}
                color="bg-green-500"
                highlight
              />
              <StatCard 
                icon={<FaTimesCircle />}
                title="Cancellations"
                value={stats?.overall_stats?.total_cancellations || 0}
                color="bg-red-500"
              />
              <StatCard 
                icon={<FaChartLine />}
                title="Conversion Rate"
                value={`${stats?.overall_stats?.overall_conversion_rate || 0}%`}
                color="bg-[#930B31]"
                highlight
              />
            </div>

            {/* Conversion Funnel Rates */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
              <StatCard 
                icon={<FaChartLine />}
                title="Blog → Ticket"
                value={`${stats?.overall_stats?.blog_to_ticket_rate || 0}%`}
                color="bg-indigo-500"
              />
              <StatCard 
                icon={<FaChartLine />}
                title="Ticket → Initiate"
                value={`${stats?.overall_stats?.ticket_to_initiation_rate || 0}%`}
                color="bg-amber-500"
              />
              <StatCard 
                icon={<FaChartLine />}
                title="Initiate → Convert"
                value={`${stats?.overall_stats?.initiation_to_conversion_rate || 0}%`}
                color="bg-teal-500"
              />
              <StatCard 
                icon={<FaChartLine />}
                title="Cancellation Rate"
                value={`${stats?.overall_stats?.cancellation_rate || 0}%`}
                color="bg-gray-500"
              />
            </div>

            {/* Top Converting Blogs */}
            {stats?.top_converting_blogs?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">🏆 Top Converting Blogs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {stats.top_converting_blogs.map((blog, index) => (
                    <div key={blog.blog_slug} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl font-bold text-[#930B31]">#{index + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{formatBlogSlug(blog.blog_slug)}</p>
                        <p className="text-xs text-gray-500">{blog.visitors} visitors • {blog.conversion_rate}% conversion</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Package Stats */}
            {stats?.package_stats?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">📦 Top Packages from Blog Traffic</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2 text-gray-600">Package</th>
                        <th className="text-right py-2 px-2 text-gray-600">Visits</th>
                        <th className="text-right py-2 px-2 text-gray-600">Purchases</th>
                        <th className="text-right py-2 px-2 text-gray-600">Conv. Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.package_stats.map((pkg) => (
                        <tr key={pkg.package_tag} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-2 px-2 font-medium">{pkg.package_tag}</td>
                          <td className="py-2 px-2 text-right">{pkg.visits}</td>
                          <td className="py-2 px-2 text-right">{pkg.conversions}</td>
                          <td className="py-2 px-2 text-right text-green-600">
                            {pkg.visits > 0 ? ((pkg.conversions / pkg.visits) * 100).toFixed(1) : 0}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Visitors Tab */}
        {activeTab === 'visitors' && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">👥 Recent Visitors</h2>
            {stats?.recent_visitors?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-2 px-2 text-gray-600">Visitor ID</th>
                      <th className="text-left py-2 px-2 text-gray-600">Country</th>
                      <th className="text-left py-2 px-2 text-gray-600">First Blog</th>
                      <th className="text-center py-2 px-2 text-gray-600">Tickets Viewed</th>
                      <th className="text-center py-2 px-2 text-gray-600">Status</th>
                      <th className="text-left py-2 px-2 text-gray-600 hidden sm:table-cell">Purchased</th>
                      <th className="text-right py-2 px-2 text-gray-600 hidden md:table-cell">First Visit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent_visitors.map((visitor) => (
                      <tr key={visitor.visitor_id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-2 px-2 font-mono text-xs">
                          {visitor.visitor_id?.substring(0, 16)}...
                        </td>
                        <td className="py-2 px-2">
                          <span className="text-lg mr-1">{getCountryFlag(visitor.country_code)}</span>
                          <span className="text-xs text-gray-500 hidden sm:inline">{visitor.country_name || 'Unknown'}</span>
                        </td>
                        <td className="py-2 px-2 max-w-[150px] truncate">
                          {visitor.first_blog_slug ? formatBlogSlug(visitor.first_blog_slug) : '-'}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            {visitor.package_tags?.length || 0} tickets
                          </span>
                        </td>
                        <td className="py-2 px-2 text-center">
                          {visitor.payment_completed ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              ✅ Converted
                            </span>
                          ) : visitor.payment_cancelled ? (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              ❌ Cancelled
                            </span>
                          ) : visitor.payment_initiated ? (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                              💳 Initiated ({visitor.payment_initiated_count || 1}x)
                            </span>
                          ) : visitor.visited_ticket ? (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              📋 Viewed Ticket
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                              📖 Blog Only
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-2 hidden sm:table-cell text-xs">
                          {visitor.purchased_package || '-'}
                        </td>
                        <td className="py-2 px-2 text-right text-xs text-gray-500 hidden md:table-cell">
                          {visitor.first_visit_at ? new Date(visitor.first_visit_at).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No visitor data available yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Countries Tab */}
        {activeTab === 'countries' && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">🌍 Visitors by Country</h2>
            {stats?.country_stats?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stats.country_stats.map((country) => (
                  <div key={country.country_code} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-3xl">{getCountryFlag(country.country_code)}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{country.country_name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">
                        {country.visitors} visitors • {country.conversions} conversions
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        country.conversions > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {country.visitors > 0 ? ((country.conversions / country.visitors) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No country data available yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">📊 All Blog Performance</h2>
            
            {sortedBlogStats.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <SortableHeader 
                        label="Blog" 
                        field="blog_slug" 
                        currentSort={sortBy} 
                        sortOrder={sortOrder}
                        onSort={handleSort}
                      />
                      <SortableHeader 
                        label="Visitors" 
                        field="visitors" 
                        currentSort={sortBy} 
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        className="text-right"
                      />
                      <SortableHeader 
                        label="Ticket Views" 
                        field="ticket_visits" 
                        currentSort={sortBy} 
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        className="text-right hidden sm:table-cell"
                      />
                      <SortableHeader 
                        label="Conversions" 
                        field="conversions" 
                        currentSort={sortBy} 
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        className="text-right"
                      />
                      <SortableHeader 
                        label="Cancellations" 
                        field="cancellations" 
                        currentSort={sortBy} 
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        className="text-right hidden sm:table-cell"
                      />
                      <SortableHeader 
                        label="Conv. Rate" 
                        field="conversion_rate" 
                        currentSort={sortBy} 
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        className="text-right"
                      />
                    </tr>
                  </thead>
                  <tbody>
                    {sortedBlogStats.map((blog) => (
                      <tr key={blog.blog_slug} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <span className="font-medium text-gray-800">{formatBlogSlug(blog.blog_slug)}</span>
                        </td>
                        <td className="py-3 px-2 text-right">{blog.visitors}</td>
                        <td className="py-3 px-2 text-right hidden sm:table-cell">{blog.ticket_visits}</td>
                        <td className="py-3 px-2 text-right text-green-600 font-medium">{blog.conversions}</td>
                        <td className="py-3 px-2 text-right text-red-500 hidden sm:table-cell">{blog.cancellations}</td>
                        <td className="py-3 px-2 text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            blog.conversion_rate >= 5 
                              ? 'bg-green-100 text-green-700' 
                              : blog.conversion_rate >= 2 
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            {blog.conversion_rate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No blog conversion data available yet.</p>
                <p className="text-sm mt-2">Data will appear once visitors read blogs and make purchases.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon, title, value, subtitle, color, highlight = false }) => (
  <div className={`p-4 rounded-lg ${highlight ? 'ring-2 ring-[#930B31] ring-opacity-50' : ''} bg-white shadow-sm`}>
    <div className={`w-10 h-10 ${color} text-white rounded-lg flex items-center justify-center mb-2`}>
      {icon}
    </div>
    <p className="text-xs text-gray-500 uppercase tracking-wide">{title}</p>
    <p className="text-xl md:text-2xl font-bold text-gray-800">{value}</p>
    {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
  </div>
);

const SortableHeader = ({ label, field, currentSort, sortOrder, onSort, className = '' }) => (
  <th 
    className={`py-2 px-2 text-gray-600 cursor-pointer hover:bg-gray-100 select-none ${className}`}
    onClick={() => onSort(field)}
  >
    <div className={`flex items-center gap-1 ${className.includes('text-right') ? 'justify-end' : ''}`}>
      {label}
      {currentSort === field && (
        sortOrder === 'asc' ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />
      )}
    </div>
  </th>
);

// Helper function to format blog slug for display
const formatBlogSlug = (slug) => {
  if (!slug) return '-';
  const formatted = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  return formatted.length > 40 ? formatted.substring(0, 40) + '...' : formatted;
};

export default BlogConversionStats;
