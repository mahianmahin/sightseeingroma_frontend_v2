import { useState } from "react";
import MediaLibraryModal from "../MediaLibraryModal/MediaLibraryModal";
import ImageUploadModal from "../ImageUploadModal/ImageUploadModal";
import useStaticContent from "../../hooks/useStaticContent";
import toast from 'react-hot-toast';

export default function EditImageWrapper({ 
    children, 
    isEditor, 
    uniqueTag, 
    refreshContent,
    className = "" 
}) {
    const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showActionMenu, setShowActionMenu] = useState(false);
    const { updatePageImage } = useStaticContent();

    function handleChangeImageClick() {
        if (!uniqueTag) {
            toast.error('Unique tag is required for updating image');
            return;
        }
        setShowActionMenu(true);
    }

    function handleSelectFromLibrary() {
        setShowActionMenu(false);
        setIsMediaLibraryOpen(true);
    }

    function handleUploadNew() {
        setShowActionMenu(false);
        setIsUploadModalOpen(true);
    }

    async function handleImageSelect(selectedMedia) {
        if (!selectedMedia || !selectedMedia.id) {
            toast.error('Invalid image selected');
            return;
        }

        if (!uniqueTag) {
            toast.error('Unique tag is required for updating image');
            return;
        }

        try {
            setIsUpdating(true);
            
            const result = await updatePageImage(uniqueTag, selectedMedia.id);
            
            if (result.success) {
                toast.success('Image updated successfully!');
                // Refresh the content to show the updated image
                if (refreshContent) {
                    refreshContent();
                }
            } else {
                toast.error(`Failed to update image: ${result.error}`);
            }
        } catch (error) {
            console.error('Error updating image:', error);
            toast.error(`Failed to update image: ${error.message}`);
        } finally {
            setIsUpdating(false);
            setIsMediaLibraryOpen(false);
        }
    }

    async function handleImageUploaded(uploadedImage) {
        // After successful upload, automatically use the uploaded image
        await handleImageSelect(uploadedImage);
        setIsUploadModalOpen(false);
    }

    return (
        <>
            {isEditor ? (
                <div className={`wrapper my-2 border-2 border-dashed border-blue-100 p-2 relative hover:border-blue-500 transition-all duration-300 ${className}`}>
                    {children}
                    <button 
                        onClick={handleChangeImageClick}
                        disabled={isUpdating}
                        className="absolute font-bold -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200 z-10 shadow-lg border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ zIndex: 9999 }}
                    >
                        {isUpdating ? 'Updating...' : 'CHANGE IMAGE'}
                    </button>

                    {/* Action Menu */}
                    {showActionMenu && (
                        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg z-[10000] min-w-[200px]">
                            <div className="p-2">
                                <button
                                    onClick={handleSelectFromLibrary}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                                >
                                    📚 Select from Library
                                </button>
                                <button
                                    onClick={handleUploadNew}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                                >
                                    📤 Upload New Image
                                </button>
                                <button
                                    onClick={() => setShowActionMenu(false)}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-md transition-colors duration-200"
                                >
                                    ❌ Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                children
            )}

            {/* Media Library Modal */}
            <MediaLibraryModal
                isOpen={isMediaLibraryOpen}
                onClose={() => setIsMediaLibraryOpen(false)}
                onSelectMedia={handleImageSelect}
                allowSelection={true}
                selectionMode="single"
                title="Select Image"
                allowUpload={false}
                allowEdit={true}
                allowDelete={true}
            />

            {/* Image Upload Modal */}
            <ImageUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onImageUploaded={handleImageUploaded}
                title="Upload New Image"
            />

            {/* Click outside to close action menu */}
            {showActionMenu && (
                <div 
                    className="fixed inset-0 z-[9999]" 
                    onClick={() => setShowActionMenu(false)}
                />
            )}
        </>
    );
}
