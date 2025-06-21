import { createBrowserRouter } from 'react-router-dom'
import EmailSent from '../Components/LoginComponent/EmailSent/EmailSent'
import ForgotPass from '../Components/LoginComponent/ForgotPass/ForgotPass'
import Login from '../Components/LoginComponent/Login/Login'
import NewPass from '../Components/LoginComponent/NewPass/NewPass'
import Regi from '../Components/LoginComponent/Registation/Regi'
import Updated from '../Components/LoginComponent/Updated/Updated'
import ViewMore from '../Components/ViewMore/ViewMore'
import Main from '../Layouts/Main'
import AboutUs from '../Page/AboutUs'
import AgentPoint from '../Page/AgentPoint'
import BigBus from '../Page/BigBus'
import CitySh from '../Page/CitySh'
import GreenLine from '../Page/GreenLine'
import Home from '../Page/Home'
import IOBus from '../Page/IOBus'
import LoveRome from '../Page/LoveRome'
import ManageBooking from '../Page/ManageBooking'
import NotFound from '../Page/NotFound'
import OfferPage from '../Page/OfferPage'
import PaymentCancel from '../Page/PaymentCancel'
import PaymentSuccess from '../Page/PaymentSuccess'
import Refund from '../Page/Refund'
import ReturnPolicy from '../Page/ReturnPolicy'
import SearchPage from '../Page/SearchPage'
import Success from '../Page/Success'
import TermsCondition from '../Page/Terms&Condition'
import Your_Purchased_Tickets from '../Page/Your_Purchased_Tickets'
import ProcessTicketsV2 from './../Page/ProcessTicketsV2'
import TicketTypeSearch from '../Components/Hero/TicketTypeSearch'






export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/bigbus',
        element : <BigBus></BigBus>
      },
      {
        path: '/greenLine',
        element:<GreenLine></GreenLine>
      },
      {
        path: '/loveRome',
        element: <LoveRome></LoveRome>
      },
      {
        path: '/iobus',
        element: <IOBus></IOBus>
      },
      {
        path: '/city',
        element: <CitySh></CitySh>
      },
      {
        path: '/aboutus',
        element: <AboutUs></AboutUs>
      },
      {
        path:'/terms',
        element: <TermsCondition></TermsCondition>
      },
      {
        path: '/returnPolicy',
        element : <ReturnPolicy></ReturnPolicy>
      },
      {
        path: '/refund',
        element: <Refund></Refund>
      },
      {
        path: '/agentpoints',
        element: <AgentPoint></AgentPoint>
      },
      {
        path: '/offer',
        element: <OfferPage></OfferPage>
      },
      {
        path: '/yourticket',
        element: <Your_Purchased_Tickets></Your_Purchased_Tickets>
      },
      {
        path: '/success',
        element: <PaymentSuccess></PaymentSuccess>
      },
      {
        path: '/manageBookings/:status/:id',
        element: <ManageBooking></ManageBooking>
      },
      {
        path: '/search',
        element: <SearchPage></SearchPage>
      },
      {
        path: '/viewsimilar/:hours/:company',
        element: <ViewMore></ViewMore>
      },
      {
        path:'/success/:unique_id/',
        element: <Success></Success>
      },
      {
        path: '/cancel/',
        element: <PaymentCancel></PaymentCancel>
      },
      {
        path: '/verify/:code/',
        element: <ProcessTicketsV2></ProcessTicketsV2>
      },
      {
        path: '*',
        element: <NotFound />
      }
    ],
  },
  {
    path: '/login',
    element: <Login></Login>
  },
  {
    path: '/registation',
    element: <Regi></Regi>
  },
  {
    path: '/test',
    element: <TicketTypeSearch></TicketTypeSearch>
  },
  {
    path: '/forgotpass',
    element: <ForgotPass></ForgotPass>
  },
  {
    path: '/emailsent',
    element: <EmailSent></EmailSent>
  },
  {
    path: '/newpass',
    element: <NewPass></NewPass>
  },
  {
    path: '/updated',
    element: <Updated></Updated>
  }
])