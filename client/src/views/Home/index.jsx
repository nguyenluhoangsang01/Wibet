import { Image } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { GiPositionMarker } from "react-icons/gi";
import { GoPrimitiveDot } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { formatTime } from "../../constants";
import { getAllMatchesReducerAsync, selectMatch } from "../../state/matchSlice";
import { selectUser } from "../../state/userSlice";

const Home = () => {
  // Initial state
  const [comingMatch, setComingMatch] = useState({});
  // Get all matches from global state
  const {
    matches: { matches },
  } = useSelector(selectMatch);
  // Get user logged
  const { user } = useSelector(selectUser);
  // Initial dispatch
  const dispatch = useDispatch();

  // Set title
  useEffect(() => {
    document.title = `Wibet`;
  });

  // Get all matches
  useEffect(() => {
    dispatch(getAllMatchesReducerAsync());
  }, [dispatch]);

  // Get first match
  useEffect(() => {
    [...matches]
      ?.filter((match) => match.isShow)
      ?.sort((a, b) => moment(a.matchDate) - moment(b.matchDate))
      ?.some(
        (match) =>
          !match.isCanceled &&
          !match.result &&
          match.isShow &&
          setComingMatch(match)
      );
  }, [matches, user?.roleID]);

  return (
    <div>
      <Navbar />

      <main className="pt-[70px] pb-[20px] relative">
        <div className="-mx-4 sm:-mx-10 -my-6 relative h-[calc(100vh-50px-52px)]">
          <img
            src="https://res.cloudinary.com/wibet/image/upload/v1673334130/home-background_alstvu.jpg"
            alt="home-background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute bg-[#ffffffcc] px-[15px] py-[30px] rounded-[10px] w-[50%] top-[70px] left-0 right-0 mx-auto flex items-center justify-center">
          <div className="h-[120px] flex items-center justify-center">
            {Object.keys(comingMatch).length === 0 || !user ? (
              <div className="animate-spin flex items-center">
                <GoPrimitiveDot className="text-black text-6xl" />
                <GoPrimitiveDot className="text-[#f4ec60] text-6xl" />
                <GoPrimitiveDot className="text-[#5a554f] text-6xl" />
              </div>
            ) : (
              <div className="divide-y-2 divide-black font-[calibri] flex flex-col items-center justify-between">
                <div>
                  <p className="text-[30px] font-bold">
                    {comingMatch &&
                      moment(comingMatch?.matchDate)
                        .format(formatTime)
                        .split(",")[0]}
                  </p>
                </div>

                <div className="flex gap-12 pt-1">
                  <div className="truncate flex flex-col items-center justify-center gap-1">
                    <div className="w-[60px] h-[60px] rounded-md flex items-center justify-center">
                      <Image
                        src={comingMatch?.team1?.flag}
                        preview={false}
                        alt={comingMatch?.team1?.fullName}
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium font-[arial] text-[20px] uppercase">
                      {comingMatch?.team1?.fullName}
                    </span>
                  </div>

                  <div className="text-center font-medium">
                    <p className="text-[24px]">VS</p>
                    <p className="text-[16px] flex items-center gap-1">
                      <GiPositionMarker /> <span>My Dinh Stadium</span>
                    </p>
                    <p className="text-[16px]">
                      {
                        moment(comingMatch?.matchDate)
                          .format(formatTime)
                          .split(",")[1]
                      }{" "}
                      (Local Time)
                    </p>
                  </div>

                  <div className="truncate flex flex-col items-center justify-center gap-1">
                    <div className="w-[60px] h-[60px] rounded-md flex items-center justify-center">
                      <Image
                        src={comingMatch?.team2?.flag}
                        preview={false}
                        alt={comingMatch?.team2?.fullName}
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium font-[arial] text-[20px] uppercase">
                      {comingMatch?.team2?.fullName}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
