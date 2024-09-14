import React from "react";
import Navbar from "./navbar";
import Hero from "./hero";

const LandingPage = () => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-[#f5f5f5]">
      <Navbar />
      <Hero />
    </div>
  );
};

export default LandingPage;
