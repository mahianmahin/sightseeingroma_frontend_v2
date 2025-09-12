export default function Description2({ description }) {
    return (
        <div className="p-2 bg-3 flex flex-col-reverse lg:flex-row gap-8 pt-5">
            {/* Description Section */}
            {description ? <div className="flex-1 p-6" dangerouslySetInnerHTML={{ __html: description }} /> : <span>Loading...</span>}
                {/* <div className="space-y-6">
                    <div className="bg-gradient-to-r from-red-50 to-white p-6 rounded-lg text-lg">
                        <p className="text-gray-800 leading-relaxed">
                            Experience the Eternal City in just one day with the
                            <span className="font-bold"> CitySightseeing 1 Day Ticket </span>.
                            Hop on the red open-top double-decker buses at
                            <span className="font-semibold"> Roma Termini Station </span>
                            and explore iconic landmarks like the Colosseum, Imperial Forums, and Circus Maximus. <br />
                            Enjoy the flexibility to hop on and off at your leisure and discover Rome from a unique perspective.
                            With audio commentary available in 8 languages and free Wi-Fi onboard, this tour offers an unforgettable view of Rome.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                            What's Included
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <span className="text-green-500 font-bold text-lg mt-0.5">✓</span>
                                <span className="text-gray-700">1-Day Unlimited Access</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="text-green-500 font-bold text-lg mt-0.5">✓</span>
                                <span className="text-gray-700">Audio guide in 8 languages</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="text-green-500 font-bold text-lg mt-0.5">✓</span>
                                <span className="text-gray-700">Free Wi-Fi onboard</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="text-green-500 font-bold text-lg mt-0.5">✓</span>
                                <span className="text-gray-700">Free app 'Sightseeing Experience' for real-time bus tracking</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="text-green-500 font-bold text-lg mt-0.5">✓</span>
                                <span className="text-gray-700">Walking tour included (5 languages)</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="text-green-500 font-bold text-lg mt-0.5">✓</span>
                                <span className="text-gray-700">Hop on and off as many times as you want</span>
                            </div>

                            <div className="flex items-start space-x-3">
                                <span className="text-red-500 font-bold text-lg mt-0.5">✗</span>
                                <span className="text-gray-600 italic">Drinks, meals, and pick-up service</span>
                            </div>
                        </div>
                    </div>
                </div> */}
        </div>
    );
}