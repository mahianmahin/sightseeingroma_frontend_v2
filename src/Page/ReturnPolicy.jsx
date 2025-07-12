import Banner2 from './../Components/Banner2/Banner2';
import ReturnImage from "../assets/new/Return-Policy.jpg";

const ReturnPolicy = () => {
    return (
        <div className="container mx-auto ">
            {/* Banner Section */}
            <Banner2
                bannerImgmd={ReturnImage}
                bannerImgsm={ReturnImage}
                title={'Return Policy'}
                description={'Our return policy'}
            />
            
            {/* Content Section */}
            <div className="my-8 space-y-6 py-3 md:py-5 px-5 md:px-8 md:pr-40">
                <div>
                    <h1 className="text-2xl font-bold">Welcome to SightSeeing Roma!</h1>
                    <p className="mt-4 ">
                        At SightSeeing Roma, we are committed to ensuring your satisfaction with every aspect of your experience. If for any reason you need to return or request a refund for your purchased ticket, we’ve outlined our policy below to guide you through the process.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-bold ">Returns</h2>
                    <p className="mt-2 ">
                        We understand that plans can change unexpectedly. If you wish to return your ticket, please adhere to the following guidelines:
                    </p>
                    <ul className="list-disc ml-6 mt-4 space-y-2 ">
                        <li>
                            <span className="font-medium">Unused Tickets:</span> Tickets that have not been utilized can be returned within 30 days of the purchase date for a full refund.
                        </li>
                        <li>
                            <span className="font-medium">Notification:</span> Kindly inform us of your intention to return your ticket by contacting our customer support team via email at 
                            <a href="mailto:hello@sightseeingroma.com" className=" ml-1">
                                hello@sightseeingroma.com
                            </a> or by phone at 
                            <a href="tel:+393286076514" className="ml-1">
                                +393286076514
                            </a>. Please provide your order details for faster processing.
                        </li>
                        <li>
                            <span className="font-medium">Ticket Validity:</span> Ensure that your ticket is still within its validity period, as expired tickets are not eligible for return.
                        </li>
                        <li>
                            <span className="font-medium">Refund Process:</span> Once your return request is received and approved, we will initiate the refund process. Refunds are typically processed within 5-7 business days through the original payment method.
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-bold ">Contact Us</h2>
                    <p className="mt-2 ">
                        If you have any questions or concerns regarding our Return & Refund Policy, please don’t hesitate to reach out to us. Our dedicated customer support team is available to assist you and ensure your satisfaction.
                    </p>
                    <ul className="mt-4 space-y-2 ">
                        <li>
                            <span className="font-medium">Email:</span> 
                            <a href="mailto:hello@sightseeingroma.com" className=" ml-1">
                                hello@sightseeingroma.com
                            </a>
                        </li>
                        <li>
                            <span className="font-medium">Phone:</span> 
                            <a href="tel:+393286076514" className=" ml-1">
                                +393286076514
                            </a>
                        </li>
                        <li>
                            <span className="font-medium">Address:</span> Via Antonio Fogazzaro, 5, cap–00137, Roma, Italy
                        </li>
                    </ul>
                </div>

                <div>
                    <p className="font-bold">
                        Thank you for choosing SightSeeing Roma – where every moment is a masterpiece of discovery.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReturnPolicy;
