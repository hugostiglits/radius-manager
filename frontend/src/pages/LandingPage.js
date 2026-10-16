import React from 'react';
import { Box } from '@mui/material';
import HeroSection from '../components/landing/HeroSection';
import GeoCheck from '../components/landing/GeoCheck';  
import Footer from '../components/landing/Footer';
import Navbar from '../components/landing/Navbar';

// import CRTEffects from '../components/CRTEffects';



const LandingPage = () =>{
    return (
        <Box sx={{
  minHeight: '100vh',
  bgcolor: 'background.default',
  color: 'text.primary',
}} >
                    <Navbar />          
                    {/* <CRTEffects /> */}
                    <HeroSection />
                    <GeoCheck/>
                    {/* 
                    <FeaturesSection />
                    <HowItWorks />
                    <TechStack />
                    <Footer />
                     */}
        </Box>
        
    );
};
export default LandingPage;
