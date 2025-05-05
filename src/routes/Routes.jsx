import { createBrowserRouter } from 'react-router-dom'
import Main from '../Layouts/Main'
import Home from '../Page/Home'
import BigBus from '../Page/BigBus'
import GreenLine from '../Page/GreenLine'
import LoveRome from '../Page/LoveRome'
import IOBus from '../Page/IOBus'
import CitySh from '../Page/CitySh'
import AboutUs from '../Page/AboutUs'
import TermsCondition from '../Page/Terms&Condition'
import ReturnPolicy from '../Page/ReturnPolicy'
import Refund from '../Page/Refund'
import AgentPoint from '../Page/AgentPoint'
import OfferPage from '../Page/OfferPage'
import Your_Purchased_Tickets from '../Page/Your_Purchased_Tickets'
import Login from '../Components/LoginComponent/Login/Login'
import Regi from '../Components/LoginComponent/Registation/Regi'
import ForgotPass from '../Components/LoginComponent/ForgotPass/ForgotPass'
import EmailSent from '../Components/LoginComponent/EmailSent/EmailSent'
import NewPass from '../Components/LoginComponent/NewPass/NewPass'
import Updated from '../Components/LoginComponent/Updated/Updated'
import PaymentSuccess from '../Page/PaymentSuccess'
import ManageBooking from '../Page/ManageBooking'
import SearchPage from '../Page/SearchPage'
import ViewMore from '../Components/ViewMore/ViewMore'
import Success from '../Page/Success'
import ProcessTicketsV2 from './../Page/ProcessTicketsV2';
import PaymentCancel from '../Page/PaymentCancel'






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
       
      },{
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
        path: '/:code/',
        element: <ProcessTicketsV2></ProcessTicketsV2>
      },
     
    
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