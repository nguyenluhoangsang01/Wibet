import { Image } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { GiPositionMarker } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { formatTime } from "../../constants";
import { getAllMatchesReducerAsync, selectMatch } from "../../state/matchSlice";
import { selectUser } from "../../state/userSlice";

const Home = () => {
  // Initial state
  const [comingMatch, setComingMatch] = useState({});
  const [isShow, setIsShow] = useState(false);
  // Get all matches from global state
  const {
    matches: { matches },
  } = useSelector(selectMatch);
  // Get user logged
  const { user } = useSelector(selectUser);
  // Initial dispatch
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShow(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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
    isShow &&
      [...matches]
        ?.filter((match) => match.isShow)
        ?.sort((a, b) => moment(b.matchDate) - moment(a.matchDate))
        ?.some(
          (match) =>
            !match.isCanceled &&
            !match.result &&
            match.isShow &&
            setComingMatch(match)
        );
  }, [isShow, matches, user?.roleID]);

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      <Navbar />

      <main className="pt-[70px] pb-[20px] relative">
        <div className="-mx-4 sm:-mx-10 -my-6 relative h-[calc(100vh-50px-52px)]">
          <img
            src="https://res.cloudinary.com/wibet/image/upload/v1673334130/home-background_alstvu.jpg"
            alt="home-background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute bg-[#ffffffcc] px-[15px] py-[30px] rounded-[10px] w-[50%] top-[70px] left-0 right-0 mx-auto flex items-center lg:justify-center overflow-x-scroll lg:overflow-hidden">
          <div className="h-[120px] flex items-center lg:justify-center">
            {Object.keys(comingMatch).length === 0 || !user ? (
              <p className="text-[25px]">No matches coming up</p>
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
