import React from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { rankingRoutes } from "../../constants";

const Ranking = () => {
  const { pathname } = useLocation();

  return (
    <div>
      <Breadcrumbs routes={rankingRoutes} />
      <Heading title={pathname.slice(1)} />
    </div>
  );
};

export default Ranking;
