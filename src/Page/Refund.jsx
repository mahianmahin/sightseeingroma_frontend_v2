import Banner2 from './../Components/Banner2/Banner2';
import RefundImage from "../assets/new/Refund-Policy.jpg";

const Refund = () => {
    return (
        <div className="container mx-auto ">
            {/* Banner Section */}
            <Banner2
                bannerImgmd={RefundImage}
                bannerImgsm={RefundImage}
                title={'Refund Policy'}
                description={'Refund Policy and Ticket Cancellations'}
            />
            
            {/* Content Section */}
            <div className="my-8 space-y-6 px-5 md:px-8 md:pr-40 py-3 md:py-5">
                <div>
                    <h1 className="text-2xl font-bold">Welcome to SightSeeing Roma!</h1>
                    <p className="mt-4 ">
                        At SightSeeing Roma, we are committed to ensuring your satisfaction with every aspect of your experience. If for any reason you need to return or request a refund for your purchased ticket, we’ve outlined our policy below to guide you through the process.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-bold ">Refund</h2>
                    <p className="mt-2 ">
                    We aim to provide a hassle-free refund process for our customers. Below are the conditions under which refunds may be issued:
                    </p>
                    <ul className="list-disc ml-6 mt-4 space-y-2 ">
                        <li>
                            <span className="font-medium">Service Disruptions: </span>In the event of service disruptions or cancellations initiated by SightSeeing Roma, we will provide a full refund for affected tickets.
                        </li>
                        <li>
                            <span className="font-medium">Quality Concerns:</span> If you encounter any issues with the quality or standard of our services, please reach out to us immediately. We will investigate the matter thoroughly and offer an appropriate resolution, which may include a refund.
                           
                        </li>
                        <li>
                            <span className="font-medium">Cancellation by Customer:</span> Customers can request refunds for their purchased tickets due to unforeseen circumstances or changes in plans. Refunds will be subject to the terms outlined in our Returns section above.
                        </li>
                        <li>
                            <span className="font-medium">Unauthorised Transactions:</span> If you suspect unauthorised use of your payment method or any fraudulent activity related to your purchase, please notify us promptly. We will investigate the matter and take necessary actions, including issuing refunds if applicable.
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
                            <a href="tel:+393273633993" className=" ml-1">
                                +39 327 3633 993
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

export default Refund;
