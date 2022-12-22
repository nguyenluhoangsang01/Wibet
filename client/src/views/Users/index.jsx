import React from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { usersRoutes } from "../../constants";

const Users = () => {
  const { pathname } = useLocation();

  return (
    <div>
      <Breadcrumbs routes={usersRoutes} />
      <Heading title={pathname.slice(1)} />
    </div>
  );
};

export default Users;
