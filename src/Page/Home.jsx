import React, { lazy, Suspense } from 'react';
import Hero from '../Components/Hero/Hero';
import SectionNav from '../Components/SectionNav/SectionNav';
import HelmetWrapper from "../utilities/HelmetWrapper";
import useEditorCheck from '../hooks/useEditorCheck';
import EditPanelSheet from '../Components/EditPanel/EditPanelSheet';
import useStaticContent from '../hooks/useStaticContent';
import SEO from '../Components/SEO/SEO';

// Below-fold components — lazy-loaded for code splitting
const FeaturedToday = lazy(() => import('../Components/FeaturedToday/FeaturedToday'));
const WhyBook = lazy(() => import('../Components/WhyBook/WhyBook'));
const FinalCTA = lazy(() => import('../Components/FinalCTA/FinalCTA'));
const Services = lazy(() => import('../Components/Services/Services'));
const CustomerReviews = lazy(() => import('../Components/CustomerReviews/CustomerReviews'));
const PromoBanner = lazy(() => import('../Components/PromoBanner/PromoBanner'));
const RecommendedServices = lazy(() => import('../Components/RecommendedServices/RecommendedServices'));
const Work = lazy(() => import('../Components/How-Its-Work/Work'));
const Contact = lazy(() => import('../Components/Contact/Contact'));

const Home = () => {
    // Use the custom hook for editor check
    const { isEditor, error } = useEditorCheck();
    const staticContentData = useStaticContent('home-page');
    const {getContentByTag, getImageByTag, hasContent, loading, refreshContent} = staticContentData;
    

    return (
        <>
            <SEO staticContentData={staticContentData} />
            <EditPanelSheet isEditor={isEditor} error={error} page="home-page" refreshContent={refreshContent} metaInfo={staticContentData?.pageData} />
            <div>
                <div className="">

                    <Hero isEditor={isEditor} loading={loading} hasContent={hasContent} getContentByTag={getContentByTag} getImageByTag={getImageByTag} refreshContent={refreshContent}></Hero>

                    {/* Section Navigation */}
                    <SectionNav />

                    {/* Below-fold content — lazy-loaded */}
                    <Suspense fallback={<div className="min-h-screen" />}>

                    {/* Featured Today Section */}
                    <FeaturedToday isEditor={isEditor} hasContent={hasContent} getContentByTag={getContentByTag} getImageByTag={getImageByTag} refreshContent={refreshContent} />

                    <WhyBook isEditor={isEditor} getImageByTag={getImageByTag} loading={loading} />

                    {/* Section 5: Final CTA */}
                    <FinalCTA isEditor={isEditor} getImageByTag={getImageByTag} loading={loading} />

                    {/* Tickets Section */}
                    <div id="tickets">
                        <Services isEditor={isEditor} loading={loading} hasContent={hasContent} getContentByTag={getContentByTag} refreshContent={refreshContent}></Services>
                    </div>

                    <CustomerReviews />

                    <PromoBanner />
                    
                    <RecommendedServices />

                    
                    {/* Features Section */}
                    <div id="features">
                        <Work isEditor={isEditor} hasContent={hasContent} getContentByTag={getContentByTag} getImageByTag={getImageByTag} refreshContent={refreshContent}></Work>
                    </div>

                    {/* Routes Section */}
                    <div id="routes">
                        <Contact isEditor={isEditor} loading={loading} hasContent={hasContent} getContentByTag={getContentByTag} getImageByTag={getImageByTag} refreshContent={refreshContent}></Contact>
                    </div>

                    </Suspense>

                </div>
            </div>
        </>
    );
};

export default Home;