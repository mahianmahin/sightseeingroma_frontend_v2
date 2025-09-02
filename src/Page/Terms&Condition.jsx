import Banner2 from './../Components/Banner2/Banner2';
import TermsConditionImage from "../assets/new/Terms-&-Conditions.jpg";
import { useState, useEffect } from "react";
import { baseUrl, baseUrlHashless } from "../utilities/Utilities";
import useEditorCheck from '../hooks/useEditorCheck';
import useStaticContent from '../hooks/useStaticContent';
import renderContent from '../utilities/renderContent.jsx';
import EditWrapper from '../Components/Edit_Wrapper/EditWrapper';
import EditImageWrapper from '../Components/Edit_Wrapper/EditImageWrapper';
import { render } from 'react-dom';

const TermsCondition = () => {
    const [contactData, setContactData] = useState({
        phone: "+39 327 3633 993", // fallback values
        email: "hello@sightseeingroma.com",
        address: "Via Antonio Fogazzaro,5, cap-00137, Roma, Italy"
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

    const { isEditor } = useEditorCheck();
    const { getContentByTag, getImageByTag, hasContent, refreshContent } = useStaticContent('terms-conditions');

    // Get banner image from static content or fallback to imported image
    const bannerImageData = getImageByTag ? getImageByTag('terms-conditions-banner-image') : null;
    const bannerImageUrl = bannerImageData?.image?.file ? `${baseUrlHashless}${bannerImageData.image.file}` : TermsConditionImage;

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
        <div className="container mx-auto">
            {/* Banner Section */}
            <EditImageWrapper
                isEditor={isEditor}
                uniqueTag="terms-conditions-banner-image"
                refreshContent={refreshContent}
            >
                <Banner2 bannerImgmd={bannerImageUrl} bannerImgsm={bannerImageUrl} >
                    <EditWrapper isEditor={isEditor} contentTag={"terms-conditions-title"} refreshContent={refreshContent}>
                        {renderContent('terms-conditions-title', hasContent, getContentByTag, 'Terms & Conditions')}
                    </EditWrapper>

                    <EditWrapper isEditor={isEditor} contentTag={"terms-conditions-subtitle"} refreshContent={refreshContent}>
                        {renderContent('terms-conditions-subtitle', hasContent, getContentByTag)}
                    </EditWrapper>
                </Banner2>
            </EditImageWrapper>

            {/* Terms & Conditions Content */}
            <EditWrapper isEditor={isEditor} contentTag={"terms-conditions-page-content"} refreshContent={refreshContent}>
                {loading ? (
                    <div className="px-5 md:px-8 md:pr-48 py-12">
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2 mt-8"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                        </div>
                    </div>
                ) : (
                    <div dangerouslySetInnerHTML={{ 
                        __html: replaceTemplateVariables(
                            getRawContent('terms-conditions-page-content', '')
                        ) 
                    }} />
                )}
            </EditWrapper>
        </div>
    );
};

export default TermsCondition;
