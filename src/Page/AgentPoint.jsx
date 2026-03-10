import { useState, useRef, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaMapMarkerAlt,
  FaDirections,
  FaStar,
  FaCheckCircle,
  FaShieldAlt,
  FaUsers,
  FaTicketAlt,
  FaBus,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
} from "react-icons/fa";
import useEditorCheck from "../hooks/useEditorCheck";
import useStaticContent from "../hooks/useStaticContent";
import EditWrapper from "../Components/Edit_Wrapper/EditWrapper";
import EditImageWrapper from "../Components/Edit_Wrapper/EditImageWrapper";
import renderContent from "../utilities/renderContent.jsx";

const EditPanelSheet = lazy(() => import("../Components/EditPanel/EditPanelSheet"));
import { baseUrlHashless } from "../utilities/Utilities";
import SEO from "../Components/SEO/SEO";
import AgentPointHeroImage from "../assets/new/Agent-Point-Hero-Section.webp";

/* ──────────────────────────────────────────────
   Agent Point Data
   ────────────────────────────────────────────── */
const AGENT_POINTS = [
  {
    id: 1,
    title: "Main Agent Point – Piazza d'Aracoeli",
    address: "Piazza d'Aracoeli, 8, Rome",
    type: "main-office",
    description:
      "Located in the heart of Rome, our main agent point at Piazza d'Aracoeli offers full-service assistance for sightseeing tours, ticket bookings, and tourist guidance. Just steps away from iconic attractions like Capitoline Hill, this central hub is perfect for travelers looking to start their Rome adventure smoothly. Our expert staff helps you choose the best hop-on hop-off bus tours, skip-the-line tickets, and guided experiences.",
    highlights: [
      "Central Rome location",
      "Full customer support",
      "Tour recommendations",
    ],
    coordinates: { lat: 41.8938, lng: 12.4803 },
    imageAlt:
      "Sightseeing Roma main agent point near Piazza d'Aracoeli in Rome",
    googleMapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=41.8938,12.4803",
  },
  {
    id: 2,
    title: "Largo Arenula Ticket Point",
    address: "Largo Arenula, 12, Rome",
    type: "ticket-pickup",
    description:
      "Conveniently located near the historic center, our Largo Arenula agent point is ideal for quick ticket pickup and travel assistance. This location serves tourists exploring Rome's most famous landmarks, offering easy access to sightseeing buses and city tours. Whether you need last-minute tickets or directions, our team ensures a hassle-free experience.",
    highlights: [
      "Quick ticket pickup",
      "Close to major attractions",
      "Friendly assistance",
    ],
    coordinates: { lat: 41.8945, lng: 12.4746 },
    imageAlt:
      "Sightseeing Roma ticket pickup point at Largo Arenula in Rome",
    googleMapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=41.8945,12.4746",
  },
  {
    id: 3,
    title: "Torre Argentina Area Point",
    address: "Largo di Torre Argentina 13, Rome",
    type: "ticket-pickup",
    description:
      "Situated near the famous Torre Argentina ruins, this agent point is perfect for travelers interested in combining history with convenience. Easily access sightseeing tours, hop-on hop-off buses, and expert recommendations from our team. This location is especially popular for visitors exploring Rome's ancient landmarks.",
    highlights: [
      "Historic surroundings",
      "Easy transport access",
      "Ideal for first-time visitors",
    ],
    coordinates: { lat: 41.8955, lng: 12.4762 },
    imageAlt:
      "Sightseeing Roma agent point near Torre Argentina ruins in Rome",
    googleMapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=41.8955,12.4762",
  },
  {
    id: 4,
    title: "Lungotevere de' Cenci Point",
    address: "Lungotevere de' Cenci, 3, Rome",
    type: "ticket-pickup",
    description:
      "Our Lungotevere de' Cenci agent point provides a scenic and convenient stop along the Tiber River. Perfect for travelers walking through Rome's picturesque routes, this location offers quick access to tickets, sightseeing passes, and helpful travel support.",
    highlights: [
      "Riverside location",
      "Quick service",
      "Easy walking access",
    ],
    coordinates: { lat: 41.8911, lng: 12.4748 },
    imageAlt:
      "Sightseeing Roma agent point along Lungotevere de' Cenci by Tiber River in Rome",
    googleMapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=41.8911,12.4748",
  },
  {
    id: 5,
    title: "Secondary Arenula Support Point",
    address: "Largo Arenula, 12 (Edicola), Rome",
    type: "main-office",
    description:
      "This secondary support point at Largo Arenula (Edicola) is designed for fast and efficient tourist assistance. Ideal for travelers on tight schedules, it provides quick ticket validation and basic guidance to help you continue your Rome journey without delays.",
    highlights: [
      "Fast support",
      "Ticket validation",
      "Convenient stop",
    ],
    coordinates: { lat: 41.8944, lng: 12.4748 },
    imageAlt:
      "Sightseeing Roma secondary support point at Largo Arenula Edicola in Rome",
    googleMapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=41.8944,12.4748",
  },
];

