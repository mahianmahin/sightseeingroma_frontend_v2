import { useState, useEffect } from 'react';
import { baseUrl } from '../utilities/Utilities';

const useEditorCheck = () => {
    const [isEditor, setIsEditor] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkEditorStatus = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const accessToken = localStorage.getItem('access');
                if (!accessToken) {
                    // No token, user is not logged in
                    localStorage.setItem('is_editor', 'false');
                    setIsEditor(false);
                    return;
                }

                const response = await fetch(`${baseUrl}check-editor/`, {
                    headers: { 
                        Authorization: `Bearer ${accessToken}` 
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const editorStatus = data.is_editor || false;
                    
                    localStorage.setItem('is_editor', editorStatus.toString());
                    setIsEditor(editorStatus);
                } else {
                    // API error, set as non-editor
                    localStorage.setItem('is_editor', 'false');
                    setIsEditor(false);
                    setError('Failed to check editor status');
                }
            } catch (error) {
                console.error('Error checking editor status:', error);
                localStorage.setItem('is_editor', 'false');
                setIsEditor(false);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        checkEditorStatus();
    }, []);

    // Function to manually refresh editor status
    const refreshEditorStatus = async () => {
        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
            localStorage.setItem('is_editor', 'false');
            setIsEditor(false);
            return false;
        }

        try {
            const response = await fetch(`${baseUrl}check-editor/`, {
                headers: { 
                    Authorization: `Bearer ${accessToken}` 
                }
            });

            if (response.ok) {
                const data = await response.json();
                const editorStatus = data.is_editor || false;
                
                localStorage.setItem('is_editor', editorStatus.toString());
                setIsEditor(editorStatus);
                return editorStatus;
            } else {
                localStorage.setItem('is_editor', 'false');
                setIsEditor(false);
                return false;
            }
        } catch (error) {
            console.error('Error refreshing editor status:', error);
            localStorage.setItem('is_editor', 'false');
            setIsEditor(false);
            return false;
        }
    };

    return {
        isEditor,
        loading,
        error,
        refreshEditorStatus
    };
};

export default useEditorCheck;
