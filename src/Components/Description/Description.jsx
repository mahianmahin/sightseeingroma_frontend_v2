import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import PropTypes from 'prop-types';

const Description = ({ description }) => {

Description.propTypes = {
    description: PropTypes.string.isRequired,
};
    return (
        <div className="p-2 bg-3  flex flex-col-reverse lg:flex-row gap-8 pt-5">
            {/* Description Section */}
            <div className="flex-1 p-6  ">
                <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>

            {/* What's Included Section */}
            {/* <div className="flex-1 p-6 ">
                <h2 className="text-xl md:text-2xl font-bold mb-4">What’s Included:</h2>
                <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-700">
                        <TiTick></TiTick> Full access to all bus routes
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                        <TiTick></TiTick> Multilingual assistant onboard
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                        <TiTick></TiTick> Map of the city
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                        <TiTick></TiTick> Wi-fi onboard
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                        <TiTick></TiTick> Multilingual audio-guides
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                        <TiTick></TiTick> Single use earphones
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                        <TiTick></TiTick> Timetable of the bus rides
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                        <TiTick></TiTick> Free App GLT
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                        <TiTick></TiTick> Electronic voucher
                    </li>
                    <li className="flex  items-center gap-2 text-gray-700">
                       <RxCross2 ></RxCross2>  Entrance fees
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                       <RxCross2></RxCross2>  Drinks, foods and souvenir shopping
                    </li>
                </ul>
            </div> */}
        </div>
    );
};

export default Description;
