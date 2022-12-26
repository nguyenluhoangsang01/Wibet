import React, { useState } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { accountRoutes, navbarRoutes } from "../../constants";
import { useOutsideClick } from "../../helper";
import { logoutReducerAsync, selectUser } from "../../state/userSlice";

const Navbar = () => {
  // State
  const [isClicked, setIsClicked] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  // Get user from global state
  const { user } = useSelector(selectUser);
  // Initial dispatch
  const dispatch = useDispatch();

  // Handle on user click outside account dropdown
  const handleClickOutside = () => {
    setIsClicked(false);
  };

  // Ref of account dropdown
  const accountDropdownRef = useOutsideClick(handleClickOutside);

  // Handle username click
  const handleUsernameClick = (e) => {
    e.stopPropagation();

    // Toggle between true and false when click multiple
    setIsClicked(!isClicked);
  };

  // Handle logout
  const handleLogout = async () => {
    // Dispatch log out reducer async action
    await dispatch(logoutReducerAsync());

    // After dispatch finish set account dropdown to false
    setIsClicked(false);
  };

  return (
    <nav className="h-[60px] bg-black text-white">
      <div className="mx-auto flex items-center justify-between h-full transition px-4 sm:px-10 relative">
        {/* Navbar left */}
        <Link
          className="flex items-center gap-2"
          to="/"
          onClick={() => setIsShowMenu(false)}
        >
          <img
            src="https://res.cloudinary.com/wibet/image/upload/v1671719347/images/aff-cup-logo-2022-1612100506_yykfsb.jpg"
            alt="WIBET"
            className="w-[40px] h-[40px]"
          />
          <span className="uppercase font-bold text-[18px]">WIBET</span>
        </Link>

        {/* Menu icon */}
        <MdOutlineMenu
          className="text-3xl cursor-pointer lg:hidden"
          onClick={() => setIsShowMenu(!isShowMenu)}
        />

        {/* Navbar right */}
        <ul
          className={`${
            isShowMenu
              ? "absolute top-[60px] z-40 bg-black w-full -ml-4 pb-2 border-t-2"
              : "items-center h-full hidden lg:flex"
          }`}
        >
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
                  `w-full ${
                    isShowMenu ? "h-[40px] flex justify-center" : "h-full px-3"
                  } flex items-center transition hover:scale-105 ${
                    isActive ? "text-[black] bg-[white]" : "hover:bg-[#555555]"
                  }`
                }
                onClick={() => setIsShowMenu(false)}
              >
                <li className="uppercase font-bold text-[15px]">
                  {route.name}
                </li>
              </NavLink>
            ))}

          {/* Check if user is exists show user information */}
          {user ? (
            <li className={`relative ${isShowMenu ? "" : "px-2"} h-full z-30`}>
              {/* Show dropdown */}
              <button
                onClick={handleUsernameClick}
                className={`w-full ${
                  isShowMenu ? "h-[40px]" : "h-full px-3"
                } flex items-center transition hover:scale-105 active:scale-100`}
              >
                <p
                  className={`uppercase h-full font-bold text-[15px] flex items-center gap-2 ${
                    isShowMenu ? "justify-center w-full" : ""
                  }`}
                >
                  <span>{user.username}</span>{" "}
                  <span className="rounded-md bg-[orange] text-black px-2 py-1">
                    {user.money}
                  </span>
                </p>
              </button>

              {/* Check if username clicked */}
              {isClicked && (
                <div
                  ref={accountDropdownRef}
                  className={`absolute shadow-2xl ${
                    isShowMenu ? "w-full" : "w-48 top-[60px] right-[16px]"
                  } overflow-hidden pb-0 text-[black] bg-white rounded-b-md`}
                >
                  {accountRoutes.map((route) =>
                    route.path ? (
                      <Link
                        key={route.name}
                        to={route.path}
                        onClick={() => {
                          setIsShowMenu(false);
                          setIsClicked(false);
                        }}
                      >
                        <div
                          className={`uppercase font-medium text-[15px] h-[40px] flex items-center px-4 transition hover:bg-[black] hover:text-white ${
                            isShowMenu ? "justify-center" : ""
                          }`}
                        >
                          {route.name}
                        </div>
                      </Link>
                    ) : (
                      <button
                        key={route.name}
                        className={`uppercase font-medium text-[15px] h-[40px] transition px-4 w-full text-start ${
                          route.name !== "logout"
                            ? "hover:bg-[black] hover:text-white"
                            : "hover:scale-105 active:scale-100"
                        }`}
                        onClick={route.name === "logout" && handleLogout}
                      >
                        <span
                          className={`w-full h-full ${
                            isShowMenu ? "flex items-center justify-center" : ""
                          }`}
                        >
                          {route.name}
                        </span>
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
              onClick={() => setIsShowMenu(false)}
            >
              <span
                className={`uppercase font-bold text-[15px] ${
                  isShowMenu
                    ? "flex text-center items-center w-full justify-center h-[40px]"
                    : ""
                }`}
              >
                login
              </span>
            </Link>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
