import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaSave, FaEdit, FaEuroSign } from 'react-icons/fa';
import EditContentModal from '../Edit_Wrapper/EditContentModal';
import { baseUrl } from '../../utilities/Utilities';
import toast from 'react-hot-toast';

const TicketEditModal = ({ 
  isOpen, 
  onClose, 
  ticketData, 
  onSave 
}) => {
  const [editedData, setEditedData] = useState({
    title: '',
    description: '',
    adult_price: 0,
    youth_price: 0,
    off_price: 0,
    meta_title: '',
    meta_description: '',
    is_featured: false
  });
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (ticketData && isOpen) {
      setEditedData({
        title: ticketData.title || '',
        description: ticketData.description || '',
        adult_price: ticketData.adult_price || 0,
        youth_price: ticketData.youth_price || 0,
        off_price: ticketData.off_price || 0,
        meta_title: ticketData.meta_title || '',
        meta_description: ticketData.meta_description || '',
        is_featured: ticketData.is_featured || false
      });
    }
  }, [ticketData, isOpen]);

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDescriptionSave = (newDescription) => {
    setEditedData(prev => ({
      ...prev,
      description: newDescription
    }));
  };

  const handleSave = async () => {
    if (!ticketData?.package_tag) {
      toast.error('Package tag is missing');
      return;
    }

    setIsSaving(true);
    try {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`${baseUrl}update-bus-package/${ticketData.package_tag}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData)
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Ticket updated successfully!');
        onSave(result.data || editedData);
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(`Failed to update ticket: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (ticketData) {
      setEditedData({
        title: ticketData.title || '',
        description: ticketData.description || '',
        adult_price: ticketData.adult_price || 0,
        youth_price: ticketData.youth_price || 0,
        off_price: ticketData.off_price || 0,
        meta_title: ticketData.meta_title || '',
        meta_description: ticketData.meta_description || '',
        is_featured: ticketData.is_featured || false
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-[999999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col relative z-[999999]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FaEdit className="text-orange-600" />
            Edit Ticket Details
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={editedData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter ticket title"
                  />
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={editedData.is_featured}
                    onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                    Featured Ticket
                  </label>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaEuroSign className="text-green-600" />
                Pricing
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adult Price (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editedData.adult_price}
                    onChange={(e) => handleInputChange('adult_price', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Youth Price (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editedData.youth_price}
                    onChange={(e) => handleInputChange('youth_price', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editedData.off_price}
                    onChange={(e) => handleInputChange('off_price', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* SEO Meta Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">SEO Meta Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={editedData.meta_title}
                    onChange={(e) => handleInputChange('meta_title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="SEO meta title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={editedData.meta_description}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="SEO meta description"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                <button
                  onClick={() => setIsDescriptionModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center gap-2"
                >
                  <FaEdit />
                  Edit Description
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-md p-3 bg-white max-h-40 overflow-auto">
                <div 
                  className="prose max-w-none text-sm"
                  dangerouslySetInnerHTML={{ __html: editedData.description || '<p class="text-gray-500">No description available</p>' }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Package Tag: {ticketData?.package_tag}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors duration-200"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !editedData.title.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Description Edit Modal */}
      <EditContentModal
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
        content={editedData.description}
        onSave={handleDescriptionSave}
        title="Edit Ticket Description"
      />
    </div>,
    document.body
  );
};

export default TicketEditModal;
