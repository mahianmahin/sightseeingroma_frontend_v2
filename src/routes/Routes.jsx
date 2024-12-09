import { createBrowserRouter } from 'react-router-dom'
import Main from '../Layouts/Main'
import Home from '../Page/Home'
import BigBus from '../Page/BigBus'
import GreenLine from '../Page/GreenLine'
import LoveRome from '../Page/LoveRome'
import IOBus from '../Page/IOBus'
import CitySh from '../Page/CitySh'



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
      }
      
    ],
  },
 
])