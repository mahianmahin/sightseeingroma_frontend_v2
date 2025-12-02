import HelmetWrapper from '../utilities/HelmetWrapper';
import Banner2 from './../Components/Banner2/Banner2';
import AgentPointImage from "../assets/new/Agent-Point-Hero-Section.jpg";
import useEditorCheck from '../hooks/useEditorCheck';
import useStaticContent from '../hooks/useStaticContent';
import EditWrapper from '../Components/Edit_Wrapper/EditWrapper';
import EditImageWrapper from '../Components/Edit_Wrapper/EditImageWrapper';
import EditPanelSheet from '../Components/EditPanel/EditPanelSheet';
import renderContent from '../utilities/renderContent.jsx';
import { baseUrlHashless } from '../utilities/Utilities';
import SEO from '../Components/SEO/SEO';

const AgentPoint = () => {
    const { isEditor, error } = useEditorCheck();
    const staticContentData = useStaticContent('agent-point');
    const { getContentByTag, getImageByTag, hasContent, loading, refreshContent } = staticContentData;

    // Get banner image from static content or fallback to imported image
    const bannerImageData = getImageByTag ? getImageByTag('agent-point-banner-image') : null;
    const bannerImageUrl = bannerImageData?.image?.file ? `${baseUrlHashless}${bannerImageData.image.file}` : AgentPointImage;
    
    return ( <>
        <SEO staticContentData={staticContentData} />
        <EditPanelSheet isEditor={isEditor} error={error} page="agent-point" refreshContent={refreshContent} metaInfo={staticContentData?.pageData} />
        <div className="container mx-auto ">{/* Banner Section */}
            <EditImageWrapper
                isEditor={isEditor}
                uniqueTag="agent-point-banner-image"
                refreshContent={refreshContent}
            >
                <Banner2 bannerImgmd={bannerImageUrl} bannerImgsm={bannerImageUrl} opacity={0.7}>
                    <EditWrapper isEditor={isEditor} contentTag={"agent-point-title"} refreshContent={refreshContent}>
                        {renderContent('agent-point-title', hasContent, getContentByTag, 'Our Agent Locations')}
                    </EditWrapper>

                    <EditWrapper isEditor={isEditor} contentTag={"agent-point-subtitle"} refreshContent={refreshContent}>
                        {renderContent('agent-point-subtitle', hasContent, getContentByTag, 'Find our trusted bus service agents conveniently located near you. Whether you\'re booking your next trip, looking for travel information, or need assistance, our agents are here to help.')}
                    </EditWrapper>
                </Banner2>
            </EditImageWrapper>

            {/* Google Map Embed */}
            <div className="py-4 mb-5 md:mb-10 px-0 md:px-10">
                
                <div className="w-full overflow-hidden rounded-lg">
                    {/* <EditWrapper isEditor={isEditor} contentTag={"agent-point-iframe-code"} refreshContent={refreshContent}>
                        {hasContent('agent-point-iframe-code') ? (
                            <div dangerouslySetInnerHTML={{ __html: getContentByTag('agent-point-iframe-code') }} />
                        ) : (
                            <div className="flex items-center justify-center h-[480px] bg-gray-100 rounded-lg">
                                <p className="text-gray-500">Loading map...</p>
                            </div>
                        )}
                    </EditWrapper> */}

                    <iframe src="https://www.google.com/maps/d/u/0/embed?mid=1P0UrlCLUfEB_xT4TmrzdMK0aYOvBSaI&ehbc=2E312F&noprof=1" width="100%" height="480"></iframe>
                </div>

            </div>
            
            {/* Content Section */}
            <div className="my-8 py-3 space-y-6 px-6 md:px-10">
                
                <EditWrapper isEditor={isEditor} contentTag={"agent-point-body"} refreshContent={refreshContent}>
                    {renderContent('agent-point-body', hasContent, getContentByTag)}
                </EditWrapper>

            </div>

        </div>
        </>);
};

export default AgentPoint;
