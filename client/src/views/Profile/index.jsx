import React from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { profileRoutes } from "../../constants";

const Profile = () => {
  const { pathname } = useLocation();

  return (
    <div>
      <Breadcrumbs routes={profileRoutes} />
      <Heading title={pathname.slice(1)} />
    </div>
  );
};

export default Profile;
