import Banner from '../Components/Banner/Banner';
import Contact from '../Components/Contact/Contact';
import Hero from '../Components/Hero/Hero';
import HeroBottom from '../Components/Hero/HeroBottom';
import Work from '../Components/How-Its-Work/Work';
import Services from '../Components/Services/Services';
import SectionNav from '../Components/SectionNav/SectionNav';
import HelmetWrapper from "../utilities/HelmetWrapper";
import useEditorCheck from '../hooks/useEditorCheck';
import EditPanelSheet from '../Components/EditPanel/EditPanelSheet';
import useStaticContent from '../hooks/useStaticContent';
import SEO from '../Components/SEO/SEO';

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


                    {/* Tickets Section */}
                    <div id="tickets">
                        <Services isEditor={isEditor} loading={loading} hasContent={hasContent} getContentByTag={getContentByTag} refreshContent={refreshContent}></Services>
                    </div>
                    
                    {/* Features Section */}
                    <div id="features">
                        <Work isEditor={isEditor} hasContent={hasContent} getContentByTag={getContentByTag} getImageByTag={getImageByTag} refreshContent={refreshContent}></Work>
                    </div>

                    {/* Routes Section */}
                    <div id="routes">
                        <Contact isEditor={isEditor} loading={loading} hasContent={hasContent} getContentByTag={getContentByTag} getImageByTag={getImageByTag} refreshContent={refreshContent}></Contact>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Home;