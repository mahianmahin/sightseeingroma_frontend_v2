import React, { useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";
import Description from "../Description/Description";
import Similar from "../../Page/Similar";

const ManageBookingSm = () => {
    const [adultCount, setAdultCount] = useState(3);
    const [youthCount, setYouthCount] = useState(3);
    const pricePerTicket = 28;
    const youthTickets = 24;

    const totalAdultPrice = (adultCount * pricePerTicket).toFixed(2);
    const totalYouthPrice = (youthCount * youthTickets).toFixed(2);
    const totalPrice = (parseFloat(totalAdultPrice) + parseFloat(totalYouthPrice)).toFixed(2);

    return (
        <div className="p-4 bg-gray-50 min-h-screen pt-32">

            <div className="py-16">
                <div className="block md:hidden">
                    <div className=" flex items-center  gap-5 ">
                        <FaArrowLeftLong size={20}></FaArrowLeftLong>
                        <p className="font-bold text-lg">Checkout</p>
                    </div>
                </div>
                <div className="flex items-center gap-6 py-6">

                    <p>Hop-On Hop-Off Tour</p>
                    <div className="flex  items-center gap-2">
                        <FaRegClock></FaRegClock>
                        <p className="font-bold">    24 Hour</p>
                    </div>
                </div>
                <h2 className="text-xl md:text-3xl font-bold mb-2">Hop-On Hop-Off Panoramic Rome Bus Tour</h2>

                <div className="flex  items-center gap-0 md:gap-3 color-1 font-semibold ">
                    <p>Select ticket</p>
                    <p><MdKeyboardArrowRight size={20}></MdKeyboardArrowRight></p>
                    <p>Payment</p>
                    <p><MdKeyboardArrowRight size={20}></MdKeyboardArrowRight></p>
                    <p>Confirm ticket</p>
                </div>
            </div>
            <div>
                <div className="border p-4 rounded-lg ">
                    <h1 className="text-xl font-bold py-4">Book Your Tickets</h1>

                    {/* Adult Section */}
                    <div className="mb-6 border rounded-lg p-4 bg-white shadow">
                        <h2 className="text-md font-bold">Adult- € {pricePerTicket}</h2>
                        <p className="text-gray-500 text-sm mb-4">Adult: between 19 to 99 years old</p>
                        <div>
                            <div className="flex items-center justify-between">
                                <h3 className="color-1 font-bold mb-2">Total price</h3>
                                <h3 className="color-1 font-bold mb-2 text-right">Ticket count</h3>
                            </div>
                            <div className="flex items-center justify-between border gap-3 p-2 rounded-lg">
                                <p className="text-xl font-bold color-1 py-4">€ {totalAdultPrice}</p>
                                <div className="flex items-center gap-3 p-2 rounded-lg bg-[#F2F2F7]">
                                    <button
                                        className="border bg-[#FEF7FF] rounded-md px-3 py-1"
                                        onClick={() => setAdultCount(Math.max(0, adultCount - 1))}
                                    >
                                        −
                                    </button>
                                    <span className="text-lg bg-white px-4 rounded-md">{adultCount}</span>
                                    <button
                                        className="border bg-[#FEF7FF] rounded-md px-3 py-1"
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
                        <h2 className="text-md font-bold">Youth- € {youthTickets}</h2>
                        <p className="text-gray-500 text-sm mb-4">Youth: between 6 to 18 years old</p>
                        <div>
                            <div className="flex items-center justify-between">
                                <h3 className="color-1 font-bold mb-2">Total price</h3>
                                <h3 className="color-1 font-bold mb-2 text-right">Ticket count</h3>
                            </div>
                            <div className="flex items-center justify-between border gap-3 p-2 rounded-lg">
                                <p className="text-xl font-bold color-1 py-4">€ {totalYouthPrice}</p>
                                <div className="flex items-center gap-3 p-2 rounded-lg bg-[#F2F2F7]">
                                    <button
                                        className="border bg-[#FEF7FF] rounded-md px-3 py-1"
                                        onClick={() => setYouthCount(Math.max(0, youthCount - 1))}
                                    >
                                        −
                                    </button>
                                    <span className="text-lg bg-white px-4 rounded-md">{youthCount}</span>
                                    <button
                                        className="border bg-[#FEF7FF] rounded-md px-3 py-1"
                                        onClick={() => setYouthCount(youthCount + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Note */}
                    <p className="text-sm color-1 font-medium mb-4">
                        *Note: Children aged 0-5 years can travel free of charge and do not require a ticket.
                    </p>

                    {/* Policies */}
                    <div className="flex space-x-4 text-blue-500 text-sm">
                        <Link to={"/returnPolicy"} className="text-blue-600 hover:underline">
                            Return Policy
                        </Link>
                        <Link to={"/refund"} className="text-blue-600 hover:underline">
                            Refund Policy
                        </Link>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="w-full md:w-1/3 mt-8">
                    <div className="bg-gray-50 border-2 border-gray-200 p-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">Summary</h3>
                        <div className="mb-2">
                            <p className="flex justify-between items-center space-y-3">
                                <span>Total ticket price (adult):</span>
                                <span className="font-bold">€ {totalAdultPrice}</span>
                            </p>
                            <p className="flex justify-between items-center space-y-3">
                                <span>Total ticket price (youth):</span>
                                <span className="font-bold">€ {totalYouthPrice}</span>
                            </p>
                        </div>
                        <hr />
                        <div className="flex justify-between space-y-3 font-bold mb-10 items-center my-4">
                            <span>Total price:</span>
                            <span>€ {totalPrice}</span>
                        </div>
                        <button className="w-full bg-2 text-white py-2 rounded-full hover:bg-red-800">
                            Buy Tickets
                        </button>
                    </div>
                </div>
            </div>


            <Description></Description>
            <Similar></Similar>



        </div>
    );
};

export default ManageBookingSm;
