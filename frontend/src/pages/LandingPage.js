import React from 'react';
import { Box } from '@mui/material';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import TechStack from '../components/landing/TechStack';
import Footer from '../components/landing/Footer';
import Navbar from '../components/landing/Navbar';



const LandingPage = () =>{
    return (
        <Box sx={{
                  minHeight: '100vh',
                  background: 'linear-gradient(180deg, #0a0a0f 0%, #0f172a 100%)',
                  color: '#e2e8f0'
        }} >
                    <Navbar />
                    <HeroSection />
                    <FeaturesSection />
                    <HowItWorks />
                    <TechStack />
                    <Footer />
        </Box>
        
    );
};
export default LandingPage;
