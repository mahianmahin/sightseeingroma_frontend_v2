import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaCloudUploadAlt, FaPlus } from 'react-icons/fa';
import { baseUrl } from '../../utilities/Utilities';
import toast from 'react-hot-toast';

const ImageUploadModal = ({ 
  isOpen, 
  onClose, 
  onImageUploaded, // Callback when image is successfully uploaded
  title = 'Upload Image'
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    alt_text: '',
    file: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [maxUploadSize, setMaxUploadSize] = useState(5); // Default 5MB
  const [uploadSizeUnit, setUploadSizeUnit] = useState('MB'); // MB or KB
  const fileInputRef = useRef(null);

  // Reset form when modal opens and fetch settings
  useEffect(() => {
    if (isOpen) {
      setUploadForm({ name: '', alt_text: '', file: null });
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      fetchWebsiteSettings();
    }
  }, [isOpen]);

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

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      // Validate file type - only images
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Please select an image file only');
        e.target.value = '';
        return;
      }

      // Validate file size
      if (!validateFileSize(selectedFile)) {
        e.target.value = '';
        return;
      }
      
      // Cleanup previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      
      // Create new preview URL
      const newPreviewUrl = URL.createObjectURL(selectedFile);
      
      setUploadForm({
        file: selectedFile,
        name: selectedFile.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        alt_text: ''
      });
      
      setPreviewUrl(newPreviewUrl);
    }
  };

  const validateFileSize = (file) => {
    const fileSizeInBytes = file.size;
    let maxSizeInBytes;
    
    if (uploadSizeUnit === 'MB') {
      maxSizeInBytes = maxUploadSize * 1024 * 1024; // Convert MB to bytes
    } else {
      maxSizeInBytes = maxUploadSize * 1024; // Convert KB to bytes
    }
    
    if (fileSizeInBytes > maxSizeInBytes) {
      const fileSizeDisplay = uploadSizeUnit === 'MB' 
        ? `${(fileSizeInBytes / (1024 * 1024)).toFixed(2)} MB`
        : `${(fileSizeInBytes / 1024).toFixed(2)} KB`;
      
      toast.error(`File size (${fileSizeDisplay}) exceeds the maximum limit of ${maxUploadSize} ${uploadSizeUnit}`);
      return false;
    }
    
    return true;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadForm.file) {
      toast.error('Please select an image file');
      return;
    }

    if (!uploadForm.name.trim()) {
      toast.error('Please enter a name for the image');
      return;
    }

    try {
      setUploading(true);
      
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        toast.error('Authentication required - Please log in');
        return;
      }

      const formData = new FormData();
      formData.append('name', uploadForm.name.trim());
      if (uploadForm.alt_text.trim()) {
        formData.append('alt_text', uploadForm.alt_text.trim());
      }
      formData.append('file', uploadForm.file);
      formData.append('media_type', 'image');

      const response = await fetch(`${baseUrl}media-library/create/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.detail || `Upload failed with status ${response.status}`);
      }

      const responseData = await response.json();
      
      toast.success('Image uploaded successfully!');
      
      // Call the callback with the uploaded image data
      if (onImageUploaded && responseData.data) {
        onImageUploaded(responseData.data);
      }
      
      // Close modal and reset form
      onClose();
      resetForm();
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setUploadForm({ name: '', alt_text: '', file: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-[999999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaCloudUploadAlt className="text-blue-600" />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleUpload} className="space-y-4">
            
            {/* File Preview */}
            {uploadForm.file && (
              <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                  <span className="font-medium">Selected:</span>
                  <span>{uploadForm.file.name}</span>
                  <span className="text-xs text-green-600">
                    ({formatFileSize(uploadForm.file.size)})
                  </span>
                </div>
                {previewUrl && (
                  <div className="flex justify-center">
                    <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* File Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Image
              </label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  accept="image/*"
                />
                <div className="flex items-center justify-between w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                  <span className="text-sm text-gray-600">
                    {uploadForm.file ? uploadForm.file.name : 'Click to browse images'}
                  </span>
                  <button
                    type="button"
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold hover:bg-blue-100"
                    onClick={(e) => {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }}
                  >
                    Browse
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Max file size: {maxUploadSize} {uploadSizeUnit} • Only image files allowed
              </p>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Name *
              </label>
              <input
                type="text"
                value={uploadForm.name}
                onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter image name"
                required
              />
            </div>

            {/* Alt Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text (Optional)
              </label>
              <input
                type="text"
                value={uploadForm.alt_text}
                onChange={(e) => setUploadForm(prev => ({ ...prev, alt_text: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the image for accessibility"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={uploading || !uploadForm.file || !uploadForm.name.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Upload Image
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={uploading}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors duration-200 disabled:opacity-50"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ImageUploadModal;
