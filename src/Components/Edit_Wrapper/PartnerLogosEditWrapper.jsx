import { useState } from "react";
import PartnerLogosManager from "../PartnerLogos/PartnerLogosManager";
import useEditorCheck from "../../hooks/useEditorCheck";

export default function PartnerLogosEditWrapper({ children, onLogosUpdate }) {
    const [isManagerOpen, setIsManagerOpen] = useState(false);
    const { isEditor } = useEditorCheck();

    function handleEditClick() {
        setIsManagerOpen(true);
    }

    function handleLogosUpdate() {
        if (onLogosUpdate) {
            onLogosUpdate();
        }
        // Force a page refresh to update the partner logos immediately
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    return (
        <>
            {isEditor ? (
                <div className="wrapper my-2 border-2 border-dashed border-red-100 p-2 relative hover:border-yellow-500 transition-all duration-300">
                    <button 
                        onClick={handleEditClick} 
                        className="absolute font-bold top-1 right-1 bg-orange-500 text-white text-[20px] md:text-xs px-2 py-1 rounded hover:bg-red-600 transition-colors duration-200 z-10 h-10 w-15"
                        title="Manage Partner Logos"
                    >
                        EDIT LOGOS
                    </button>
                    {children}
                </div>
            ) : (
                children
            )}

            <PartnerLogosManager 
                isOpen={isManagerOpen}
                onClose={() => setIsManagerOpen(false)}
                onLogosUpdate={handleLogosUpdate}
            />
        </>
    );
}
