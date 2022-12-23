import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { matchesRoutes } from "../../constants";
import { selectUser } from "../../state/userSlice";

const Matches = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get user form global state
  const { user } = useSelector(selectUser);

  // Check if user is null
  if (!user) return <Navigate to="/" />;

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={matchesRoutes} />
      {/* Heading */}
      <Heading title={pathname.slice(1)} />
    </div>
  );
};

export default Matches;
