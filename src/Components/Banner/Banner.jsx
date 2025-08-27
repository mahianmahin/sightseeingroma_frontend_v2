import { render } from "react-dom";
import bannerImage from "../../assets/banner_image.png";
import EditWrapper from "../Edit_Wrapper/EditWrapper";
import renderContent from "../../utilities/renderContent.jsx";

const Banner = (props) => {
    return (
        <div className="relative h-[220px] md:h-[320px]  bg-cover bg-center" style={{ backgroundImage: `url(${bannerImage})` }}>
            {/* Overlay for Text Centering */}
            <div className="absolute inset-0  0flex flex-col items-center justify-center  flex text-center p-4">
                
                <EditWrapper isEditor={props.isEditor} contentTag={"home-banner-title"} refreshContent={props.refreshContent}>
                    {renderContent('home-banner-title', props.hasContent, props.getContentByTag, 'Welcome to Sightseeing Roma')}
                </EditWrapper>
                
                <EditWrapper isEditor={props.isEditor} contentTag={"home-banner-subtitle"} refreshContent={props.refreshContent}>
                    {renderContent('home-banner-subtitle', props.hasContent, props.getContentByTag, 'Discover the beauty of Rome with our premium bus services')}
                </EditWrapper>

            </div>
        </div>
    );
};

export default Banner;
