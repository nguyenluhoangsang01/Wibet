import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Default = () => {
  return (
    <div className="relative">
      <Navbar />

      <main className="pt-[70px] pb-[20px] max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-0">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Default;
