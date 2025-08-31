import Banner from '../Components/Banner/Banner';
import Contact from '../Components/Contact/Contact';
import Hero from '../Components/Hero/Hero';
import HeroBottom from '../Components/Hero/HeroBottom';
import TicketTypeSearch from '../Components/Hero/TicketTypeSearch';
import Work from '../Components/How-Its-Work/Work';
import Services from '../Components/Services/Services';
import HelmetWrapper from "../utilities/HelmetWrapper";
import useEditorCheck from '../hooks/useEditorCheck';
import EditButton from '../Components/EditPanel/EditButton';
import useStaticContent from '../hooks/useStaticContent';

const Home = () => {
    // Use the custom hook for editor check
    const { isEditor, error } = useEditorCheck();
    const {getContentByTag, getImageByTag, hasContent, loading, refreshContent} = useStaticContent('home-page');

    return (
        <>
            <HelmetWrapper title="Sightseeing Roma | Hop-On Hop-Off Panoramic Open Bus Tour Ticket" description="Compare and book hop-on hop-off panoramic open bus tour tickets from top operators. Explore Rome’s top sights at your own pace with flexible passes." />
            <EditButton isEditor={isEditor} error={error} page="home" />
            <div>
                <div className="">

                    <Hero isEditor={isEditor} loading={loading} hasContent={hasContent} getContentByTag={getContentByTag} getImageByTag={getImageByTag} refreshContent={refreshContent}></Hero>

                    <div className="block md:hidden">
                        <TicketTypeSearch />
                        <HeroBottom></HeroBottom>
                    </div>

                    <Work isEditor={isEditor} hasContent={hasContent} getContentByTag={getContentByTag} getImageByTag={getImageByTag} refreshContent={refreshContent}></Work>

                    <Services isEditor={isEditor} loading={loading} hasContent={hasContent} getContentByTag={getContentByTag} refreshContent={refreshContent}></Services>

                    <Banner isEditor={isEditor} loading={loading} hasContent={hasContent} getContentByTag={getContentByTag} getImageByTag={getImageByTag} refreshContent={refreshContent}></Banner>

                    <Contact isEditor={isEditor} loading={loading} hasContent={hasContent} getContentByTag={getContentByTag} getImageByTag={getImageByTag} refreshContent={refreshContent}></Contact>

                </div>
            </div>
        </>
    );
};

export default Home;