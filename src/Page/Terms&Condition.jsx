import Banner2 from './../Components/Banner2/Banner2';
import TermsConditionImage from "../assets/new/Terms-&-Conditions.jpg";

const TermsCondition = () => {
    return (
        <div className="container mx-auto">
            {/* Banner Section */}
            <Banner2
                bannerImgmd={TermsConditionImage}
                bannerImgsm={TermsConditionImage}
                title={'Terms & Conditions'}
                description={'Important Information & Terms of Use'}
            />

            {/* Terms & Conditions Content */}
            <div className="px-5 md:px-8 md:pr-48 py-12">
                <h1 className="text-2xl font-bold mb-6">Welcome to SightSeeing Roma!</h1>
                <p className="mb-8">
                    By accessing our website and utilising our services, you agree to comply with and be bound by the following terms and conditions.
                    Please read these terms carefully before accessing or using our website.
                </p>

                {/* Section 1: Agreement to Terms */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4">1. Agreement to Terms</h2>
                    <p>
                        By accessing or using our website, you agree to be bound by these Terms & Conditions and all applicable laws and regulations.
                        If you disagree with any part of these terms, you may not access the website or use our services.
                    </p>
                </div>

                {/* Section 2: Booking Policies */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4">2. Booking Policies</h2>
                    <ul className="list-disc list-inside">
                        <li>All bookings made through our website or outlets are subject to availability.</li>
                        <li>Booking confirmation will be sent via email upon successful completion of the booking process.</li>
                        <li>It is the responsibility of the customer to provide accurate information during the booking process.</li>
                        <li>Customers are advised to review their booking details carefully before making the payment.</li>
                        <li>Changes or cancellations to bookings may be subject to fees, please refer to our Cancellation Policy for details.</li>
                    </ul>
                </div>

                {/* Section 3: Payment */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4">3. Payment</h2>
                    <ul className="list-disc list-inside">
                        <li>Payment for bookings can be made securely through our website using major credit cards or other payment methods specified.</li>
                        <li>Prices are displayed in the currency applicable to the region and are inclusive of any applicable taxes unless otherwise stated.</li>
                        <li>SightSeeing Roma is not responsible for any changes to tour itineraries, including closures of attractions, due to unforeseen circumstances such as weather conditions or maintenance.</li>
                    </ul>
                </div>

                {/* Section 4: Ticket Usage */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4">4. Ticket Usage</h2>
                    <ul className="list-disc list-inside">
                        <li>Tickets purchased through SightSeeing Roma are non-transferable and non-refundable, unless otherwise stated.</li>
                        <li>Tickets must be presented upon request for boarding the bus or accessing attractions included in the package.</li>
                        <li>Lost or stolen tickets will not be replaced.</li>
                    </ul>
                </div>

                {/* Section 5: Tour Packages */}
                <div className='mb-6'>
                    <h2 className="text-xl font-bold mb-4">5. Tour Packages</h2>
                    <ul className="list-disc list-inside">
                        <li>Our tour packages, including Catacombs Tour Package and Panoramic Rome Bus Tour, are subject to availability and operational schedules.</li>
                        <li>The duration of each package (24 hours, 48 hours, or 72 hours) begins upon the activation of the first ticket.</li>
                        <li>SightSeeing Roma is not responsible for any changes to tour itineraries, including closures of attractions, due to unforeseen circumstances.</li>
                    </ul>
                </div>


                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4">6. Liability</h2>
                    <p>
                        Join us at SightSeeing Roma and embark on an unforgettable journey through the heart of Rome. Let our comfortable buses, knowledgeable guides, and unparalleled service elevate your travel experience to new heights. Book your tickets today and get ready to create memories that will last a lifetime.
                    </p>
                </div>
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4">7. Contact Information</h2>
                    <p>
                        <p className='mb-3'>For inquiries, assistance, or feedback regarding our services, please contact us at:</p>

                        Email: hello@sightseeingroma.com <br />
                        Phone: +39 327 3633 993 <br />
                        Address: Via Antonio Fogazzaro,5, cap-00137, Roma, Italy
                    </p>
                </div>


                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4">8. Changes to Terms & Conditions</h2>
                    <p>
                        <p className='mb-3'>SightSeeing Roma reserves the right to update or modify these Terms & Conditions at any time without prior notice. It is the responsibility of the customer to review these terms periodically for changes.</p>

                        By continuing to access our website or utilise our services after any modifications to these terms, you agree to be bound by the revised terms. If you do not agree to the new terms, please refrain from using our website and services.
                    </p>
                </div>


                <p className='font-bold'>Thank you for choosing SightSeeing Roma – where every moment is a masterpiece of discovery.</p>




            </div>
        </div>
    );
};

export default TermsCondition;
