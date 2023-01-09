import React from "react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const { pathname } = useLocation();
  console.log(pathname);

  return (
    <footer className="h-[60px] bg-[#f5f5f5] border-t-[1px] border-t-[#ddd] flex items-center text-[16px]">
      <p className="px-4 sm:px-10 mx-auto md:mx-0">
        © Wibet 2022 by{" "}
        <Link to={pathname} className="text-[#428BCA]">
          wsi-dev
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
