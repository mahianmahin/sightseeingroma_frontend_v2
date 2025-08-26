import { useEffect, useState } from 'react';
import { baseUrl } from '../utilities/Utilities';

const useStaticContent = (pageSlug) => {
    const [pageData, setPageData] = useState(null);
    const [contentBlocks, setContentBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStaticContent = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${baseUrl}static-content/${pageSlug}/`);
                
                if (response.ok) {
                    const data = await response.json();
                    
                    if (data.status === 200) {
                        setPageData(data.page);
                        setContentBlocks(data.content_blocks || []);
                    } else {
                        setError('Failed to fetch content');
                    }
                } else {
                    setError(`HTTP Error: ${response.status}`);
                }
            } catch (error) {
                console.error('Error fetching static content:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (pageSlug) {
            fetchStaticContent();
        }
    }, [pageSlug]);

    // Helper function to process HTML content and preserve Tailwind classes
    const processHTMLContent = (htmlContent) => {
        if (!htmlContent) return '';
        
        // Replace className with class for proper HTML rendering
        // Also handle any React-specific attributes
        let processedHTML = htmlContent
            .replace(/className=/g, 'class=')
            .replace(/htmlFor=/g, 'for=');
        
        return processedHTML;
    };

    // Helper function to get content by unique tag
    const getContentByTag = (uniqueTag) => {
        const block = contentBlocks.find(block => block.unique_tag === uniqueTag);
        return block ? processHTMLContent(block.block_content) : '';
    };

    // Helper function to get content block object by unique tag
    const getBlockByTag = (uniqueTag) => {
        const block = contentBlocks.find(block => block.unique_tag === uniqueTag);
        if (!block) return null;
        
        // Return block with processed content
        return {
            ...block,
            block_content: processHTMLContent(block.block_content)
        };
    };

    // Helper function to check if content exists for a tag
    const hasContent = (uniqueTag) => {
        return contentBlocks.some(block => block.unique_tag === uniqueTag && block.is_active);
    };

    // Helper function to get all content blocks by type
    const getContentByType = (blockType) => {
        return contentBlocks
            .filter(block => block.block_type === blockType && block.is_active)
            .map(block => ({
                ...block,
                block_content: processHTMLContent(block.block_content)
            }));
    };

    // Function to refresh content (for after editing)
    const refreshContent = async () => {
        if (!pageSlug) return;
        
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}static-content/${pageSlug}/`);
            
            if (response.ok) {
                const data = await response.json();
                if (data.status === 200) {
                    setPageData(data.page);
                    setContentBlocks(data.content_blocks || []);
                }
            }
        } catch (error) {
            console.error('Error refreshing content:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to update content via API
    const updateContent = async (contentTag, newContent) => {
        try {
            const accessToken = localStorage.getItem('access');
            if (!accessToken) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${baseUrl}edit-content/${contentTag}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: newContent
                })
            });

            const data = await response.json();

            if (response.ok && data.status === 200) {
                // Refresh content after successful update
                await refreshContent();
                return { success: true, data: data.data };
            } else {
                throw new Error(data.message || 'Failed to update content');
            }
        } catch (error) {
            console.error('Error updating content:', error);
            return { success: false, error: error.message };
        }
    };

    return {
        // Data
        pageData,
        contentBlocks,
        loading,
        error,
        
        // Helper functions
        getContentByTag,
        getBlockByTag,
        hasContent,
        getContentByType,
        refreshContent,
        updateContent
    };
};

export default useStaticContent;
