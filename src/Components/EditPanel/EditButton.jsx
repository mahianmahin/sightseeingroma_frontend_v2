import { FaEdit } from 'react-icons/fa';
import useEditorCheck from '../../hooks/useEditorCheck';

const EditButton = ({ onClick }) => {
    const { isEditor, loading } = useEditorCheck();

    // Don't render if still loading or user is not an editor
    if (loading || !isEditor) {
        return null;
    }

    return (
        <div className="fixed bottom-10 right-10 z-50">
            <button
                onClick={onClick}
                className="group bg-[#930B31] hover:bg-red-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-110 border-2 border-white"
                title="Edit Mode"
            >
                {/* Edit Icon */}
                <FaEdit className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 group-hover:rotate-12" />
                
                {/* Pulse Animation */}
                <div className="absolute inset-0 rounded-full bg-[#930B31] animate-ping opacity-75"></div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                        Edit Mode
                        <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                    </div>
                </div>
            </button>
        </div>
    );
};

export default EditButton;
