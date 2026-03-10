import React, { lazy, Suspense } from 'react';
import Hero from '../Components/Hero/Hero';
import SectionNav from '../Components/SectionNav/SectionNav';
import useEditorCheck from '../hooks/useEditorCheck';
import useStaticContent from '../hooks/useStaticContent';
import SEO from '../Components/SEO/SEO';
import LazySection from '../Components/LazySection';

// Direct imports — tiny, no API calls, render above-fold / immediately.
// Bundled into the Home chunk to avoid Suspense cascade round-trips.
import WhyBook from '../Components/WhyBook/WhyBook';
import FinalCTA from '../Components/FinalCTA/FinalCTA';
import Work from '../Components/How-Its-Work/Work';

// Below-fold components — lazy-loaded + deferred by LazySection (IntersectionObserver).
// Their chunks are only downloaded when the user scrolls near them.
const Services = lazy(() => import('../Components/Services/Services'));
const FeaturedToday = lazy(() => import('../Components/FeaturedToday/FeaturedToday'));
const CustomerReviews = lazy(() => import('../Components/CustomerReviews/CustomerReviews'));
const PromoBanner = lazy(() => import('../Components/PromoBanner/PromoBanner'));
const RecommendedServices = lazy(() => import('../Components/RecommendedServices/RecommendedServices'));
const Contact = lazy(() => import('../Components/Contact/Contact'));

// Admin-only — never loaded for regular visitors
const EditPanelSheet = lazy(() => import('../Components/EditPanel/EditPanelSheet'));

const Home = () => {
    // Use the custom hook for editor check
    const { isEditor, error } = useEditorCheck();
    const staticContentData = useStaticContent('home-page');
    const {getContentByTag, getImageByTag, hasContent, loading, refreshContent} = staticContentData;

    return (
        <>
            <SEO staticContentData={staticContentData} />
            {isEditor && <Suspense fallback={null}><EditPanelSheet isEditor={isEditor} error={error} page="home-page" refreshContent={refreshContent} metaInfo={staticContentData?.pageData} /></Suspense>}
            <div>
                <div className="">

                    <Hero isEditor={isEditor} loading={loading} hasContent={hasContent} getContentByTag={getContentByTag} getImageByTag={getImageByTag} refreshContent={refreshContent}></Hero>

                    {/* Section Navigation */}
                    <SectionNav />

                    {/* ── Below-fold content ──────────────────────────────
                        • Direct-imported components (WhyBook, FinalCTA, Work)
                          render instantly — no extra chunk downloads.
                        • LazySection (IntersectionObserver) defers mounting
                          until the user scrolls near the component, keeping
                          the network waterfall clean for Lighthouse.
                        • Each LazySection gets its own Suspense so chunks
                          load independently without cascading. */}

                    {/* Tickets Section — fetches /packages/ on mount */}
                    <LazySection className="min-h-[400px]" rootMargin="200px">
                      <Suspense fallback={<div className="min-h-[400px]" />}>
                        <div id="tickets">
                            <Services isEditor={isEditor} loading={loading}></Services>
                        </div>
                      </Suspense>
                    </LazySection>

                    {/* FeaturedToday — desktop only (mobile shows it inside Hero) */}
                    <div className="hidden lg:block">
                      <LazySection className="min-h-[100px]" rootMargin="200px">
                        <Suspense fallback={<div className="min-h-[100px]" />}>
                          <FeaturedToday isEditor={isEditor} />
                        </Suspense>
                      </LazySection>
                    </div>

                    <div id="why-us">
                        <WhyBook isEditor={isEditor} loading={loading} />
                    </div>

                    {/* Section 5: Final CTA */}
                    <FinalCTA isEditor={isEditor} loading={loading} />

                    {/* Reviews — fetches /reviews/ on mount */}
                    <LazySection className="min-h-[200px]" rootMargin="200px">
                      <Suspense fallback={<div className="min-h-[200px]" />}>
                        <CustomerReviews />
                      </Suspense>
                    </LazySection>

                    {/* PromoBanner — fetches /featured-offers/ on mount */}
                    <LazySection className="min-h-[100px]" rootMargin="200px">
                      <Suspense fallback={<div className="min-h-[100px]" />}>
                        <PromoBanner />
                      </Suspense>
                    </LazySection>

                    {/* Explore cards — fetches /api/cards/ on mount */}
                    <LazySection className="min-h-[200px]" rootMargin="200px">
                      <Suspense fallback={<div className="min-h-[200px]" />}>
                        <div id="explore">
                            <RecommendedServices />
                        </div>
                      </Suspense>
                    </LazySection>

                    {/* Features Section — no API call */}
                    <div id="features">
                        <Work isEditor={isEditor}></Work>
                    </div>

                    {/* Contact — fetches /website-settings/ on mount */}
                    <LazySection className="min-h-[200px]" rootMargin="300px">
                      <Suspense fallback={<div className="min-h-[200px]" />}>
                        <div id="routes">
                            <Contact isEditor={isEditor} loading={loading}></Contact>
                        </div>
                      </Suspense>
                    </LazySection>

                </div>
            </div>
        </>
    );
};

export default Home;