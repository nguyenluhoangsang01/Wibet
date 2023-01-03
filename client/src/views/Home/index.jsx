import { Image } from "antd";
import moment from "moment";
import React, { useCallback, useEffect } from "react";
import { AiOutlineSwapRight } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../../helper";
import { getAllMatchesReducerAsync, selectMatch } from "../../state/matchSlice";

const Home = () => {
  // Get all matches from global state
  const {
    matches: { matches },
  } = useSelector(selectMatch);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial current date
  const currentDate = moment(new Date());
  // Initial navigate
  const navigate = useNavigate();

  // Set title
  useEffect(() => {
    document.title = `Wibet`;
  });

  // Get all matches
  useEffect(() => {
    dispatch(getAllMatchesReducerAsync());
  }, [dispatch]);

  // Get Min date
  const minDate = useCallback(() => {
    new Date(
      Math.min(
        matches
          ?.filter((match) => currentDate.isBefore(match?.matchDate))
          ?.map((match) => {
            return new Date(match.matchDate);
          })
      )
    );
  }, [currentDate, matches]);

  // Handle view all matches
  const handleViewAllMatches = () => {
    navigate("/matches");
  };

  return (
    <div className="-mx-4 sm:-mx-10 -my-6 relative">
      <img
        src="https://res.cloudinary.com/wibet/image/upload/v1671760274/images/aff-cup-2022-667_as0m3a.jpg"
        alt="home-background"
        className="w-full h-full"
      />

      <div className="bg-white rounded-md absolute top-[50px] inset-x-0 h-80 shadow-2xl min-w-[450px] max-w-5xl mx-auto flex items-center justify-center">
        {matches
          ?.filter(
            (match) =>
              moment(match.matchDate).date() === moment(minDate).date() &&
              !match.result
          )
          .map((match) => {
            const hours = currentDate.diff(moment(match.matchDate), "hours");

            return (
              <div
                key={match._id}
                className="font-[calibri] text-center flex flex-col gap-2 min-w-[450px] px-4"
              >
                <p className="text-[#428BCA] font-semibold text-[24px] text-left mb-4">
                  {formatTime(match?.matchDate)}
                </p>

                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-[60px] h-[60px] bg-white rounded-md flex items-center justify-center p-1 shadow-inner shadow-[#ccc]">
                      <Image
                        src={match.team1.flag}
                        preview={false}
                        alt={match.team1.fullName}
                      />
                    </div>
                    <span className="font-semibold font-[arial] text-[18px]">
                      {match.team1.fullName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-[60px] h-[60px] bg-white rounded-md flex items-center justify-center p-1 shadow-inner shadow-[#ccc]">
                      <Image
                        src={match.team2.flag}
                        preview={false}
                        alt={match.team2.fullName}
                      />
                    </div>
                    <span className="font-semibold font-[arial] text-[18px]">
                      {match.team2.fullName}
                    </span>
                  </div>
                </div>

                <p className="text-base">{match.description}</p>

                <p className="text-base font-semibold text-[#d2322d]">
                  Match starts in {hours.toString().replace("-", "")} hours{" "}
                </p>

                <p
                  className="text-sm flex items-center justify-end cursor-pointer underline transition hover:text-[#428BCA] italic mt-4"
                  onClick={handleViewAllMatches}
                >
                  View all matches <AiOutlineSwapRight />
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Home;
