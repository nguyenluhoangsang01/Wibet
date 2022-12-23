import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { teamRoutes } from "../../constants";
import { selectUser } from "../../state/userSlice";

const Team = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get user form global state
  const { user } = useSelector(selectUser);

  // Check if user role ID is difference Admin back to home page
  if (user?.roleID !== "Admin") return <Navigate to="/" />;

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={teamRoutes} />
      {/* Heading */}
      <Heading title={pathname.slice(1)} />
    </div>
  );
};

export default Team;
