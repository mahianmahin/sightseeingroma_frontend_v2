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
      }
      
    ],
  },
 
])