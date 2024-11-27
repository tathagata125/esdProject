import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'

import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
 
  const navigate = useNavigate()
  const {user} = useSelector(store=>store.auth)
  useEffect(()=>{
    //   if(user?.role==='recuiter'){
    //       navigate("/admin/companies");
    //   }
  },[])
  return (
    <div>
        <Navbar/>
        <HeroSection/>
      
       
    </div>
  )
}

export default Home