import Banner2 from './../Components/Banner2/Banner2';
import ReturnImage from "../assets/new/Return-Policy.jpg";
import { useState, useEffect } from "react";
import { baseUrl, baseUrlHashless } from "../utilities/Utilities";
import renderContent from '../utilities/renderContent';
import useStaticContent from '../hooks/useStaticContent';
import useEditorCheck from '../hooks/useEditorCheck';
import EditWrapper from '../Components/Edit_Wrapper/EditWrapper';
import EditImageWrapper from '../Components/Edit_Wrapper/EditImageWrapper';
import EditPanelSheet from '../Components/EditPanel/EditPanelSheet';

const ReturnPolicy = () => {
    const [contactData, setContactData] = useState({
        phone: "+39 327 3633 993", // fallback values
        email: "hello@sightseeingroma.com",
        address: "Via Antonio Fogazzaro, 5, cap–00137, Roma, Italy"
    });
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };

        fetchContactData();
    }, []);

    const { isEditor, error } = useEditorCheck();
    const { getContentByTag, getImageByTag, hasContent, refreshContent } = useStaticContent('return-policy');

    // Get banner image from static content or fallback to imported image
    const bannerImageData = getImageByTag ? getImageByTag('return-policy-banner-image') : null;
    const bannerImageUrl = bannerImageData?.image?.file ? `${baseUrlHashless}${bannerImageData.image.file}` : ReturnImage;

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
        <div className="container mx-auto ">
            <EditPanelSheet isEditor={isEditor} error={error} page="return-policy" refreshContent={refreshContent} />
            {/* Banner Section */}
            <EditImageWrapper
                isEditor={isEditor}
                uniqueTag="return-policy-banner-image"
                refreshContent={refreshContent}
            >
                <Banner2 bannerImgmd={bannerImageUrl} bannerImgsm={bannerImageUrl} opacity={0.5} >
                    <EditWrapper isEditor={isEditor} contentTag={"return-policy-title"} refreshContent={refreshContent}>
                        {renderContent('return-policy-title', hasContent, getContentByTag, 'Return Policy')}
                    </EditWrapper>

                    <EditWrapper isEditor={isEditor} contentTag={"return-policy-subtitle"} refreshContent={refreshContent}>
                        {renderContent('return-policy-subtitle', hasContent, getContentByTag)}
                    </EditWrapper>
                </Banner2>
            </EditImageWrapper>
            
            {/* Content Section */}
            <div className="my-8 space-y-6 py-3 md:py-5 px-5 md:px-8 md:pr-40">
                <EditWrapper isEditor={isEditor} contentTag={"return-policy-page-content"} refreshContent={refreshContent}>
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
                                getRawContent('return-policy-page-content', '')
                            ) 
                        }} />
                    )}
                </EditWrapper>
            </div>
        </div>
    );
};

export default ReturnPolicy;
