import { useState } from "react";
import MediaLibraryModal from "../MediaLibraryModal/MediaLibraryModal";
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
    const [isUpdating, setIsUpdating] = useState(false);
    const { updatePageImage } = useStaticContent();

    function handleChangeImageClick() {
        if (!uniqueTag) {
            toast.error('Unique tag is required for updating image');
            return;
        }
        setIsMediaLibraryOpen(true);
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

    return (
        <>
            {isEditor ? (
                <div className={`wrapper my-2 border-2 border-dashed border-blue-100 p-2 relative hover:border-blue-500 transition-all duration-300 ${className}`}>
                    {children}
                    <button 
                        onClick={handleChangeImageClick}
                        disabled={isUpdating}
                        className="absolute font-bold -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200 z-50 shadow-lg border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ zIndex: 9999 }}
                    >
                        {isUpdating ? 'Updating...' : 'CHANGE IMAGE'}
                    </button>
                </div>
            ) : (
                children
            )}

            <MediaLibraryModal
                isOpen={isMediaLibraryOpen}
                onClose={() => setIsMediaLibraryOpen(false)}
                onSelectMedia={handleImageSelect}
                allowSelection={true}
                selectionMode="single"
                title="Select Image"
                allowUpload={true}
                allowEdit={true}
                allowDelete={true}
            />
        </>
    );
}
