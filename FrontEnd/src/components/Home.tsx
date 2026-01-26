import  { useEffect } from 'react'
import Navbar from './navbar'
import Herosection from './Herosection'
import Features from './Features'
import Footer from './Footer'
import { BackgroundRippleEffect } from './GridDemoBg'
import { useSound } from '../context/sound'
const Home = () => {
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
