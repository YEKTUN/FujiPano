import React from "react";
import { Route, Router, Routes } from "react-router-dom";
import BannerEditor from "./components/Banner/BannerEditor";
import PanoComponent from "./components/Pano/PanoComponent";
import HomePage from "./components/pages/HomePage";
import PricingPage from "./components/pages/PricingPage";
import LoginPage from "./components/pages/LoginPage";
import SignupPage from "./components/pages/SignupPage";
import PanoVerticalHorizontalPage from "./components/pages/utils/PanoVerticalHorizontalPage";

const App = () => {
  return (
    
    <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<SignupPage/>} />
        <Route path="/pano" element={<PanoComponent />} />
        <Route path="/pano/:panoId" element={<PanoVerticalHorizontalPage />} />
      </Routes>
 
  );
};

export default App;
