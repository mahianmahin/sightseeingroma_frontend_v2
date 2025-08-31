import { useEffect, useState } from 'react';
import { baseUrl } from '../utilities/Utilities';

const useStaticContent = (pageSlug) => {
    const [pageData, setPageData] = useState(null);
    const [contentBlocks, setContentBlocks] = useState([]);
    const [pageImages, setPageImages] = useState([]);
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
                        setPageImages(data.page_images || []);
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

    // Helper function to get content by unique tag (checks both content blocks and page images)
    const getContentByTag = (uniqueTag) => {
        // First check content blocks
        const contentBlock = contentBlocks.find(block => block.unique_tag === uniqueTag);
        if (contentBlock) {
            return processHTMLContent(contentBlock.block_content);
        }
        
        // Then check page images
        const pageImage = pageImages.find(img => img.unique_tag === uniqueTag);
        if (pageImage && pageImage.image) {
            return pageImage.image.file; // Return the image file path
        }
        
        return '';
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

    // Helper function to get page image object by unique tag
    const getImageByTag = (uniqueTag) => {
        const pageImage = pageImages.find(img => img.unique_tag === uniqueTag);
        return pageImage || null;
    };

    // Helper function to check if content exists for a tag (checks both content blocks and page images)
    const hasContent = (uniqueTag) => {
        // Check content blocks
        const hasContentBlock = contentBlocks.some(block => block.unique_tag === uniqueTag && block.is_active);
        if (hasContentBlock) return true;
        
        // Check page images
        const hasPageImage = pageImages.some(img => img.unique_tag === uniqueTag && img.image);
        return hasPageImage;
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
                    setPageImages(data.page_images || []);
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
        pageImages,
        loading,
        error,
        
        // Helper functions
        getContentByTag,
        getBlockByTag,
        getImageByTag,
        hasContent,
        getContentByType,
        refreshContent,
        updateContent
    };
};

export default useStaticContent;
