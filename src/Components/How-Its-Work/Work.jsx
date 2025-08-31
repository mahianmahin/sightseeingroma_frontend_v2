import { FaCreditCard, FaQrcode, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { TiTickOutline } from "react-icons/ti";
import processImage from "../../assets/process_image.png";
import EditImageWrapper from "../Edit_Wrapper/EditImageWrapper";
import EditWrapper from "../Edit_Wrapper/EditWrapper";
import { baseUrlHashless } from "../../utilities/Utilities";
import renderContent from "../../utilities/renderContent";

const Work = (props) => {
    // Get process image from static content or fallback to imported image
    const processImageData = props.getImageByTag ? props.getImageByTag('process') : null;
    const processImageUrl = processImageData?.image?.file ? `${baseUrlHashless}${processImageData.image.file}` : processImage;
    
    // Get process steps content from static content
    const processStepsContent = props.getContentByTag ? props.getContentByTag('process-steps') : '';
    
    return (
        <EditImageWrapper
            isEditor={props.isEditor}
            uniqueTag="process"
            refreshContent={props.refreshContent}
        >
            <div
                className="bg-cover bg-center text-white py-10 lg:py-20"
                style={{ backgroundImage: `url(${processImageUrl})` }}
            >
            {/* Container */}
            <div className="flex flex-col lg:flex-row h-full items-center lg:items-start justify-center lg:justify-end px-6 lg:px-20">
            <div className="space-y-10 max-w-md relative">
                <div className="absolute left-5 top-10 bottom-12 md:bottom-16 border-l-2 border-dotted border-gray-300"></div>
                    <div>
                        <EditWrapper isEditor={props.isEditor} contentTag="process-steps" refreshContent={props.refreshContent}>
                            {renderContent('process-steps', props.hasContent, props.getContentByTag)}
                        </EditWrapper>
                    </div>
                </div>
                    
            </div>
            </div>
        </EditImageWrapper>
    );
};

export default Work;
