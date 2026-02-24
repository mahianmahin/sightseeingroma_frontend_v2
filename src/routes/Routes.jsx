import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Main from '../Layouts/Main'
import RequireAuth from '../Components/RequireAuth'

// Lightweight loading fallback for lazy-loaded routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-[#930B31] border-t-transparent rounded-full animate-spin" />
  </div>
)

// Helper to wrap a lazy component in Suspense
const S = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
)

// Lazy-loaded page components
const Home = lazy(() => import('../Page/Home'))
const AboutUs = lazy(() => import('../Page/AboutUs'))
const TermsCondition = lazy(() => import('../Page/Terms&Condition'))
const ReturnPolicy = lazy(() => import('../Page/ReturnPolicy'))
const Refund = lazy(() => import('../Page/Refund'))
const AgentPoint = lazy(() => import('../Page/AgentPoint'))
const OfferPage = lazy(() => import('../Page/OfferPage'))
const ManageBooking = lazy(() => import('../Page/ManageBooking'))
const ViewMore = lazy(() => import('../Components/ViewMore/ViewMore'))
const Your_Purchased_Tickets = lazy(() => import('../Page/Your_Purchased_Tickets'))
const PaymentSuccess = lazy(() => import('../Page/PaymentSuccess'))
const PaymentCancel = lazy(() => import('../Page/PaymentCancel'))
const Success = lazy(() => import('../Page/Success'))
const ProcessTicketsV2 = lazy(() => import('../Page/ProcessTicketsV2'))
const EmbeddedCheckout = lazy(() => import('../Page/EmbeddedCheckout'))
const PaymentReturn = lazy(() => import('../Page/PaymentReturn'))
const Companies = lazy(() => import('../Page/Companies'))
const CompanyThroughCard = lazy(() => import('../Page/CompanyThroughCard'))
const TicketComparison = lazy(() => import('../Page/TicketComparison'))
const Blogs = lazy(() => import('../Page/Blogs'))
const BlogDetail = lazy(() => import('../Page/BlogDetail'))
const FeaturedOffer = lazy(() => import('../Page/FeaturedOffer'))
const NotFound = lazy(() => import('../Page/NotFound'))
const Profile = lazy(() => import('../Page/Profile'))
const Sitemap = lazy(() => import('../Page/Sitemap'))

// Standalone pages (outside Main layout)
const Login = lazy(() => import('../Components/LoginComponent/Login/Login'))
const Regi = lazy(() => import('../Components/LoginComponent/Registation/Regi'))
const Analytics = lazy(() => import('../Page/Analytics'))
const BlogConversionStats = lazy(() => import('../Page/BlogConversionStats'))
const TicketTypeSearch = lazy(() => import('../Components/Hero/TicketTypeSearch'))

// Reset password components
const ResetPasswordProvider = lazy(() =>
  import('../Components/LoginComponent/ResetPassword/ResetPasswordContext').then(m => ({
    default: m.ResetPasswordProvider,
  }))
)
const RequestReset = lazy(() => import('../Components/LoginComponent/ResetPassword/RequestReset'))
const ResetPassword = lazy(() => import('../Components/LoginComponent/ResetPassword/ResetPassword'))
const ResetSuccess = lazy(() => import('../Components/LoginComponent/ResetPassword/ResetSuccess'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/',
        element: S(Home),
      },
      {
        path: '/featured-today',
        element: S(FeaturedOffer),
      },
      {
        path: '/featured-offers',
        element: S(FeaturedOffer),
      },
      {
        path: '/rome-sightseeing-deals',
        element: S(FeaturedOffer),
      },
      {
        path: '/bus/:companySlug/:companyName',
        element: S(Companies),
      },
      {
        path: '/company-packages/:companySlug',
        element: S(CompanyThroughCard),
      },
      {
        path: '/compare-tickets',
        element: S(TicketComparison),
      },
      {
        path: '/blogs',
        element: S(Blogs),
      },
      {
        path: '/blog/:slug',
        element: S(BlogDetail),
      },
      {
        path: '/aboutus',
        element: S(AboutUs),
      },
      {
        path: '/about-us',
        element: S(AboutUs),
      },
      {
        path: '/terms',
        element: S(TermsCondition),
      },
      {
        path: '/returnPolicy',
        element: S(ReturnPolicy),
      },
      {
        path: '/refund',
        element: S(Refund),
      },
      {
        path: '/agentpoints',
        element: S(AgentPoint),
      },
      {
        path: '/offer',
        element: S(OfferPage),
      },
      {
        path: '/yourticket',
        element: S(Your_Purchased_Tickets),
      },
      {
        path: '/success',
        element: S(PaymentSuccess),
      },
      {
        path: '/manageBookings/:status/:id',
        element: S(ManageBooking),
      },
      {
        path: '/viewsimilar/:hours/:company',
        element: S(ViewMore),
      },
      {
        path: '/success/:unique_id/',
        element: S(Success),
      },
      {
        path: '/cancel/',
        element: S(PaymentCancel),
      },
      {
        path: '/verify/:code/',
        element: S(ProcessTicketsV2),
      },
      {
        path: '/checkout',
        element: S(EmbeddedCheckout),
      },
      {
        path: '/payment-return',
        element: S(PaymentReturn),
      },
      {
        path: '/profile',
        element: (
          <RequireAuth>
            <Suspense fallback={<PageLoader />}>
              <Profile />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '*',
        element: S(NotFound),
      },
    ],
  },
  {
    path: '/analytics',
    element: S(Analytics),
  },
  {
    path: '/blog-analytics',
    element: S(BlogConversionStats),
  },
  {
    path: '/login',
    element: S(Login),
  },
  {
    path: '/registation',
    element: S(Regi),
  },
  {
    path: '/test',
    element: S(TicketTypeSearch),
  },
  {
    path: '/forgot-password',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ResetPasswordProvider>
          <RequestReset />
        </ResetPasswordProvider>
      </Suspense>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ResetPasswordProvider>
          <ResetPassword />
        </ResetPasswordProvider>
      </Suspense>
    ),
  },
  {
    path: '/reset-success',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ResetPasswordProvider>
          <ResetSuccess />
        </ResetPasswordProvider>
      </Suspense>
    ),
  },
  {
    path: '/sitemap.xml',
    element: S(Sitemap),
  },
])
