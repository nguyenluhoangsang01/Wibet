import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Default = () => {
  return (
    <>
      <Navbar />

      <main className="px-4 sm:px-10 py-6 pt-[84px]">
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default Default;
