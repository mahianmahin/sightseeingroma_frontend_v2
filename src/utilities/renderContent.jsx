import React from 'react';

/**
 * Renders dynamic content with a fallback.
 * @param {string} contentTag - The tag for the content to render.
 * @param {function} hasContent - Function to check if content exists.
 * @param {function} getContentByTag - Function to get content by tag.
 * @param {string} [fallbackText="Loading..."] - The text to show if content doesn't exist.
 * @returns {JSX.Element}
 */
const renderContent = (contentTag, hasContent, getContentByTag, fallbackText = "Loading...") => {
    return (hasContent(contentTag)
        ? <span dangerouslySetInnerHTML={{ __html: getContentByTag(contentTag) }} />
        : <div>{fallbackText}</div>
    );
};

export default renderContent;