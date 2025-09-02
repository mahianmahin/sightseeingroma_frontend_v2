import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  FaTimes, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaImages,
  FaLink,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import MediaLibraryModal from '../MediaLibraryModal/MediaLibraryModal';
import { baseUrl, baseUrlHashless } from '../../utilities/Utilities';
import toast from 'react-hot-toast';

const PartnerLogosManager = ({ isOpen, onClose, onLogosUpdate }) => {
  const [partnerLogos, setPartnerLogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingLogo, setEditingLogo] = useState(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [selectedMediaForNew, setSelectedMediaForNew] = useState(null);
  const [newLogoForm, setNewLogoForm] = useState({
    name: '',
    alt_text: '',
    website_url: '',
    is_active: true,
    order: 0
  });

  useEffect(() => {
    if (isOpen) {
      fetchPartnerLogos();
    }
  }, [isOpen]);

  const fetchPartnerLogos = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`${baseUrl}partner-logos/all/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch partner logos');
      }

      const data = await response.json();
      if (data.status === 200) {
        setPartnerLogos(data.data || []);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching partner logos:', error);
      toast.error('Failed to load partner logos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLogo = async () => {
    if (!selectedMediaForNew) {
      toast.error('Please select a logo image');
      return;
    }

    if (!newLogoForm.name.trim()) {
      toast.error('Partner name is required');
      return;
    }

    try {
      setCreating(true);
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`${baseUrl}partner-logos/create/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newLogoForm.name.trim(),
          logo_id: selectedMediaForNew.id,
          alt_text: newLogoForm.alt_text.trim(),
          website_url: newLogoForm.website_url.trim(),
          is_active: newLogoForm.is_active,
          order: newLogoForm.order
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create partner logo');
      }

      toast.success('Partner logo created successfully!');
      setNewLogoForm({ name: '', alt_text: '', website_url: '', is_active: true, order: 0 });
      setSelectedMediaForNew(null);
      fetchPartnerLogos();
      if (onLogosUpdate) onLogosUpdate();
    } catch (error) {
      console.error('Error creating partner logo:', error);
      toast.error(error.message || 'Failed to create partner logo');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateLogo = async (logoId, updates) => {
    try {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`${baseUrl}partner-logos/${logoId}/update/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update partner logo');
      }

      toast.success('Partner logo updated successfully!');
      setEditingLogo(null);
      fetchPartnerLogos();
      if (onLogosUpdate) onLogosUpdate();
    } catch (error) {
      console.error('Error updating partner logo:', error);
      toast.error(error.message || 'Failed to update partner logo');
    }
  };

  const handleDeleteLogo = async (logoId, logoName) => {
    if (!window.confirm(`Are you sure you want to delete "${logoName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`${baseUrl}partner-logos/${logoId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete partner logo');
      }

      toast.success('Partner logo deleted successfully!');
      fetchPartnerLogos();
      if (onLogosUpdate) onLogosUpdate();
    } catch (error) {
      console.error('Error deleting partner logo:', error);
      toast.error(error.message || 'Failed to delete partner logo');
    }
  };

  const handleToggleActive = (logo) => {
    handleUpdateLogo(logo.id, { is_active: !logo.is_active });
  };

  const handleOrderChange = (logo, direction) => {
    const newOrder = direction === 'up' ? logo.order - 1 : logo.order + 1;
    handleUpdateLogo(logo.id, { order: Math.max(0, newOrder) });
  };

  const handleMediaSelect = (media) => {
    if (editingLogo) {
      handleUpdateLogo(editingLogo.id, { logo_id: media.id });
    } else {
      setSelectedMediaForNew(media);
    }
    setShowMediaLibrary(false);
  };

  const handleEditSubmit = (logo, e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      name: formData.get('name'),
      alt_text: formData.get('alt_text'),
      website_url: formData.get('website_url'),
      order: parseInt(formData.get('order')) || 0
    };
    handleUpdateLogo(logo.id, updates);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-[999999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FaImages className="text-blue-600" />
            Partner Logos Manager
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Create New Logo Section */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaPlus className="text-green-600" />
            Add New Partner Logo
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {selectedMediaForNew ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={`${baseUrlHashless}${selectedMediaForNew.file}`}
                      alt={selectedMediaForNew.alt_text || selectedMediaForNew.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{selectedMediaForNew.name}</p>
                      <p className="text-sm text-gray-600">{selectedMediaForNew.alt_text || 'No alt text'}</p>
                    </div>
                    <button
                      onClick={() => setSelectedMediaForNew(null)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowMediaLibrary(true)}
                    className="w-full py-3 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <FaImages className="mx-auto text-2xl mb-2" />
                    <p>Click to select logo image</p>
                  </button>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name *</label>
                <input
                  type="text"
                  value={newLogoForm.name}
                  onChange={(e) => setNewLogoForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter partner name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                <input
                  type="text"
                  value={newLogoForm.alt_text}
                  onChange={(e) => setNewLogoForm(prev => ({ ...prev, alt_text: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Logo description for accessibility"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL (Optional)</label>
                <input
                  type="url"
                  value={newLogoForm.website_url}
                  onChange={(e) => setNewLogoForm(prev => ({ ...prev, website_url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://partner-website.com"
                />
              </div>

              <div className="flex gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    min="0"
                    value={newLogoForm.order}
                    onChange={(e) => setNewLogoForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newLogoForm.is_active}
                      onChange={(e) => setNewLogoForm(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleCreateLogo}
                disabled={creating || !selectedMediaForNew || !newLogoForm.name.trim()}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Create Partner Logo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Partner Logos List */}
        <div className="flex-1 overflow-auto p-6">
          <h3 className="text-lg font-semibold mb-4">Existing Partner Logos</h3>
          
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading partner logos...</p>
              </div>
            </div>
          ) : partnerLogos.length === 0 ? (
            <div className="text-center py-8">
              <FaImages className="text-gray-300 text-6xl mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No partner logos found</p>
              <p className="text-gray-500">Create your first partner logo above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {partnerLogos.map((logo) => (
                <div
                  key={logo.id}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    logo.is_active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300 opacity-75'
                  }`}
                >
                  {editingLogo?.id === logo.id ? (
                    /* Edit Mode */
                    <form onSubmit={(e) => handleEditSubmit(logo, e)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name</label>
                          <input
                            name="name"
                            type="text"
                            defaultValue={logo.name}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                          <input
                            name="alt_text"
                            type="text"
                            defaultValue={logo.alt_text || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                          <input
                            name="website_url"
                            type="url"
                            defaultValue={logo.website_url || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                          <input
                            name="order"
                            type="number"
                            min="0"
                            defaultValue={logo.order}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 flex items-center gap-2"
                        >
                          <FaSave />
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingLogo(null)}
                          className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-md transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLogo(logo);
                            setShowMediaLibrary(true);
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center gap-2"
                        >
                          <FaImages />
                          Change Logo
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Display Mode */
                    <div className="flex items-center gap-4">
                      {/* Logo Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={`${baseUrlHashless}${logo.logo?.file}`}
                          alt={logo.alt_text || logo.name}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      </div>

                      {/* Logo Details */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{logo.name}</h4>
                        <p className="text-gray-600 text-sm">{logo.alt_text || 'No alt text provided'}</p>
                        {logo.website_url && (
                          <a 
                            href={logo.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mt-1"
                          >
                            <FaLink className="text-xs" />
                            {logo.website_url}
                          </a>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Order: {logo.order}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            logo.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {logo.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(logo)}
                          className={`p-2 rounded text-white transition-colors duration-200 ${
                            logo.is_active 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                          title={logo.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {logo.is_active ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        
                        <button
                          onClick={() => handleOrderChange(logo, 'up')}
                          className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors duration-200"
                          title="Move up"
                        >
                          <FaArrowUp />
                        </button>
                        
                        <button
                          onClick={() => handleOrderChange(logo, 'down')}
                          className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors duration-200"
                          title="Move down"
                        >
                          <FaArrowDown />
                        </button>
                        
                        <button
                          onClick={() => setEditingLogo(logo)}
                          className="p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors duration-200"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteLogo(logo.id, logo.name)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-200"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {partnerLogos.length} partner logo{partnerLogos.length !== 1 ? 's' : ''} total
            {partnerLogos.filter(logo => logo.is_active).length < partnerLogos.length && 
              ` • ${partnerLogos.filter(logo => logo.is_active).length} active`
            }
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <MediaLibraryModal
          isOpen={showMediaLibrary}
          onClose={() => setShowMediaLibrary(false)}
          onSelectMedia={handleMediaSelect}
          allowSelection={true}
          selectionMode="single"
          title="Select Partner Logo"
        />
      )}
    </div>,
    document.body
  );
};

export default PartnerLogosManager;
