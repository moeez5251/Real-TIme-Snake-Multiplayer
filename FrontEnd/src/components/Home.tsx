import  { useEffect } from 'react'
import Navbar from './navbar'
import Herosection from './Herosection'
import Features from './Features'
import Footer from './Footer'
import { BackgroundRippleEffect } from './GridDemoBg'
import { useSound } from '../context/sound'
import useLenis from './lenis'
const Home = () => {
  useLenis(0.4)
  const {stopSound}=useSound()
  useEffect(() => {
    stopSound("lobby");
  
    return () => {
      
    }
  }, [])
  
  return (
  <>
    <BackgroundRippleEffect rows={11} />
    <div className='relative'>
      <Navbar />
      <Herosection />
      <Features />
      <Footer />
    </div>
  </>
  )
}

export default Home