const FILTER_OPTIONS = [
  { value: "all", label: "All Locations" },
  { value: "main-office", label: "Main Office" },
  { value: "ticket-pickup", label: "Ticket Pickup" },
];

/* ──────────────────────────────────────────────
   LocalBusiness Schema for each location
   ────────────────────────────────────────────── */
const buildSchemaMarkup = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TouristInformationCenter",
      name: "Sightseeing Roma",
      description:
        "Official ticket and assistance points in Rome for hop-on hop-off bus tours, skip-the-line tickets, and sightseeing experiences.",
      url: "https://sightseeingroma.com/agentpoints",
    },
    ...AGENT_POINTS.map((ap) => ({
      "@type": "LocalBusiness",
      name: ap.title,
      address: {
        "@type": "PostalAddress",
        streetAddress: ap.address.replace(", Rome", ""),
        addressLocality: "Rome",
        addressRegion: "Lazio",
        addressCountry: "IT",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: ap.coordinates.lat,
        longitude: ap.coordinates.lng,
      },
      description: ap.description,
      parentOrganization: {
        "@type": "Organization",
        name: "Sightseeing Roma",
        url: "https://sightseeingroma.com",
      },
    })),
  ],
});

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */
const AgentPoint = () => {
  const { isEditor, error } = useEditorCheck();
  const staticContentData = useStaticContent("agent-point");
  const {
    getContentByTag,
    getImageByTag,
    hasContent,
    refreshContent,
  } = staticContentData;

  const [activeFilter, setActiveFilter] = useState("all");
  const [activePointId, setActivePointId] = useState(null);
  const [mapOpen, setMapOpen] = useState(true);
  const mapRef = useRef(null);
  const cardRefs = useRef({});

  // Get banner image from CMS or fallback
  const bannerImageData = getImageByTag
    ? getImageByTag("agent-point-banner-image")
    : null;
  const bannerImageUrl = bannerImageData?.image?.file
    ? `${baseUrlHashless}${bannerImageData.image.file}`
    : AgentPointHeroImage;

  const filteredPoints =
    activeFilter === "all"
      ? AGENT_POINTS
      : AGENT_POINTS.filter((p) => p.type === activeFilter);

  const handlePointClick = (pointId) => {
    setActivePointId(pointId);
    // Scroll map into view on mobile
    if (window.innerWidth < 768 && mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToCard = (pointId) => {
    const el = cardRefs.current[pointId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setActivePointId(pointId);
    }
  };

  const scrollToMap = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToLocations = () => {
    const el = document.getElementById("agent-locations");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <SEO
        staticContentData={staticContentData}
        defaultTitle="Sightseeing Roma Agent Points – Official Ticket & Assistance Locations in Rome"
        defaultDescription="Find your nearest Sightseeing Roma agent point in Rome for hop-on hop-off bus tickets, tour support, and sightseeing guidance. 5 convenient locations."
      />
      {isEditor && <Suspense fallback={null}><EditPanelSheet
        isEditor={isEditor}
        error={error}
        page="agent-point"
        refreshContent={refreshContent}
        metaInfo={staticContentData?.pageData}
      /></Suspense>}

      {/* Schema Markup */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(buildSchemaMarkup())}
        </script>
      </Helmet>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden">
        {/* Background */}
        <EditImageWrapper
          isEditor={isEditor}
          uniqueTag="agent-point-banner-image"
          refreshContent={refreshContent}
          className="absolute inset-0"
        >
          <div className="absolute inset-0">
            <img
              src={bannerImageUrl}
              alt="Sightseeing Roma agent points in Rome city center"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/70 to-black/40" />
          </div>
        </EditImageWrapper>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            {/* Breadcrumb-style label */}
            <div className="flex items-center gap-2 text-[#FAD502] text-sm font-semibold mb-4 uppercase tracking-wider">
              <FaMapMarkerAlt />
              <span>Official Locations</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
              <EditWrapper
                isEditor={isEditor}
                contentTag="agent-point-title"
                refreshContent={refreshContent}
              >
                {renderContent(
                  "agent-point-title",
                  hasContent,
                  getContentByTag,
                  "Official Ticket & Assistance Points in Rome"
                )}
              </EditWrapper>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl font-medium drop-shadow-md">
              <EditWrapper
                isEditor={isEditor}
                contentTag="agent-point-subtitle"
                refreshContent={refreshContent}
              >
                {renderContent(
                  "agent-point-subtitle",
                  hasContent,
                  getContentByTag,
                  "Find your nearest Sightseeing Roma agent point for tickets, support, and tour guidance."
                )}
              </EditWrapper>
            </p>

            {/* Trust badge */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-200">
              <div className="flex items-center gap-2">
                <div className="flex text-[#FAD502]">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="opacity-70" />
                </div>
                <span>Trusted by 10,000+ travelers</span>
              </div>
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-[#FAD502]" />
                <span>Verified Operators</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToMap}
                className="bg-[#930B31] hover:bg-[#7a0926] text-white font-bold py-3.5 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg text-base md:text-lg flex items-center justify-center gap-2"
              >
                <FaMapMarkerAlt />
                Find Nearest Agent
              </button>
              <button
                onClick={scrollToLocations}
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white font-bold py-3.5 px-8 rounded-lg transition-all text-base md:text-lg flex items-center justify-center gap-2"
              >
                <FaInfoCircle />
                View All Locations
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaUsers className="text-[#930B31] text-lg" />
              <span className="font-medium">10,000+ Happy Travelers</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-[#930B31] text-lg" />
              <span className="font-medium">Official Partner</span>
            </div>
            <div className="flex items-center gap-2">
              <FaTicketAlt className="text-[#930B31] text-lg" />
              <span className="font-medium">Instant Tickets</span>
            </div>
            <div className="flex items-center gap-2.5">
              <FaCcVisa className="text-gray-500 text-xl" />
              <FaCcMastercard className="text-gray-500 text-xl" />
              <FaCcAmex className="text-gray-500 text-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTERACTIVE MAP SECTION ─── */}
      <section ref={mapRef} className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Find Us on the Map
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              All our agent points are located in Rome&apos;s historic center, within walking distance of major attractions.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setActiveFilter(opt.value)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeFilter === opt.value
                    ? "bg-[#930B31] text-white shadow-lg shadow-[#930B31]/25"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {opt.label}
                <span className="ml-1.5 text-xs opacity-75">
                  ({opt.value === "all"
                    ? AGENT_POINTS.length
                    : AGENT_POINTS.filter((p) => p.type === opt.value).length})
                </span>
              </button>
            ))}
          </div>

          {/* Map – collapsible on mobile */}
          <div className="md:hidden flex items-center justify-between mb-3 px-1">
            <span className="text-sm font-medium text-gray-700">Interactive Map</span>
            <button
              onClick={() => setMapOpen(!mapOpen)}
              className="text-sm text-[#930B31] font-semibold flex items-center gap-1"
            >
              {mapOpen ? "Collapse" : "Expand"}
              {mapOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>

          <div
            className={`w-full overflow-hidden rounded-2xl transition-all duration-300 relative ${
              mapOpen ? "h-[480px]" : "h-0"
            } md:h-[480px]`}
          >
            {/* Outer clip hides the Google title bar; iframe is shifted up */}
            <iframe
              src="https://www.google.com/maps/d/u/0/embed?mid=1P0UrlCLUfEB_xT4TmrzdMK0aYOvBSaI&ehbc=2E312F&noprof=1"
              width="100%"
              className="w-full absolute left-0"
              style={{
                border: 0,
                top: "-62px",
                height: "calc(100% + 62px)",
              }}
              title="Sightseeing Roma agent points map"
              loading="lazy"
              allowFullScreen
            />
            {/* Bottom fade to blend map into the page */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none z-10" />
          </div>

          {/* Quick location pills below map */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {filteredPoints.map((point) => (
              <button
                key={point.id}
                onClick={() => scrollToCard(point.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${
                  activePointId === point.id
                    ? "bg-[#930B31] text-white border-[#930B31]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#930B31] hover:text-[#930B31]"
                }`}
              >
                <FaMapMarkerAlt className="inline mr-1" />
                {point.title.split(" – ")[1] || point.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FIRST CTA BANNER ─── */}
      <section className="bg-gradient-to-r from-[#930B31] to-[#7a0926] py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold mb-1">
              Ready to Explore Rome?
            </h3>
            <p className="text-white/80 text-sm md:text-base">
              Book your hop-on hop-off bus tour or sightseeing tickets today.
            </p>
          </div>
          <Link
            to="/company-packages/big-bus"
            className="bg-[#FAD502] text-[#930B31] font-bold py-3 px-8 rounded-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg text-base whitespace-nowrap"
          >
            Book Your Tour Now
          </Link>
        </div>
      </section>

      {/* ─── AGENT POINT LIST (SEO OPTIMIZED) ─── */}
      <section id="agent-locations" className="bg-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              <EditWrapper
                isEditor={isEditor}
                contentTag="agent-point-locations-title"
                refreshContent={refreshContent}
              >
                {renderContent(
                  "agent-point-locations-title",
                  hasContent,
                  getContentByTag,
                  "Our Agent Locations in Rome"
                )}
              </EditWrapper>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visit any of our {AGENT_POINTS.length} agent points across Rome for
              tickets, assistance, and expert tour guidance.
            </p>
          </div>

          {/* Agent Point Cards */}
          <div className="space-y-8 max-w-5xl mx-auto">
            {filteredPoints.map((point, index) => (
              <article
                key={point.id}
                ref={(el) => (cardRefs.current[point.id] = el)}
                className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 cursor-pointer ${
                  activePointId === point.id
                    ? "border-[#930B31] ring-2 ring-[#930B31]/20"
                    : "border-transparent"
                }`}
                onClick={() => handlePointClick(point.id)}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left: Image placeholder */}
                  <div className="w-full md:w-2/5 relative overflow-hidden group">
                    <div className="h-56 md:h-full min-h-[250px] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      {/* Placeholder — replace with real photos when available */}
                      <div className="text-center text-gray-500 p-6">
                        <FaMapMarkerAlt className="text-5xl mx-auto mb-3 text-[#930B31]/40 group-hover:text-[#930B31]/70 transition-colors" />
                        <p className="text-sm font-medium">{point.imageAlt}</p>
                        <p className="text-xs mt-1 text-gray-400">Photo coming soon</p>
                      </div>
                    </div>
                    {/* Type badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${
                          point.type === "main-office"
                            ? "bg-[#930B31] text-white"
                            : "bg-[#FAD502] text-[#930B31]"
                        }`}
                      >
                        {point.type === "main-office" ? "Main Office" : "Ticket Point"}
                      </span>
                    </div>
                    {/* Location number */}
                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-[#930B31] font-bold text-lg">
                        {index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                        {point.title}
                      </h3>

                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                        <FaMapMarkerAlt className="text-[#930B31] flex-shrink-0" />
                        <address className="not-italic">{point.address}</address>
                      </div>

                      {/* SEO description paragraph */}
                      <p className="text-gray-600 leading-relaxed mb-5 text-sm md:text-base">
                        {point.description}
                      </p>

                      {/* Highlights */}
                      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
                        {point.highlights.map((h, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-sm text-gray-700"
                          >
                            <FaCheckCircle className="text-green-500 flex-shrink-0 text-xs" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={point.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-[#930B31] hover:bg-[#7a0926] text-white font-semibold py-2.5 px-6 rounded-lg transition-all hover:shadow-lg text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaDirections />
                        Get Directions
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePointClick(point.id);
                        }}
                        className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-[#930B31] text-gray-700 hover:text-[#930B31] font-semibold py-2.5 px-6 rounded-lg transition-all text-sm"
                      >
                        <FaMapMarkerAlt />
                        Show on Map
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECOND CTA BANNER ─── */}
      <section className="bg-gradient-to-r from-[#930B31] to-[#7a0926] py-10">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Can&apos;t Visit in Person?
          </h3>
          <p className="text-white/80 max-w-xl mx-auto mb-6">
            Book your Rome sightseeing tickets online and skip the queue. Instant
            digital tickets delivered to your email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-[#FAD502] text-[#930B31] font-bold py-3.5 px-8 rounded-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg text-base"
            >
              Browse All Tours
            </Link>
            <Link
              to="/company-packages/big-bus"
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white font-bold py-3.5 px-8 rounded-lg transition-all text-base"
            >
              Hop-on Hop-off Rome
            </Link>
          </div>
        </div>
      </section>

      {/* ─── ADDITIONAL CMS CONTENT ─── */}
      {hasContent && hasContent("agent-point-body") && (
        <section className="bg-white py-10 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <EditWrapper
                isEditor={isEditor}
                contentTag="agent-point-body"
                refreshContent={refreshContent}
              >
                {renderContent(
                  "agent-point-body",
                  hasContent,
                  getContentByTag
                )}
              </EditWrapper>
            </div>
          </div>
        </section>
      )}

      {/* ─── INTERNAL LINKS (SEO) ─── */}
      <section className="bg-gray-50 border-t border-gray-200 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Explore More Sightseeing Roma Services
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link
                to="/"
                className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group"
              >
                <div className="bg-[#930B31]/10 p-2.5 rounded-lg group-hover:bg-[#930B31] transition-colors">
                  <FaBus className="text-[#930B31] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <span className="font-semibold text-gray-800 text-sm">
                    Sightseeing Tours in Rome
                  </span>
                  <p className="text-xs text-gray-500">Explore all options</p>
                </div>
              </Link>
              <Link
                to="/company-packages/big-bus"
                className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group"
              >
                <div className="bg-[#930B31]/10 p-2.5 rounded-lg group-hover:bg-[#930B31] transition-colors">
                  <FaTicketAlt className="text-[#930B31] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <span className="font-semibold text-gray-800 text-sm">
                    Hop-on Hop-off Bus Rome
                  </span>
                  <p className="text-xs text-gray-500">Big Bus Tours</p>
                </div>
              </Link>
              <Link
                to="/featured-offers"
                className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group"
              >
                <div className="bg-[#930B31]/10 p-2.5 rounded-lg group-hover:bg-[#930B31] transition-colors">
                  <FaStar className="text-[#930B31] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <span className="font-semibold text-gray-800 text-sm">
                    Featured Offers
                  </span>
                  <p className="text-xs text-gray-500">Today&apos;s deals</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MOBILE STICKY CTA ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-3">
        <div className="flex gap-2">
          <button
            onClick={scrollToMap}
            className="flex-1 bg-[#930B31] text-white font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2"
          >
            <FaMapMarkerAlt />
            Find Agent
          </button>
          <Link
            to="/company-packages/big-bus"
            className="flex-1 bg-[#FAD502] text-[#930B31] font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2"
          >
            <FaTicketAlt />
            Book Tour
          </Link>
        </div>
      </div>

      {/* Bottom padding for mobile sticky CTA */}
      <div className="h-16 md:hidden" />
    </>
  );
};

export default AgentPoint;
