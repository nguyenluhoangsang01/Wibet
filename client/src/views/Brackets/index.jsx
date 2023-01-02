import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { capitalize } from "../../helper";

const Brackets = () => {
  const { pathname } = useLocation();

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  return <div>Brackets</div>;
};

export default Brackets;
