import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { TournamentBoard } from "react-tournament-board";
import "react-tournament-board/style.css";
import BracketTeam from "../../components/BracketTeam";
import Breadcrumbs from "../../components/Breadcrumbs";
import { bracketRoutes } from "../../constants";
import { capitalize } from "../../helper";
import { selectTeam } from "../../state/teamSlice";

const Brackets = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get all teams from global state
  const {
    teams: { teams },
  } = useSelector(selectTeam);

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  return (
    <>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={bracketRoutes} />
      <div className="flex items-center justify-center h-[calc(100vh-50px-60px-40px-60px)] overflow-x-scroll pl-[300px]">
        <TournamentBoard
          competitor={[
            [
              [
                [
                  [{ id: "0" }, { id: "1" }],
                  [{ id: "2" }, { id: "3" }],
                ],
              ],
              [
                [
                  [{ id: "4" }, { id: "5" }],
                  [{ id: "6" }, { id: "7" }],
                ],
                [[{ id: "8" }, { id: "9" }]],
              ],
            ],
          ]}
          matches={[
            { result: [{ id: "0" }, { id: "1" }], winnerId: "1" },
            { result: [{ id: "2" }, { id: "3" }], winnerId: "2" },
            { result: [{ id: "4" }, { id: "5" }], winnerId: "5" },
            { result: [{ id: "6" }, { id: "7" }], winnerId: "6" },
            { result: [{ id: "8" }, { id: "9" }], winnerId: "8" },

            { result: [{ id: "1" }, { id: "2" }], winnerId: "2" },
            { result: [{ id: "5" }, { id: "6" }], winnerId: "5" },

            { result: [{ id: "5" }, { id: "8" }], winnerId: "5" },
            { result: [{ id: "2" }, { id: "5" }], winnerId: "5" },
          ]}
          nodeRenderer={(props) =>
            props.isLeaf && <BracketTeam team={teams[props.competitor.id]} />
          }
          treeLinksLayerProps={{
            stroke: "#777",
            strokeWidth: 2,
          }}
          winnerLinksLayerProps={{
            stroke: "#ff9f40",
            strokeWidth: 4,
          }}
          direction="vertical"
        />
      </div>
    </>
  );
};

export default Brackets;
