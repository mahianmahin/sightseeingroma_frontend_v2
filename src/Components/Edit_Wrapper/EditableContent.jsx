export default function EditableContent({hasContent, getContentByTag, contentTag}) {
    return (
        <>
            {hasContent(contentTag) ? (
                <span dangerouslySetInnerHTML={{__html: getContentByTag(contentTag)}}></span>
            ) : (
                <div>Loading...</div>
            )}
        </>
    )
}