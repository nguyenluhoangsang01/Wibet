import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bracket } from "react-tournament-bracket";
import { match12345678 } from "../../constants";
import { capitalize } from "../../helper";

const Brackets = () => {
  // Get pathname from location
  const { pathname } = useLocation();

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  return (
    <div className="h-[calc(100vh-50px-60px-40px)] -ml-[50px] overflow-x-scroll xl:overflow-hidden">
      <Bracket game={match12345678} />
    </div>
  );
};

export default Brackets;
