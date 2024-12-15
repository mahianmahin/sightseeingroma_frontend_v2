import React, { useState } from "react";

const ManageBookingSm = () => {
    const [adultCount, setAdultCount] = useState(3);
    const [youthCount, setYouthCount] = useState(3);
    const pricePerTicket = 28;

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h1 className="text-xl font-bold mb-4 text-center">Book Your Tickets</h1>

            {/* Adult Section */}
            <div className="mb-6 border rounded-lg p-4 bg-white shadow">
                <h2 className="text-md font-bold">
                    Adult- € {pricePerTicket}
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                    Adult: between 19 to 99 years old
                </p>

                {/* Ticket Info */}
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-red-500 font-bold mb-2">Total price</h3>
                        <p className="text-xl font-bold text-red-500">
                            € {(adultCount * pricePerTicket).toFixed(2)}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-red-500 font-bold mb-2 text-right">
                            Ticket count
                        </h3>
                        <div className="flex items-center">
                            <button
                                className="border bg-gray-100 px-2 py-1 rounded-l"
                                onClick={() =>
                                    setAdultCount(Math.max(0, adultCount - 1))
                                }
                            >
                                -
                            </button>
                            <input
                                type="text"
                                className="w-10 text-center border-y"
                                value={adultCount}
                                readOnly
                            />
                            <button
                                className="border bg-gray-100 px-2 py-1 rounded-r"
                                onClick={() => setAdultCount(adultCount + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Youth Section */}
            <div className="mb-6 border rounded-lg p-4 bg-white shadow">
                <h2 className="text-md font-bold">
                    Adult- € {pricePerTicket}
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                    Youth: between 6 to 18 years old
                </p>

                {/* Ticket Info */}
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-red-500 font-bold mb-2">Total price</h3>
                        <p className="text-xl font-bold text-red-500">
                            € {(youthCount * pricePerTicket).toFixed(2)}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-red-500 font-bold mb-2 text-right">
                            Ticket count
                        </h3>
                        <div className="flex items-center">
                            <button
                                className="border bg-gray-100 px-2 py-1 rounded-l"
                                onClick={() =>
                                    setYouthCount(Math.max(0, youthCount - 1))
                                }
                            >
                                -
                            </button>
                            <input
                                type="text"
                                className="w-10 text-center border-y"
                                value={youthCount}
                                readOnly
                            />
                            <button
                                className="border bg-gray-100 px-2 py-1 rounded-r"
                                onClick={() => setYouthCount(youthCount + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Note */}
            <p className="text-sm text-red-600 font-medium text-center mb-4">
                *Note: Children aged 0-5 years can travel free of charge and do not require a ticket.
            </p>

            {/* Policies */}
            <div className="flex justify-center space-x-4 text-blue-500 text-sm underline">
                <a href="#return-policy">Return Policy</a>
                <a href="#refund-policy">Refund Policy</a>
            </div>
        </div>
    );
};

export default ManageBookingSm;
