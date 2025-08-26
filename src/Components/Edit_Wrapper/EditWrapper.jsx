import { useState } from "react";
import EditContentModal from "./EditContentModal";
import useStaticContent from "../../hooks/useStaticContent";
import toast from 'react-hot-toast';

export default function EditWrapper({children, isEditor, contentTag, content = "", refreshContent}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { updateContent } = useStaticContent();

    function handleEditClick() {
        setIsModalOpen(true);
    }

    async function handleSave(newContent) {
        if (!contentTag) {
            toast.error('Content tag is required for saving');
            return;
        }
        
        const result = await updateContent(contentTag, newContent);
        if (result.success) {
            toast.success('Content saved successfully!');
            // Refresh the content after successful save
            refreshContent();
        } else {
            toast.error(`Failed to save content: ${result.error}`);
        }
    }

    // Extract text content from children if content prop is empty
    const getContentForEditor = () => {
        if (content) return content;
        
        // If no content prop, try to extract from children
        if (typeof children === 'string') return children;
        
        // For React elements, try to get innerHTML or text content
        if (children && children.props && children.props.dangerouslySetInnerHTML) {
            return children.props.dangerouslySetInnerHTML.__html;
        }
        
        // Fallback to empty string
        return '';
    };

    return (
        <>
        {isEditor ? <div className="wrapper my-2 border-2 border-dashed border-red-100 p-2 relative hover:border-yellow-500 transition-all duration-300">
            <button onClick={handleEditClick} className="absolute font-bold top-1 right-1 bg-orange-500 text-white text-[20px] md:text-xs px-2 py-1 rounded hover:bg-red-600 transition-colors duration-200 z-10 h-10 w-15">EDIT</button>
            {children}
        </div> : children}

        <EditContentModal 
            isOpen={isModalOpen} 
            content={getContentForEditor()} 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleSave} 
        />
        </>
    )
}