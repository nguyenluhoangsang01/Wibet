import { Image } from "antd";
import React, { memo, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { MdOutlineMenu } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import { accountRoutes, navbarRoutes } from "../../constants";
import { useOutsideClick } from "../../helper";
import { logoutReducerAsync, selectUser } from "../../state/userSlice";

const Navbar = () => {
  // Initial state
  const [isClicked, setIsClicked] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  // Get user from global state
  const { user, accessToken } = useSelector(selectUser);
  // Initial dispatch
  const dispatch = useDispatch();

  // Handle on user click outside account dropdown
  const handleClickOutside = () => {
    setIsClicked(false);
  };
  // Get pathname from location hook
  const { pathname } = useLocation();

  // Ref of account dropdown
  const accountDropdownRef = useOutsideClick(handleClickOutside);

  // Handle username click
  const handleUsernameClick = (e) => {
    e.stopPropagation();

    // Toggle between true and false when click multiple
    setIsClicked(!isClicked);
  };

  // Handle logout
  const handleLogout = () => {
    // Dispatch log out reducer async action
    dispatch(logoutReducerAsync(accessToken));

    // After dispatch finish set account dropdown to false
    setIsClicked(false);
  };

  return (
    <nav className="h-[50px] bg-[#222] text-white w-full fixed z-40 shadow-lg">
      <div className="max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl 2xl:max-w-7xl mx-auto flex items-center justify-between h-full transition relative px-4 sm:px-0">
        {/* Navbar left */}
        <Link
          className="flex items-center gap-2"
          to="/"
          onClick={() => setIsShowMenu(false)}
        >
          <Image
            src="https://res.cloudinary.com/wibet/image/upload/v1673334255/logo-w_ahvbug.png"
            alt="WIBET"
            preview={false}
            width={30}
            height={30}
            className="object-cover"
          />
          <span className="text-[22px]">WIBET</span>
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
              ? "absolute top-[50px] z-40 bg-black w-full -ml-4 border-t-2"
              : "items-center h-full hidden lg:flex"
          }`}
        >
          {navbarRoutes
            .filter((route) =>
              !user
                ? route.name !== "matches" &&
                  route.name !== "users" &&
                  route.name !== "teams"
                : user?.roleID === "User"
                ? route.name !== "users" && route.name !== "teams"
                : user?.roleID === "Admin" && route
            )
            .map((route) => (
              <NavLink
                key={route.name}
                to={route.path}
                className={({ isActive }) =>
                  `w-full ${
                    isShowMenu
                      ? "h-[40px] flex justify-center"
                      : "h-full p-[15px]"
                  } flex items-center transition hover:scale-105 ${
                    isActive ? "text-black bg-white" : "hover:bg-[#555555]"
                  }`
                }
                onClick={() => setIsShowMenu(false)}
              >
                <li className="text-[18px]">{route.name}</li>
              </NavLink>
            ))}

          {/* Check if user is exists show user information */}
          {user ? (
            <li
              className={`relative h-full z-30 ${isShowMenu ? "" : "p-[15px]"}`}
            >
              {/* Show dropdown */}
              <button
                onClick={handleUsernameClick}
                className={`w-full flex items-center transition hover:scale-105 active:scale-100 ${
                  isShowMenu ? "h-[40px]" : "h-full"
                }`}
              >
                <p
                  className={`h-full text-[18px] flex items-center gap-1 ${
                    isShowMenu ? "justify-center w-full" : ""
                  }`}
                >
                  <span className="text-white py-1">{user.username}</span>
                  <span className="rounded-sm bg-[#FFC107] text-black text-[14px] px-[7px] min-w-[10px] h-[20px] flex items-center justify-center">
                    {user.money}
                  </span>
                  <AiFillCaretDown className="text-[11px]" />
                </p>
              </button>

              {/* Check if username clicked */}
              {isClicked && (
                <div
                  ref={accountDropdownRef}
                  className={`absolute shadow-2xl ${
                    isShowMenu ? "w-full" : "w-48 top-[50px] right-[16px]"
                  } overflow-hidden pb-0 text-black bg-white rounded-b-md`}
                >
                  {accountRoutes.map((route) =>
                    route.path ? (
                      user.roleID === "Admin" ? (
                        route && (
                          <Link
                            key={route.name}
                            to={route.path}
                            onClick={() => {
                              setIsShowMenu(false);
                              setIsClicked(false);
                            }}
                          >
                            <div
                              className={`font-medium text-[15px] h-[30px] flex items-center px-4 transition hover:bg-black hover:text-white ${
                                isShowMenu ? "justify-center" : ""
                              }`}
                            >
                              {route.name}
                            </div>
                          </Link>
                        )
                      ) : (
                        route.name !== "settings" && (
                          <Link
                            key={route.name}
                            to={route.path}
                            onClick={() => {
                              setIsShowMenu(false);
                              setIsClicked(false);
                            }}
                          >
                            <div
                              className={`font-medium text-[15px] h-[30px] flex items-center px-4 transition hover:bg-black hover:text-white ${
                                isShowMenu ? "justify-center" : ""
                              }`}
                            >
                              {route.name}
                            </div>
                          </Link>
                        )
                      )
                    ) : (
                      <button
                        key={route.name}
                        className={`font-medium text-[15px] h-[30px] transition px-4 w-full text-start ${
                          route.name !== "logout"
                            ? "hover:bg-black hover:text-white"
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
              className={`w-full h-full flex items-center px-3 transition hover:scale-105 hover:text-black hover:bg-white ${
                pathname.slice(1) === "login" ? "bg-white text-black" : ""
              }`}
              onClick={() => setIsShowMenu(false)}
            >
              <span
                className={`text-[18px] ${
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

export default memo(Navbar);
