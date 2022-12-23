import React, { useState } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { accountRoutes, navbarRoutes } from "../../constants";
import { logoutReducerAsync, selectUser } from "../../state/userSlice";

const Navbar = () => {
  // State
  const [isClicked, setIsClicked] = useState(false);
  // Get user from global state
  const { user } = useSelector(selectUser);
  // Initial dispatch
  const dispatch = useDispatch();

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutReducerAsync());
  };

  return (
    <nav className="h-[60px] bg-black text-white">
      <div className="mx-auto flex items-center justify-between h-full transition px-4 sm:px-10">
        {/* Navbar left */}
        <Link className="flex items-center gap-2" to="/">
          <img
            src="https://res.cloudinary.com/wibet/image/upload/v1671719347/images/aff-cup-logo-2022-1612100506_yykfsb.jpg"
            alt="WIBET"
            className="w-[40px] h-[40px]"
          />
          <span className="uppercase font-bold text-[18px]">WIBET</span>
        </Link>

        {/* Menu icon */}
        <MdOutlineMenu className="text-3xl cursor-pointer lg:hidden" />

        {/* Navbar right */}
        <ul className="items-center h-full hidden lg:flex">
          {navbarRoutes
            .filter((route) =>
              user?.roleID === "Admin"
                ? route
                : user?.roleID === "User"
                ? route.name !== "users" && route.name !== "team"
                : !user &&
                  route.name !== "users" &&
                  route.name !== "team" &&
                  route.name !== "matches"
            )
            .map((route) => (
              <NavLink
                key={route.name}
                to={route.path}
                className={({ isActive }) =>
                  isActive
                    ? "w-full h-full flex items-center px-3 transition hover:scale-105 text-[black] bg-[white]"
                    : "w-full h-full flex items-center px-3 transition hover:scale-105 hover:text-[black] hover:bg-[white]"
                }
              >
                <li className="uppercase font-bold text-[15px]">
                  {route.name}
                </li>
              </NavLink>
            ))}

          {/* Check if user is exists show user information */}
          {user ? (
            <li className="relative px-2 h-full z-30">
              {/* Show dropdown */}
              <button
                onClick={() => setIsClicked(!isClicked)}
                className="w-full h-full flex items-center px-3 transition hover:scale-105"
              >
                <p className="uppercase font-bold text-[15px] flex items-center gap-2">
                  <span>{user.username}</span>{" "}
                  <span className="rounded-md bg-[orange] text-black px-2 py-1">
                    {user.money}
                  </span>
                </p>
              </button>

              {/* Check if username clicked */}
              {isClicked && (
                <div className="absolute shadow-2xl w-48 overflow-hidden pb-0 top-[60px] right-[16px] text-[black] bg-white rounded-b-md">
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
                        onClick={route.name === "logout" && handleLogout}
                      >
                        <span className="w-full h-full">{route.name}</span>
                      </button>
                    )
                  )}
                </div>
              )}
            </li>
          ) : (
            <Link
              to="/login"
              className="w-full h-full flex items-center px-3 transition hover:scale-105 hover:text-[black] hover:bg-[white]"
            >
              <span className="uppercase font-bold text-[15px]">login</span>
            </Link>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
