import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Default = () => {
  return (
    <div>
      <Navbar />

      <main className="pt-[70px] pb-[20px] max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-[1140px] mx-auto">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Default;
