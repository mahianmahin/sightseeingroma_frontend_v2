import Banner2 from './../Components/Banner2/Banner2';
import RefundImage from "../assets/new/Refund-Policy.jpg";
import { useState, useEffect } from "react";
import { baseUrl } from "../utilities/Utilities";
import useEditorCheck from '../hooks/useEditorCheck';
import useStaticContent from '../hooks/useStaticContent';
import EditWrapper from '../Components/Edit_Wrapper/EditWrapper';
import renderContent from '../utilities/renderContent';

const Refund = () => {
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

    const { isEditor } = useEditorCheck();
    const { getContentByTag, hasContent, refreshContent } = useStaticContent('refund-policy');

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
            {/* Banner Section */}
            <Banner2 bannerImgmd={RefundImage} bannerImgsm={RefundImage} opacity={0.5}>
                <EditWrapper isEditor={isEditor} contentTag={"refund-policy-title"} refreshContent={refreshContent}>
                    {renderContent('refund-policy-title', hasContent, getContentByTag, 'Refund Policy')}
                </EditWrapper>

                <EditWrapper isEditor={isEditor} contentTag={"refund-policy-subtitle"} refreshContent={refreshContent}>
                    {renderContent('refund-policy-subtitle', hasContent, getContentByTag)}
                </EditWrapper>
            </Banner2>
            
            {/* Content Section */}
            <div className="my-8 space-y-6 px-5 md:px-8 md:pr-40 py-3 md:py-5">
                <EditWrapper isEditor={isEditor} contentTag={"refund-policy-page-content"} refreshContent={refreshContent}>
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
                                getRawContent('refund-policy-page-content', '')
                            ) 
                        }} />
                    )}
                </EditWrapper>
            </div>
        </div>
    );
};

export default Refund;
