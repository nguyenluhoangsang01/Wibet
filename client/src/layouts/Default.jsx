import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Default = () => {
  return (
    <div className="relative h-full">
      <Navbar />

      <main className="px-4 sm:px-10 pt-[70px] pb-[20px]">
        <Outlet />
      </main>

      <div className="sticky w-full bottom-0">
        <Footer />
      </div>
    </div>
  );
};

export default Default;
