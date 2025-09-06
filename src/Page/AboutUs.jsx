import Banner2 from "../Components/Banner2/Banner2";
import EditWrapper from "../Components/Edit_Wrapper/EditWrapper";
import EditImageWrapper from "../Components/Edit_Wrapper/EditImageWrapper";
import EditPanelSheet from "../Components/EditPanel/EditPanelSheet";
import AboutUsImage from "../assets/new/About-Us.jpg";
import useEditorCheck from "../hooks/useEditorCheck";
import useStaticContent from "../hooks/useStaticContent";
import renderContent from "../utilities/renderContent";
import { useState, useEffect } from "react";
import { baseUrl, baseUrlHashless } from "../utilities/Utilities";
import SEO from '../Components/SEO/SEO';

const AboutUs = () => {
    const [contactData, setContactData] = useState({
        phone: "+39 327 3633 993", // fallback values
        email: "hello@sightseeingroma.com",
        address: "Via Antonio Fogazzaro, 5, cap–00137, Roma, Italy"
    });

    useEffect(() => {
        const fetchContactData = async () => {
            try {
                const response = await fetch(`${baseUrl}website-settings/`);
                if (response.ok) {
                    const result = await response.json();
                    if (result.status === 200 && result.data) {
                        setContactData({
                            phone: result.data.website_phone_number || contactData.phone,
                            email: result.data.website_email || contactData.email,
                            address: result.data.website_address || contactData.address
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching contact data:", error);
                // Keep fallback values if API fails
            }
        };

        fetchContactData();
    }, []);

    const { isEditor, error } = useEditorCheck();
    const staticContentData = useStaticContent('about-us');
    const { getContentByTag, getImageByTag, hasContent, loading, refreshContent } = staticContentData;

    // Get banner image from static content or fallback to imported image
    const bannerImageData = getImageByTag ? getImageByTag('about-us-banner-image') : null;
    const bannerImageUrl = bannerImageData?.image?.file ? `${baseUrlHashless}${bannerImageData.image.file}` : AboutUsImage;

    // Function to replace template variables in content
    const replaceTemplateVariables = (content) => {
        if (!content || typeof content !== 'string') return content;
        
        return content
            .replace(/\{email\}/g, contactData.email)
            .replace(/\{phone\}/g, contactData.phone)
            .replace(/\{address\}/g, contactData.address);
    };

    // Function to get raw content as string
    const getRawContent = (contentTag, fallback = '') => {
        if (hasContent(contentTag)) {
            return getContentByTag(contentTag);
        }
        return fallback;
    };

    return (
        <>
            <SEO staticContentData={staticContentData} />
            <div className="container mx-auto">
                <EditPanelSheet isEditor={isEditor} error={error} page="about-us" refreshContent={refreshContent} metaInfo={staticContentData?.pageData} />
                {/* Banner */}
                <EditImageWrapper
                    isEditor={isEditor}
                    uniqueTag="about-us-banner-image"
                    refreshContent={refreshContent}
                >
                    <Banner2 bannerImgmd={bannerImageUrl} bannerImgsm={bannerImageUrl} opacity={0.5}>
                        <EditWrapper isEditor={isEditor} contentTag={"about-us-title"} refreshContent={refreshContent}>
                            {renderContent('about-us-title', hasContent, getContentByTag, 'About Us')}
                        </EditWrapper>

                        <EditWrapper isEditor={isEditor} contentTag={"about-us-subtitle"} refreshContent={refreshContent}>
                            {renderContent('about-us-subtitle', hasContent, getContentByTag)}
                        </EditWrapper>
                    </Banner2>
                </EditImageWrapper>

                {/* Content Section */}
                <div className="my-14 grid grid-cols-1 lg:grid-cols-1 gap-12 items-center  md:pl-14  px-5">
                    
                    <EditWrapper isEditor={isEditor} contentTag={"about-us-page-content"} refreshContent={refreshContent}>
                        {loading ? (
                            <div className="space-y-4">
                                <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2 mt-8"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                            </div>
                        ) : (
                            <div dangerouslySetInnerHTML={{ 
                                __html: replaceTemplateVariables(
                                    getRawContent('about-us-page-content', '')
                                ) 
                            }} />
                        )}
                    </EditWrapper>

                    {/* Image Section */}
                    {/* <div className="relative">
                        <img
                            src="/Banner/Frame.png"
                            alt="Sightseeing Bus"
                            className="rounded-lg hidden md:block w-full h-auto"
                        />
                    </div> */}
                </div>
            </div>
        </>
    );
};

export default AboutUs;
