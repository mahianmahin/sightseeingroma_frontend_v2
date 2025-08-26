import HelmetWrapper from '../utilities/HelmetWrapper';
import Banner2 from './../Components/Banner2/Banner2';
import AgentPointImage from "../assets/new/Agent-Point-Hero-Section.jpg";
import useEditorCheck from '../hooks/useEditorCheck';
import useStaticContent from '../hooks/useStaticContent';
import EditWrapper from '../Components/Edit_Wrapper/EditWrapper';

const AgentPoint = () => {
    const { isEditor } = useEditorCheck();
    const { getContentByTag, hasContent, refreshContent } = useStaticContent('agent-point');
    
    const renderContent = (contentTag, fallbackText = "Loading...") => {
    return hasContent(contentTag)
        ? <span dangerouslySetInnerHTML={{ __html: getContentByTag(contentTag) }}></span>
        : <div>{fallbackText}</div>;
    };

    return ( <>
        <HelmetWrapper title="Agent Point—Book Tickets & Get Travel Advice | Sightseeing Roma" description="Visit our Agent Points in Rome to easily book bus tour tickets, receive local travel advice, and access exclusive deals with Sightseeing Roma." />
        <div className="container mx-auto ">
            {/* Banner Section */}
            <Banner2 bannerImgmd={AgentPointImage} bannerImgsm={AgentPointImage} opacity={0.7}>
                <EditWrapper isEditor={isEditor} contentTag={"agent-point-title"} refreshContent={refreshContent}>
                    {renderContent('agent-point-title', 'Our Agent Locations')}
                </EditWrapper>

                <EditWrapper isEditor={isEditor} contentTag={"agent-point-subtitle"} refreshContent={refreshContent}>
                    {renderContent('agent-point-subtitle', 'Find our trusted bus service agents conveniently located near you. Whether you\'re booking your next trip, looking for travel information, or need assistance, our agents are here to help.')}
                </EditWrapper>
            </Banner2>

            {/* Content Section */}
            <div className="my-8 py-3 space-y-6 px-6 md:px-10">
                
                <EditWrapper isEditor={isEditor} contentTag={"agent-point-body"} refreshContent={refreshContent}>
                    {renderContent('agent-point-body')}
                </EditWrapper>

            </div>

            {/* Google Map Embed */}
                <div className="py-4 mb-5 md:mb-10 px-0 md:px-10">
                   
                    <div className="">
                        <EditWrapper isEditor={isEditor} contentTag={"agent-point-iframe-code"} refreshContent={refreshContent}>
                            {renderContent('agent-point-iframe-code', '<p>Loading map...</p>')}
                        </EditWrapper>
                    </div>

                </div>
        </div>
        </>);
};

export default AgentPoint;
