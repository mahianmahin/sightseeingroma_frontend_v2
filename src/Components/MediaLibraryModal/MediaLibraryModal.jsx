import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  FaTimes, 
  FaCloudUploadAlt, 
  FaImages, 
  FaVideo, 
  FaFile, 
  FaEdit, 
  FaTrash, 
  FaCheck,
  FaSearch,
  FaFilter,
  FaPlus
} from 'react-icons/fa';
import { baseUrl, baseUrlHashless } from '../../utilities/Utilities';
import toast from 'react-hot-toast';

const MediaLibraryModal = ({ 
  isOpen, 
  onClose, 
  onSelectMedia = null, // Optional callback when media is selected
  allowSelection = false, // Whether to show selection buttons
  selectionMode = 'single', // 'single' or 'multiple'
  title = 'Media Library',
  allowUpload = true,
  allowEdit = true,
  allowDelete = true
}) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'image', 'video', 'other'
  const [editingItem, setEditingItem] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    alt_text: '',
    file: null,
    media_type: 'image'
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [maxUploadSize, setMaxUploadSize] = useState(5); // Default 5MB
  const [uploadSizeUnit, setUploadSizeUnit] = useState('MB'); // MB or KB
  const [messages, setMessages] = useState([]); // Array of {id, type, text, timestamp}
  const [imageDimensions, setImageDimensions] = useState({});
  const fileInputRef = useRef(null);

  // Cleanup preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Auto-remove messages after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(prev => prev.filter(msg => Date.now() - msg.timestamp < 5000));
    }, 1000);

    return () => clearTimeout(timer);
  }, [messages]);

  // Helper function to add messages
  const addMessage = (type, text) => {
    const message = {
      id: Date.now() + Math.random(),
      type, // 'success', 'error', 'warning', 'info'
      text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, message]);
  };

  // Helper function to remove specific message
  const removeMessage = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  // Fetch media library when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchMediaLibrary();
      fetchWebsiteSettings();
      setSelectedItems([]);
      setSearchTerm('');
      setFilterType('all');
      setMessages([]); // Clear messages when modal opens
      // Reset upload form and preview when modal opens
      setUploadForm({ name: '', alt_text: '', file: null, media_type: 'image' });
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  }, [isOpen]);

  const fetchMediaLibrary = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}media-library/`);
      if (!response.ok) throw new Error('Failed to fetch media');
      const data = await response.json();
      setMediaItems(data.data || []);
    } catch (error) {
      console.error('Error fetching media library:', error);
      addMessage('error', 'Failed to load media library');
    } finally {
      setLoading(false);
    }
  };

  const fetchWebsiteSettings = async () => {
    try {
      const response = await fetch(`${baseUrl}website-settings/`);
      if (!response.ok) throw new Error('Failed to fetch website settings');
      const data = await response.json();
      
      if (data.data && data.data.max_image_upload_size_mb !== undefined) {
        const sizeValue = data.data.max_image_upload_size_mb;
        
        // If >= 1, treat as MB (e.g., 1.0, 1.2, 4.5 = 1MB, 1.2MB, 4.5MB)
        // If < 1, convert to KB (e.g., 0.8, 0.5 = 800KB, 500KB)
        if (sizeValue >= 1) {
          setMaxUploadSize(sizeValue);
          setUploadSizeUnit('MB');
        } else {
          // Convert fractional MB to KB (e.g., 0.8 MB = 800 KB, 0.5 MB = 500 KB)
          setMaxUploadSize(sizeValue * 1000);
          setUploadSizeUnit('KB');
        }
      }
    } catch (error) {
      console.error('Error fetching website settings:', error);
      // Keep default values if settings fetch fails
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) {
      addMessage('error', 'Please select a file');
      return;
    }

    try {
      setUploading(true);
      console.log('MediaLibrary: Starting upload process');
      
      const accessToken = localStorage.getItem('access');
      console.log('MediaLibrary: Access token available:', !!accessToken);
      
      if (!accessToken) {
        addMessage('error', 'Authentication required - Please log in');
        console.error('MediaLibrary: No access token found in localStorage');
        return;
      }

      console.log('MediaLibrary: Preparing FormData with file:', uploadForm.file.name, 'size:', uploadForm.file.size);
      
      const formData = new FormData();
      formData.append('name', uploadForm.name || uploadForm.file.name);
      if (uploadForm.alt_text) formData.append('alt_text', uploadForm.alt_text);
      formData.append('file', uploadForm.file);
      formData.append('media_type', uploadForm.media_type);

      console.log('MediaLibrary: Making request to:', `${baseUrl}media-library/create/`);
      console.log('MediaLibrary: Request headers Authorization:', `Bearer ${accessToken.substring(0, 10)}...`);

      const response = await fetch(`${baseUrl}media-library/create/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });

      console.log('MediaLibrary: Response status:', response.status);
      console.log('MediaLibrary: Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('MediaLibrary: Upload failed with error data:', errorData);
        throw new Error(errorData.message || errorData.detail || `Upload failed with status ${response.status}`);
      }

      const responseData = await response.json();
      console.log('MediaLibrary: Upload successful, response:', responseData);

      addMessage('success', 'Media uploaded successfully!');
      setUploadForm({ name: '', alt_text: '', file: null, media_type: 'image' });
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      fetchMediaLibrary();
    } catch (error) {
      console.error('MediaLibrary: Error uploading media:', error);
      console.error('MediaLibrary: Error stack:', error.stack);
      addMessage('error', error.message || 'Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async (item, newData) => {
    try {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        addMessage('error', 'Authentication required');
        return;
      }

      // Filter out empty or unchanged fields
      const filteredData = {};
      Object.keys(newData).forEach(key => {
        const newValue = newData[key];
        const currentValue = item[key];
        
        // Include the field if it's different from current value
        if (newValue !== currentValue) {
          filteredData[key] = newValue;
        }
      });

      // If no changes, just close editing mode
      if (Object.keys(filteredData).length === 0) {
        setEditingItem(null);
        return;
      }

      const response = await fetch(`${baseUrl}media-library/${item.id}/update/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filteredData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      const updatedFields = Object.keys(filteredData);
      const fieldText = updatedFields.length === 1 ? updatedFields[0] : `${updatedFields.length} fields`;
      addMessage('success', `Media ${fieldText} updated successfully!`);
      
      setEditingItem(null);
      fetchMediaLibrary();
    } catch (error) {
      console.error('Error updating media:', error);
      addMessage('error', error.message || 'Failed to update media');
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    try {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        addMessage('error', 'Authentication required');
        return;
      }

      const response = await fetch(`${baseUrl}media-library/${item.id}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Delete failed');
      }

      addMessage('success', 'Media deleted successfully!');
      fetchMediaLibrary();
    } catch (error) {
      console.error('Error deleting media:', error);
      addMessage('error', error.message || 'Failed to delete media');
    }
  };

  const handleSelection = (item) => {
    if (!allowSelection) return;

    if (selectionMode === 'single') {
      setSelectedItems([item]);
      if (onSelectMedia) {
        onSelectMedia(item);
      }
    } else {
      setSelectedItems(prev => {
        const isSelected = prev.find(selected => selected.id === item.id);
        if (isSelected) {
          return prev.filter(selected => selected.id !== item.id);
        } else {
          return [...prev, item];
        }
      });
    }
  };

  const handleConfirmSelection = () => {
    if (onSelectMedia && selectedItems.length > 0) {
      if (selectionMode === 'single') {
        onSelectMedia(selectedItems[0]);
      } else {
        onSelectMedia(selectedItems);
      }
    }
    onClose();
  };

  const validateFileSize = (file) => {
    const fileSizeInBytes = file.size;
    let maxSizeInBytes;
    
    console.log('MediaLibrary: Validating file size:', fileSizeInBytes, 'bytes');
    console.log('MediaLibrary: Max upload size:', maxUploadSize, uploadSizeUnit);
    
    if (uploadSizeUnit === 'MB') {
      maxSizeInBytes = maxUploadSize * 1024 * 1024; // Convert MB to bytes
    } else {
      maxSizeInBytes = maxUploadSize * 1024; // Convert KB to bytes
    }
    
    console.log('MediaLibrary: Max size in bytes:', maxSizeInBytes);
    
    if (fileSizeInBytes > maxSizeInBytes) {
      const fileSizeDisplay = uploadSizeUnit === 'MB' 
        ? `${(fileSizeInBytes / (1024 * 1024)).toFixed(2)} MB`
        : `${(fileSizeInBytes / 1024).toFixed(2)} KB`;
      
      console.log('MediaLibrary: File size validation failed:', fileSizeDisplay, 'exceeds', maxUploadSize, uploadSizeUnit);
      addMessage('error', `File size (${fileSizeDisplay}) exceeds the maximum limit of ${maxUploadSize} ${uploadSizeUnit}`);
      return false;
    }
    
    console.log('MediaLibrary: File size validation passed');
    return true;
  };

  const handleFileSelect = useCallback((e) => {
    console.log('MediaLibrary: handleFileSelect called', e, e.target, e.target.files);
    const selectedFile = e.target.files?.[0];
    console.log('MediaLibrary: File selected:', selectedFile?.name, 'size:', selectedFile?.size, 'type:', selectedFile?.type);
    
    if (selectedFile) {
      
      // Validate file size first
      if (!validateFileSize(selectedFile)) {
        console.log('MediaLibrary: File size validation failed');
        // Clear the input
        e.target.value = '';
        return;
      }
      
      console.log('MediaLibrary: File size validation passed');
      
      // Cleanup previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      
      // Create new preview URL for images
      let newPreviewUrl = null;
      if (selectedFile.type.startsWith('image/')) {
        newPreviewUrl = URL.createObjectURL(selectedFile);
        console.log('MediaLibrary: Created preview URL for image');
      }
      
      // Determine media type based on file type
      let mediaType = 'other';
      if (selectedFile.type.startsWith('image/')) {
        mediaType = 'image';
      } else if (selectedFile.type.startsWith('video/')) {
        mediaType = 'video';
      }
      
      console.log('MediaLibrary: Detected media type:', mediaType);
      
      setUploadForm({
        file: selectedFile,
        name: selectedFile.name.replace(/\.[^/.]+$/, ""),
        media_type: mediaType,
        alt_text: ''
      });
      
      setPreviewUrl(newPreviewUrl);
      console.log('MediaLibrary: Upload form updated with file data');
    } else {
      console.log('MediaLibrary: No file selected');
    }
  }, [previewUrl, maxUploadSize, uploadSizeUnit]);



  const resetUploadForm = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setUploadForm({ name: '', alt_text: '', file: null, media_type: 'image' });
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getMediaIcon = (mediaType) => {
    switch (mediaType) {
      case 'image': return <FaImages className="text-blue-500" />;
      case 'video': return <FaVideo className="text-red-500" />;
      default: return <FaFile className="text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileSizeColor = (fileSize) => {
    let maxSizeInBytes;
    
    if (uploadSizeUnit === 'MB') {
      maxSizeInBytes = maxUploadSize * 1024 * 1024;
    } else {
      maxSizeInBytes = maxUploadSize * 1024;
    }
    
    const percentage = (fileSize / maxSizeInBytes) * 100;
    
    if (percentage > 90) return 'text-red-500'; // Very close to limit
    if (percentage > 75) return 'text-orange-500'; // Getting close
    return 'text-green-500'; // Safe size
  };

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.alt_text && item.alt_text.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || item.media_type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-[999999]">
      <div className="bg-white w-full h-full flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FaImages className="text-blue-600" />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Message Area */}
        {messages.length > 0 && (
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-center justify-between p-3 rounded-md border ${
                    message.type === 'success'
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : message.type === 'error'
                      ? 'bg-red-50 border-red-200 text-red-800'
                      : message.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                      : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {message.type === 'success' && (
                      <FaCheck className="text-green-600 flex-shrink-0" />
                    )}
                    {message.type === 'error' && (
                      <FaTimes className="text-red-600 flex-shrink-0" />
                    )}
                    {message.type === 'warning' && (
                      <FaEdit className="text-yellow-600 flex-shrink-0" />
                    )}
                    {message.type === 'info' && (
                      <FaImages className="text-blue-600 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium">{message.text}</span>
                  </div>
                  <button
                    onClick={() => removeMessage(message.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Section */}
        {allowUpload && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
              <div className="flex items-center gap-4 mb-4">
                <FaCloudUploadAlt className="text-blue-600 text-2xl" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Upload New Media</h3>
                  <p className="text-sm text-gray-600">
                    Maximum file size: {maxUploadSize} {uploadSizeUnit}
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleUpload} className="space-y-4">
                {/* Debug Info */}
                {/* <div className="text-xs text-gray-500 p-2 bg-yellow-50 rounded">
                  Debug: File={uploadForm.file?.name || 'none'} | PreviewURL={previewUrl ? 'yes' : 'no'} | Type={uploadForm.media_type}
                </div> */}
                
                {/* File Preview Section */}
                {uploadForm.file && (
                  <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4 mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Selected File:</h4>
                      <span className="text-xs text-gray-500">{uploadForm.file.name}</span>
                      <span className="text-xs text-blue-500">Type: {uploadForm.media_type}</span>
                      <span className={`text-xs ${getFileSizeColor(uploadForm.file.size)}`}>
                        Size: {formatFileSize(uploadForm.file.size)}
                      </span>
                    </div>
                    <div className="flex justify-center">
                      {previewUrl ? (
                        <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-white">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-100 flex flex-col items-center justify-center">
                          <div className="text-2xl mb-1">{getMediaIcon(uploadForm.media_type)}</div>
                          <span className="text-xs text-gray-500">No Preview</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      File Name
                    </label>
                    <input
                      type="text"
                      value={uploadForm.name}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter file name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alt Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={uploadForm.alt_text}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, alt_text: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the media"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Media Type
                    </label>
                    <select
                      value={uploadForm.media_type}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, media_type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Choose File
                    </label>
                    <div className="space-y-2">
                      {/* Simple file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={(e) => {
                          console.log('MediaLibrary: React onChange triggered', e.target.files);
                          handleFileSelect(e);
                        }}
                        onClick={(e) => {
                          console.log('MediaLibrary: File input clicked', e.target);
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-md cursor-pointer"
                        accept="*/*"
                        id="file-upload-input"
                      />
                      {/* Alternative button for browsers that have issues */}
                      <button
                        type="button"
                        className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-md transition-colors duration-200 text-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('MediaLibrary: Alternative browse button clicked');
                          if (fileInputRef.current) {
                            fileInputRef.current.click();
                          }
                        }}
                      >
                        📁 Click here to browse files (Alternative)
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Max: {maxUploadSize} {uploadSizeUnit}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={uploading || !uploadForm.file}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaPlus />
                        Upload Media
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetUploadForm}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors duration-200"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search media by name or alt text..."
              />
            </div>
            
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-600" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="other">Other</option>
              </select>
            </div>

            {allowSelection && selectedItems.length > 0 && (
              <button
                onClick={handleConfirmSelection}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <FaCheck />
                Select ({selectedItems.length})
              </button>
            )}
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading media...</p>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <FaImages className="text-gray-300 text-6xl mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No media found</p>
                <p className="text-gray-500">
                  {searchTerm || filterType !== 'all' ? 'Try adjusting your search or filter' : 'Upload some media to get started'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredItems.map((item) => {
                const isSelected = selectedItems.find(selected => selected.id === item.id);
                const isEditing = editingItem?.id === item.id;
                
                return (
                  <div
                    key={item.id}
                    className={`relative group border rounded-lg overflow-hidden bg-white transition-all duration-200 ${
                      isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:shadow-lg'
                    }`}
                  >
                    {/* Media Preview */}
                    <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                      {item.media_type === 'image' ? (
                        <>
                          <img
                            src={`${baseUrlHashless}${item.file}`}
                            alt={item.alt_text || item.name}
                            className="w-full h-full object-cover"
                            onLoad={e => {
                              setImageDimensions(prev => ({
                                ...prev,
                                [item.id]: { width: e.target.naturalWidth, height: e.target.naturalHeight }
                              }));
                            }}
                          />
                          {imageDimensions[item.id] && (
                            <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                              {imageDimensions[item.id].width} x {imageDimensions[item.id].height} px
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          {getMediaIcon(item.media_type)}
                          <span className="text-xs mt-2 uppercase">{item.media_type}</span>
                        </div>
                      )}
                      
                      {/* Selection Button Overlay */}
                      {allowSelection && (
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelection(item);
                            }}
                            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                              isSelected 
                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      )}

                      {/* Selection Indicator */}
                      {allowSelection && isSelected && (
                        <div className="absolute top-2 right-2 bg-green-600 text-white rounded-full p-1">
                          <FaCheck className="text-xs" />
                        </div>
                      )}

                      {/* Action Buttons */}
                      {(allowEdit || allowDelete) && (
                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                          {allowEdit && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingItem(item);
                              }}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white p-1 rounded text-xs"
                            >
                              <FaEdit />
                            </button>
                          )}
                          {allowDelete && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item);
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white p-1 rounded text-xs"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Media Info */}
                    <div className="p-3">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            defaultValue={item.name}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const nameInput = e.target;
                                const altInput = e.target.parentElement.querySelector('input[placeholder*="Alt text"]');
                                const updates = {};
                                if (nameInput.value !== item.name) updates.name = nameInput.value;
                                if (altInput.value !== (item.alt_text || '')) updates.alt_text = altInput.value;
                                if (Object.keys(updates).length > 0) {
                                  handleEdit(item, updates);
                                } else {
                                  setEditingItem(null);
                                }
                              } else if (e.key === 'Escape') {
                                setEditingItem(null);
                              }
                            }}
                            className="w-full text-sm font-medium border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                            placeholder="Media name"
                          />
                          <input
                            type="text"
                            defaultValue={item.alt_text || ''}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const altInput = e.target;
                                const nameInput = e.target.parentElement.querySelector('input[placeholder="Media name"]');
                                const updates = {};
                                if (nameInput.value !== item.name) updates.name = nameInput.value;
                                if (altInput.value !== (item.alt_text || '')) updates.alt_text = altInput.value;
                                if (Object.keys(updates).length > 0) {
                                  handleEdit(item, updates);
                                } else {
                                  setEditingItem(null);
                                }
                              } else if (e.key === 'Escape') {
                                setEditingItem(null);
                              }
                            }}
                            className="w-full text-xs text-gray-600 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Alt text (for accessibility & SEO)"
                          />
                          <div className="flex gap-1 mt-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const nameInput = e.target.parentElement.parentElement.querySelector('input[placeholder="Media name"]');
                                const altInput = e.target.parentElement.parentElement.querySelector('input[placeholder*="Alt text"]');
                                const updates = {};
                                if (nameInput.value !== item.name) updates.name = nameInput.value;
                                if (altInput.value !== (item.alt_text || '')) updates.alt_text = altInput.value;
                                if (Object.keys(updates).length > 0) {
                                  handleEdit(item, updates);
                                } else {
                                  setEditingItem(null);
                                }
                              }}
                              className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingItem(null);
                              }}
                              className="px-2 py-1 bg-gray-400 hover:bg-gray-500 text-white text-xs rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-medium text-sm text-gray-900 truncate" title={item.name}>
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-600 truncate" title={item.alt_text}>
                            {item.alt_text || 'No alt text'}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatFileSize(item.file_size)}
                            </span>
                            <div className="flex items-center gap-1">
                              {getMediaIcon(item.media_type)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {filteredItems.length} media item{filteredItems.length !== 1 ? 's' : ''} found
            {selectedItems.length > 0 && ` • ${selectedItems.length} selected`}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors duration-200"
            >
              {allowSelection && selectedItems.length > 0 ? 'Cancel' : 'Close'}
            </button>
            {allowSelection && selectedItems.length > 0 && selectionMode === 'multiple' && (
              <button
                onClick={handleConfirmSelection}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <FaCheck />
                Select Items ({selectedItems.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MediaLibraryModal;
