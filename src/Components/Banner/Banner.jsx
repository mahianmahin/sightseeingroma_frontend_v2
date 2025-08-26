import { render } from "react-dom";
import bannerImage from "../../assets/banner_image.png";
import EditWrapper from "../Edit_Wrapper/EditWrapper";

const Banner = (props) => {

    // Utility function to render content with loading fallback
    const renderContent = (contentTag, fallbackText = "Loading...") => {
    return props.hasContent(contentTag) 
      ? <span dangerouslySetInnerHTML={{__html: props.getContentByTag(contentTag)}}></span> 
      : <div>{fallbackText}</div>;
    };


    return (
        <div className="relative h-[220px] md:h-[320px]  bg-cover bg-center" style={{ backgroundImage: `url(${bannerImage})` }}>
            {/* Overlay for Text Centering */}
            <div className="absolute inset-0  0flex flex-col items-center justify-center  flex text-center p-4">
                
                <EditWrapper isEditor={props.isEditor} contentTag={"home-banner-title"} refreshContent={props.refreshContent}>
                    {renderContent('home-banner-title')}
                </EditWrapper>
                
                <EditWrapper isEditor={props.isEditor} contentTag={"home-banner-subtitle"} refreshContent={props.refreshContent}>
                    {renderContent('home-banner-subtitle')}
                </EditWrapper>

            </div>
        </div>
    );
};

export default Banner;
