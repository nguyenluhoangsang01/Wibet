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
    <div className="flex items-center justify-center h-[calc(100vh-50px-60px-40px)]">
      <div className="flex flex-col">
        <Bracket game={match12345678} />
      </div>
    </div>
  );
};

export default Brackets;
