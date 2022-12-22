import React, { useState } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import { accountRoutes, navbarRoutes } from "../../constants";

const Navbar = () => {
  // State
  const [isClicked, setIsClicked] = useState(false);

  return (
    <nav className="h-[60px] bg-black text-white">
      <div className="mx-auto flex items-center justify-between h-full transition px-4 sm:px-10">
        {/* Navbar left */}
        <Link className="flex items-center gap-2" to="/">
          <img
            src="https://res.cloudinary.com/wibet/image/upload/v1671551332/images/630604_hdtlx0.png"
            alt="WIBET"
            className="w-[40px] h-[40px]"
          />
          <span className="uppercase font-bold text-[18px]">WIBET</span>
        </Link>

        {/* Menu icon */}
        <MdOutlineMenu className="text-3xl cursor-pointer lg:hidden" />

        {/* Navbar right */}
        <ul className="items-center h-full hidden lg:flex">
          {navbarRoutes.map((route) => (
            <NavLink
              key={route.name}
              to={route.path}
              className={({ isActive }) =>
                isActive
                  ? "w-full h-full flex items-center px-3 transition hover:scale-105 text-[black] bg-[white]"
                  : "w-full h-full flex items-center px-3 transition hover:scale-105 hover:text-[black] hover:bg-[white]"
              }
            >
              <li className="uppercase font-bold text-[15px]">{route.name}</li>
            </NavLink>
          ))}

          <li className="relative px-2 h-full z-30">
            {/* Button to show dropdown */}
            <button
              onClick={() => setIsClicked(!isClicked)}
              className="w-full h-full flex items-center px-3 transition hover:scale-105 hover:text-[black] hover:bg-[white]"
            >
              <span className="uppercase font-bold text-[15px]">username</span>
            </button>

            {/* Check if username clicked */}
            {isClicked && (
              <div className="absolute shadow-2xl w-48 overflow-hidden pb-0 top-[61px] right-0 text-[black] bg-white rounded-b-md">
                {accountRoutes.map((route) =>
                  route.path ? (
                    <Link key={route.name} to={route.path}>
                      <div className="uppercase font-medium text-[15px] h-[40px] flex items-center px-4 transition hover:bg-[black] hover:text-white">
                        {route.name}
                      </div>
                    </Link>
                  ) : (
                    <button
                      key={route.name}
                      className="uppercase font-medium text-[15px] h-[40px] transition hover:bg-[black] hover:text-white px-4 w-full text-start"
                    >
                      <span className="w-full h-full">{route.name}</span>
                    </button>
                  )
                )}
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
