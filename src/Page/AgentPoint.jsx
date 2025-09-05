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

const AgentPoint = () => {
    const { isEditor, error } = useEditorCheck();
    const { getContentByTag, getImageByTag, hasContent, refreshContent } = useStaticContent('agent-point');
    
    // Get banner image from static content or fallback to imported image
    const bannerImageData = getImageByTag ? getImageByTag('agent-point-banner-image') : null;
    const bannerImageUrl = bannerImageData?.image?.file ? `${baseUrlHashless}${bannerImageData.image.file}` : AgentPointImage;
    
    return ( <>
        <HelmetWrapper title="Agent Point—Book Tickets & Get Travel Advice | Sightseeing Roma" description="Visit our Agent Points in Rome to easily book bus tour tickets, receive local travel advice, and access exclusive deals with Sightseeing Roma." />
        <EditPanelSheet isEditor={isEditor} error={error} page="Agent Point" refreshContent={refreshContent} />
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

            {/* Content Section */}
            <div className="my-8 py-3 space-y-6 px-6 md:px-10">
                
                <EditWrapper isEditor={isEditor} contentTag={"agent-point-body"} refreshContent={refreshContent}>
                    {renderContent('agent-point-body', hasContent, getContentByTag)}
                </EditWrapper>

            </div>

            {/* Google Map Embed */}
                <div className="py-4 mb-5 md:mb-10 px-0 md:px-10">
                   
                    <div className="">
                        <EditWrapper isEditor={isEditor} contentTag={"agent-point-iframe-code"} refreshContent={refreshContent}>
                            {renderContent('agent-point-iframe-code', hasContent, getContentByTag, '<p>Loading map...</p>')}
                        </EditWrapper>
                    </div>

                </div>
        </div>
        </>);
};

export default AgentPoint;
