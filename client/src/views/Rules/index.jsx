import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { ruleRoutes } from "../../constants";
import { capitalize } from "../../helper";

const Rules = () => {
  const { pathname } = useLocation();

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  return (
    <div className="divide-y-2">
      {/* First section */}
      <div>
        {/* Breadcrumbs */}
        <Breadcrumbs routes={ruleRoutes} />

        {/* Heading */}
        <div className="text-center">
          <Heading title="THỂ LỆ THAM GIA CHƯƠNG TRÌNH" />
        </div>
      </div>

      {/* Second section */}
      <div></div>
    </div>
  );
};

export default Rules;
