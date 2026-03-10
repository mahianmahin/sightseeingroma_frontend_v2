import Banner2 from "../Components/Banner2/Banner2";
import EditWrapper from "../Components/Edit_Wrapper/EditWrapper";
import EditImageWrapper from "../Components/Edit_Wrapper/EditImageWrapper";
import AboutUsImage from "../assets/new/About-Us.jpg";
import useEditorCheck from "../hooks/useEditorCheck";
import useStaticContent from "../hooks/useStaticContent";
import renderContent from "../utilities/renderContent";
import { useState, useEffect, lazy, Suspense } from "react";
import { baseUrl, baseUrlHashless } from "../utilities/Utilities";
import SEO from '../Components/SEO/SEO';
import { Link } from "react-router-dom";

const EditPanelSheet = lazy(() => import("../Components/EditPanel/EditPanelSheet"));

const AboutUs = () => {
    const [contactData, setContactData] = useState({
        phone: "+39 327 3633 993",
        email: "hello@sightseeingroma.com",
        address: "Via Antonio Fogazzaro, 5, cap–00137, Roma, Italy"
    });

    const [openFaq, setOpenFaq] = useState(null);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchContactData = async () => {
            try {
                const response = await fetch(`${baseUrl}website-settings/`);
                if (response.ok) {
                    const result = await response.json();
                    if (result.status === 200 && result.data) {
                        setContactData({
                            phone: result.data.website_phone_number || contactData.phone,
                            email: result.data.website_email || contactData.email,
                            address: result.data.website_address || contactData.address
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching contact data:", error);
            }
        };

        fetchContactData();
    }, []);

    const { isEditor, error } = useEditorCheck();
    const staticContentData = useStaticContent('about-us');
    const { getContentByTag, getImageByTag, hasContent, loading, refreshContent } = staticContentData;

    const bannerImageData = getImageByTag ? getImageByTag('about-us-banner-image') : null;
    const bannerImageUrl = bannerImageData?.image?.file ? `${baseUrlHashless}${bannerImageData.image.file}` : AboutUsImage;

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            question: "Are your tours suitable for first-time visitors to Rome?",
            answer: "Yes. Our tours are designed to give first-time visitors a clear, structured, and stress-free introduction to Rome."
        },
        {
            question: "Do your tours include skip-the-line access?",
            answer: "Yes, most of our major attractions include priority or skip-the-line entry where available."
        },
        {
            question: "Are your tours conducted in English?",
            answer: "Yes. All our tours are led by fluent English-speaking guides experienced with international travelers."
        },
        {
            question: "Do you offer private tours?",
            answer: "Yes. We offer private and small-group tours for a more personalized experience."
        },
        {
            question: "Is Sightseeing Roma a local company?",
            answer: "Yes. We are a Rome-based tour operator working directly with licensed local guides."
        }
    ];

    const trustSignals = [
        { icon: "⭐", text: "Licensed Local Guides" },
        { icon: "⏱️", text: "Skip-the-Line Access" },
        { icon: "👥", text: "Small Groups & Private Tours" },
        { icon: "🔒", text: "Secure Payments" },
        { icon: "🇮🇹", text: "Rome-Based Tour Operator" }
    ];

    const services = [
        "Skip-the-line Vatican Museums & Sistine Chapel tours",
        "Colosseum, Roman Forum & Palatine Hill guided tours",
        "Small-group and private Rome walking tours",
        "Cultural, historical & hidden-gem experiences",
        "Limited-time and seasonal Rome offers"
    ];

    const whyChooseUs = [
        {
            title: "Local Expertise, Not Generic Scripts",
            description: "Our guides are historians, art specialists, and Rome locals who adapt tours to your curiosity — not rigid scripts."
        },
        {
            title: "Skip the Lines, Respect Your Time",
            description: "We optimize routes and entry times to minimize waiting and maximize experience."
        },
        {
            title: "Small Groups = Better Experience",
            description: "Smaller groups allow questions, interaction, and flexibility — something large tours simply can't offer."
        },
        {
            title: "Transparent Pricing",
            description: "No hidden charges. No last-minute surprises. What you book is what you receive."
        },
        {
            title: "Quality Over Quantity",
            description: "We don't sell everything. We sell only what meets our standards of value and authenticity."
        }
    ];

    const targetAudience = [
        { icon: "🇺🇸", text: "USA travelers visiting Rome for the first time" },
        { icon: "🇬🇧", text: "UK travelers seeking well-structured cultural experiences" },
        { icon: "🇪🇺", text: "European visitors looking for expert-led historical tours" },
        { icon: "👨‍👩‍👧‍👦", text: "Couples, families, solo travelers & seniors" },
        { icon: "🏛️", text: "History lovers and culture-focused travelers" }
    ];

    const commitments = [
        "Licensed and knowledgeable guides",
        "Carefully planned itineraries",
        "Responsive customer support",
        "Ethical, responsible tourism practices",
        "Continuous improvement based on real traveler feedback"
    ];

    return (
        <>
            <SEO staticContentData={staticContentData} />
            <div className="bg-white">
                {isEditor && <Suspense fallback={null}><EditPanelSheet isEditor={isEditor} error={error} page="about-us" refreshContent={refreshContent} metaInfo={staticContentData?.pageData} /></Suspense>}
                
                {/* Hero Section */}
                <EditImageWrapper
                    isEditor={isEditor}
                    uniqueTag="about-us-banner-image"
                    refreshContent={refreshContent}
                >
                    <div className="relative">
                        <Banner2 bannerImgmd={bannerImageUrl} bannerImgsm={bannerImageUrl} opacity={0.6}>
                            <div className="text-center px-4 max-w-4xl mx-auto pt-8">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                                    Experience Rome the Right Way — With Local Experts Who Know the City Beyond the Crowds
                                </h1>

                                <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6">
                                    Premium guided tours, skip-the-line access, and authentic Rome experiences curated by passionate locals.
                                </p>
                            </div>
                        </Banner2>
                        
                        {/* Bottom Fade Effect */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
                        
                        {/* Trust Signals */}
                        <div className="mx-4 sm:mx-6 lg:mx-auto lg:max-w-4xl -mt-6 sm:-mt-8 relative z-10">
                            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                {trustSignals.map((signal, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2 sm:px-4 sm:py-2 shadow-sm">
                                        <span className="text-sm sm:text-base">{signal.icon}</span>
                                        <span className="text-gray-700 text-xs sm:text-sm font-medium">{signal.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </EditImageWrapper>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* About Sightseeing Roma Intro */}
                    <section className="py-10 sm:py-14 lg:py-16">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#930B31] mb-4">
                                Your Local Experts for Authentic Rome Experiences
                            </h2>
                            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                                Welcome to Sightseeing Roma, where history isn't rushed, stories aren't scripted, and every journey through Rome is designed to feel personal, immersive, and unforgettable.
                            </p>
                            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                                Rome is not just a destination — it's a living museum layered with 2,000+ years of history, culture, art, faith, and human stories. Our mission is simple: to help you experience Rome the way it deserves to be experienced — deeply, comfortably, and meaningfully.
                            </p>
                        </div>
                    </section>

                    {/* Who We Are */}
                    <section className="py-10 sm:py-14 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                                Who We Are
                            </h2>
                            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                                Sightseeing Roma is a Rome-based sightseeing and tour company created by local experts and experienced travel professionals who believe that Rome should be explored with context, comfort, and care — not rushed schedules and crowded paths.
                            </p>
                            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                                Rome is not just monuments and ruins. It is stories layered across centuries — from the Roman Empire to the Renaissance, from sacred Vatican halls to hidden neighborhood streets. Our role is to help you understand what you're seeing, not just walk past it.
                            </p>
                        </div>
                    </section>

                    {/* What We Do */}
                    <section className="py-10 sm:py-14 lg:py-16">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                                What We Do
                            </h2>
                            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6 text-center">
                                We specialize in carefully curated sightseeing experiences designed for travelers who want more than surface-level tours.
                            </p>
                            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
                                <h3 className="text-lg sm:text-xl font-semibold text-[#930B31] mb-4">Our services include:</h3>
                                <ul className="space-y-3">
                                    {services.map((service, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="text-[#FAD502] mt-1">✓</span>
                                            <span className="text-gray-700 text-base sm:text-lg">{service}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mt-6 text-center">
                                Each tour is designed to balance depth, efficiency, and enjoyment — especially for international travelers visiting Rome for a limited time.
                            </p>
                        </div>
                    </section>

                    {/* Why Choose Us */}
                    <section className="py-10 sm:py-14 bg-[#930B31] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-8 text-center">
                                Why Travelers Choose Sightseeing Roma
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {whyChooseUs.map((item, index) => (
                                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-white/20">
                                        <h3 className="text-base sm:text-lg font-bold text-[#FAD502] mb-2">{item.title}</h3>
                                        <p className="text-white/90 text-sm sm:text-base leading-relaxed">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Our Vision */}
                    <section className="py-10 sm:py-14 lg:py-16">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                                Our Vision
                            </h2>
                            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
                                Our vision is to become one of the most trusted Rome sightseeing brands for travelers from the United States, United Kingdom, and Europe who value knowledge, comfort, and authenticity.
                            </p>
                            <div className="bg-gray-50 rounded-xl p-6 sm:p-8">
                                <p className="text-gray-600 text-base sm:text-lg mb-5 font-medium">We want to replace:</p>
                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-base sm:text-lg">
                                        <span className="text-gray-400 line-through">Confusion</span>
                                        <span className="text-[#930B31] hidden sm:inline">→</span>
                                        <span className="text-[#930B31] font-semibold">with clarity</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-base sm:text-lg">
                                        <span className="text-gray-400 line-through">Crowds</span>
                                        <span className="text-[#930B31] hidden sm:inline">→</span>
                                        <span className="text-[#930B31] font-semibold">with context</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-base sm:text-lg">
                                        <span className="text-gray-400 line-through">Rushed itineraries</span>
                                        <span className="text-[#930B31] hidden sm:inline">→</span>
                                        <span className="text-[#930B31] font-semibold">with meaningful moments</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Who We Serve */}
                    <section className="py-10 sm:py-14 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                                Designed for International And Local Travelers
                            </h2>
                            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 text-center">
                                Sightseeing Roma is especially suited for:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {targetAudience.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
                                        <span className="text-2xl">{item.icon}</span>
                                        <span className="text-gray-700 text-sm sm:text-base">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mt-6 text-center">
                                Our tours are conducted in clear, fluent English, paced thoughtfully, and designed with international travel expectations in mind.
                            </p>
                        </div>
                    </section>

                    {/* Our Commitment */}
                    <section className="py-10 sm:py-14 lg:py-16">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                                Our Commitment to You
                            </h2>
                            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6 text-center">
                                When you book with Sightseeing Roma, you're trusting us with your time in one of the world's most important cities.
                            </p>
                            <div className="bg-white border-2 border-[#930B31] rounded-xl p-6 sm:p-8">
                                <p className="text-[#930B31] font-semibold text-lg mb-4">We promise:</p>
                                <ul className="space-y-3">
                                    {commitments.map((commitment, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="text-[#930B31] mt-1">✓</span>
                                            <span className="text-gray-700 text-base sm:text-lg">{commitment}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-10 sm:py-14 bg-gradient-to-br from-[#930B31] to-[#7a0928] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">
                                Explore Rome With Confidence
                            </h2>
                            <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6">
                                Rome can feel overwhelming. We make it simple, enriching, and unforgettable. Explore our tours, discover limited-time offers, and experience the Eternal City the way it deserves to be experienced.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link 
                                    to="/" 
                                    className="inline-block bg-[#FAD502] text-[#930B31] font-bold py-3 px-8 rounded-full hover:bg-white transition-colors duration-300 text-base sm:text-lg shadow-lg"
                                >
                                    View Our Tours →
                                </Link>
                                <Link 
                                    to="/featured-offers"
                                    className="inline-block bg-white/10 border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-[#930B31] transition-colors duration-300 text-base sm:text-lg"
                                >
                                    See Today's Featured Experiences →
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="py-10 sm:py-14 lg:py-16">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-3">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleFaq(index)}
                                            className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="text-gray-800 font-medium text-sm sm:text-base pr-4">{faq.question}</span>
                                            <span className={`text-[#930B31] text-xl transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                                                ▼
                                            </span>
                                        </button>
                                        {openFaq === index && (
                                            <div className="px-4 sm:px-5 pb-4 sm:pb-5 bg-gray-50">
                                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{faq.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </>
    );
};

export default AboutUs;
