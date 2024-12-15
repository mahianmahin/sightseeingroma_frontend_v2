import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
const Description = () => {
    return (
        <div className="p-2 bg-3  flex flex-col lg:flex-row gap-8 pt-20">
            {/* Description Section */}
            <div className="flex-1 p-6  ">
                <h1 className="text-2xl font-bold mb-4">Description</h1>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Rome wasn't built in a day, but our Discover Ticket lets you enjoy the best of
                    the city in less than 24 hours. Hop on our day tour to discover iconic structures
                    like the Colosseum, Pantheon, Trevi Fountain and Spanish Steps, complete with
                    insightful digital commentary!
                </p>
                <p className="text-gray-700 leading-relaxed">
                    Our sightseeing tour of Rome offers insight into the city's rich past and
                    contemporary culture with informative, pre-recorded commentary. Throughout the
                    tour you can hop on and hop off to explore Rome’s famous landmarks and attractions
                    at your own pace.
                </p>
            </div>

            {/* What's Included Section */}
            <div className="flex-1 p-6 ">
                <h2 className="text-2xl font-bold mb-4">What’s Included:</h2>
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
            </div>
        </div>
    );
};

export default Description;
