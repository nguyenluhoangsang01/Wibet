import axios from "axios";
import moment from "moment";
import React, { useEffect, useId, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Bracket } from "react-tournament-bracket";
import { capitalize } from "../../helper";
import { getAllMatchesReducer, selectMatch } from "../../state/matchSlice";

const Brackets = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get all matches form global state
  const {
    matches: { matches },
  } = useSelector(selectMatch);
  // Initial state
  const [game, setGame] = useState([]);
  const [isShow, setIsShow] = useState(false);
  // Initial id
  const id14 = useId();
  const id13 = useId();
  const id12 = useId();
  const id11 = useId();
  const id10 = useId();
  const id9 = useId();
  const id8 = useId();
  const id7 = useId();
  const id6 = useId();
  const id5 = useId();
  const id4 = useId();
  const id3 = useId();
  const id2 = useId();
  const id1 = useId();
  const id0 = useId();
  // Initial dispatch
  const dispatch = useDispatch();

  // Get all matches
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/match");

        if (data) {
          dispatch(getAllMatchesReducer(data));

          setIsShow(true);
        }
      } catch ({ response }) {
        if (response.data) {
          dispatch(getAllMatchesReducer(response.data));
        }
      }
    })();
  }, [dispatch]);

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Set game after filter
  useEffect(() => {
    setGame(
      matches
        ?.filter((match) => match.isShow && !match.isCanceled)
        ?.sort((a, b) => moment(a.matchDate) - moment(b.matchDate))
    );
  }, [matches]);

  if (!isShow) return <span>Loading...</span>;

  // Game bracket
  const gameBracket = {
    id: game[14]?._id || id14,
    name: "Final",
    scheduled: game[14]?.matchDate || new Date(),
    sides: {
      home: {
        team: {
          id: game[14]?.team1?._id || id14,
          name: game[14]?.team1?.fullName || "Team 1",
        },
        score: {
          score:
            game[14]?.resultOfTeam1 === 0
              ? "0"
              : game[14]?.resultOfTeam1 || "-",
        },
        seed: {
          displayName: "A1",
          rank: 1,
          sourceGame: {
            id: game[12]?._id || id12,
            name: "Semi Final",
            scheduled: game[12]?.matchDate || new Date(),
            sides: {
              home: {
                team: {
                  id: game[12]?.team1?._id || id12,
                  name: game[12]?.team1?.fullName || "Team 1",
                },
                score: {
                  score:
                    game[12]?.resultOfTeam1 === 0
                      ? "0"
                      : game[12]?.resultOfTeam1 || "-",
                },
                seed: {
                  displayName: "A1",
                  rank: 1,
                  sourceGame: {
                    id: game[8]?._id || id8,
                    name: "1/8",
                    scheduled: game[8]?.matchDate || new Date(),
                    sides: {
                      home: {
                        team: {
                          id: game[8]?.team1?._id || id8,
                          name: game[8]?.team1?.fullName || "Team 1",
                        },
                        score: {
                          score:
                            game[8]?.resultOfTeam1 === 0
                              ? "0"
                              : game[8]?.resultOfTeam1 || "-",
                        },
                        seed: {
                          displayName: "A1",
                          rank: 1,
                          sourceGame: {
                            id: game[0]?._id || id0,
                            name: "1/16",
                            scheduled: game[0]?.matchDate || new Date(),
                            sides: {
                              home: {
                                team: {
                                  id: game[0]?.team1?._id || id0,
                                  name: game[0]?.team1?.fullName || "Team 1",
                                },
                                score: {
                                  score:
                                    game[0]?.resultOfTeam1 === 0
                                      ? "0"
                                      : game[0]?.resultOfTeam1 || "-",
                                },
                              },
                              visitor: {
                                team: {
                                  id: game[0]?.team2?._id || id0,
                                  name: game[0]?.team2?.fullName || "Team 2",
                                },
                                score: {
                                  score:
                                    game[0]?.resultOfTeam2 === 0
                                      ? "0"
                                      : game[0]?.resultOfTeam2 || "-",
                                },
                              },
                            },
                          },
                          sourcePool: {},
                        },
                      },
                      visitor: {
                        team: {
                          id: game[8]?.team2?._id || id8,
                          name: game[8]?.team2?.fullName || "Team 2",
                        },
                        score: {
                          score:
                            game[8]?.resultOfTeam2 === 0
                              ? "0"
                              : game[8]?.resultOfTeam2 || "-",
                        },
                        seed: {
                          displayName: "A2",
                          rank: 1,
                          sourceGame: {
                            id: game[1]?._id || id1,
                            name: "1/16",
                            scheduled: game[1]?.matchDate || new Date(),
                            sides: {
                              home: {
                                team: {
                                  id: game[1]?.team1?._id || id1,
                                  name: game[1]?.team1?.fullName || "Team 1",
                                },
                                score: {
                                  score:
                                    game[1]?.resultOfTeam1 === 0
                                      ? "0"
                                      : game[1]?.resultOfTeam1 || "-",
                                },
                              },
                              visitor: {
                                team: {
                                  id: game[1]?.team2?._id || id1,
                                  name: game[1]?.team2?.fullName || "Team 2",
                                },
                                score: {
                                  score:
                                    game[1]?.resultOfTeam2 === 0
                                      ? "0"
                                      : game[1]?.resultOfTeam2 || "-",
                                },
                              },
                            },
                          },
                          sourcePool: {},
                        },
                      },
                    },
                  },
                  sourcePool: {},
                },
              },
              visitor: {
                team: {
                  id: game[12]?.team2?._id || id12,
                  name: game[12]?.team2?.fullName || "Team 2",
                },
                score: {
                  score:
                    game[12]?.resultOfTeam2 === 0
                      ? "0"
                      : game[12]?.resultOfTeam2 || "-",
                },
                seed: {
                  displayName: "A2",
                  rank: 1,
                  sourceGame: {
                    id: game[9]?._id || id9,
                    name: "1/8",
                    scheduled: game[9]?.matchDate || new Date(),
                    sides: {
                      home: {
                        team: {
                          id: game[9]?.team1?._id || id9,
                          name: game[9]?.team1?.fullName || "Team 1",
                        },
                        score: {
                          score:
                            game[9]?.resultOfTeam1 === 0
                              ? "0"
                              : game[9]?.resultOfTeam1 || "-",
                        },
                        seed: {
                          displayName: "A1",
                          rank: 1,
                          sourceGame: {
                            id: game[2]?._id || id2,
                            name: "1/16",
                            scheduled: game[2]?.matchDate || new Date(),
                            sides: {
                              home: {
                                team: {
                                  id: game[2]?.team1?._id || id2,
                                  name: game[2]?.team1?.fullName || "Team 1",
                                },
                                score: {
                                  score:
                                    game[2]?.resultOfTeam1 === 0
                                      ? "0"
                                      : game[2]?.resultOfTeam1 || "-",
                                },
                              },
                              visitor: {
                                team: {
                                  id: game[2]?.team2?._id || id2,
                                  name: game[2]?.team2?.fullName || "Team 2",
                                },
                                score: {
                                  score:
                                    game[2]?.resultOfTeam2 === 0
                                      ? "0"
                                      : game[2]?.resultOfTeam2 || "-",
                                },
                              },
                            },
                          },
                          sourcePool: {},
                        },
                      },
                      visitor: {
                        team: {
                          id: game[9]?.team2?._id || id9,
                          name: game[9]?.team2?.fullName || "Team 2",
                        },
                        score: {
                          score:
                            game[9]?.resultOfTeam2 === 0
                              ? "0"
                              : game[9]?.resultOfTeam2 || "-",
                        },
                        seed: {
                          displayName: "A2",
                          rank: 1,
                          sourceGame: {
                            id: game[3]?._id || id3,
                            name: "1/16",
                            scheduled: game[3]?.matchDate || new Date(),
                            sides: {
                              home: {
                                team: {
                                  id: game[3]?.team1?._id || id3,
                                  name: game[3]?.team1?.fullName || "Team 1",
                                },
                                score: {
                                  score:
                                    game[3]?.resultOfTeam1 === 0
                                      ? "0"
                                      : game[3]?.resultOfTeam1 || "-",
                                },
                              },
                              visitor: {
                                team: {
                                  id: game[3]?.team2?._id || id3,
                                  name: game[3]?.team2?.fullName || "Team 2",
                                },
                                score: {
                                  score:
                                    game[3]?.resultOfTeam2 === 0
                                      ? "0"
                                      : game[3]?.resultOfTeam2 || "-",
                                },
                              },
                            },
                          },
                          sourcePool: {},
                        },
                      },
                    },
                  },
                  sourcePool: {},
                },
              },
            },
          },
          sourcePool: {},
        },
      },
      visitor: {
        team: {
          id: game[14]?.team2?._id || id14,
          name: game[14]?.team2?.fullName || "Team 2",
        },
        score: {
          score:
            game[14]?.resultOfTeam2 === 0
              ? "0"
              : game[14]?.resultOfTeam2 || "-",
        },
        seed: {
          displayName: "A2",
          rank: 1,
          sourceGame: {
            id: game[13]?._id || id13,
            name: "Semi Final",
            scheduled: game[13]?.matchDate || new Date(),
            sides: {
              home: {
                team: {
                  id: game[13]?.team1?._id || id13,
                  name: game[13]?.team1?.fullName || "Team 1",
                },
                score: {
                  score:
                    game[13]?.resultOfTeam1 === 0
                      ? "0"
                      : game[13]?.resultOfTeam1 || "-",
                },
                seed: {
                  displayName: "A1",
                  rank: 1,
                  sourceGame: {
                    id: game[10]?._id || id10,
                    name: "1/8",
                    scheduled: game[10]?.matchDate || new Date(),
                    sides: {
                      home: {
                        team: {
                          id: game[10]?.team1?._id || id10,
                          name: game[10]?.team1?.fullName || "Team 1",
                        },
                        score: {
                          score:
                            game[10]?.resultOfTeam1 === 0
                              ? "0"
                              : game[10]?.resultOfTeam1 || "-",
                        },
                        seed: {
                          displayName: "A1",
                          rank: 1,
                          sourceGame: {
                            id: game[4]?._id || id4,
                            name: "1/16",
                            scheduled: game[4]?.matchDate || new Date(),
                            sides: {
                              home: {
                                team: {
                                  id: game[4]?.team1?._id || id4,
                                  name: game[4]?.team1?.fullName || "Team 1",
                                },
                                score: {
                                  score:
                                    game[4]?.resultOfTeam1 === 0
                                      ? "0"
                                      : game[4]?.resultOfTeam1 || "-",
                                },
                              },
                              visitor: {
                                team: {
                                  id: game[4]?.team2?._id || id4,
                                  name: game[4]?.team2?.fullName || "Team 2",
                                },
                                score: {
                                  score:
                                    game[4]?.resultOfTeam2 === 0
                                      ? "0"
                                      : game[4]?.resultOfTeam2 || "-",
                                },
                              },
                            },
                          },
                          sourcePool: {},
                        },
                      },
                      visitor: {
                        team: {
                          id: game[10]?.team2?._id || id10,
                          name: game[10]?.team2?.fullName || "Team 2",
                        },
                        score: {
                          score:
                            game[10]?.resultOfTeam2 === 0
                              ? "0"
                              : game[10]?.resultOfTeam2 || "-",
                        },
                        seed: {
                          displayName: "A2",
                          rank: 1,
                          sourceGame: {
                            id: game[5]?._id || id5,
                            name: "1/16",
                            scheduled: game[5]?.matchDate || new Date(),
                            sides: {
                              home: {
                                team: {
                                  id: game[5]?.team1?._id || id5,
                                  name: game[5]?.team1?.fullName || "Team 1",
                                },
                                score: {
                                  score:
                                    game[5]?.resultOfTeam1 === 0
                                      ? "0"
                                      : game[5]?.resultOfTeam1 || "-",
                                },
                              },
                              visitor: {
                                team: {
                                  id: game[5]?.team2?._id || id5,
                                  name: game[5]?.team2?.fullName || "Team 2",
                                },
                                score: {
                                  score:
                                    game[5]?.resultOfTeam2 === 0
                                      ? "0"
                                      : game[5]?.resultOfTeam2 || "-",
                                },
                              },
                            },
                          },
                          sourcePool: {},
                        },
                      },
                    },
                  },
                  sourcePool: {},
                },
              },
              visitor: {
                team: {
                  id: game[13]?.team2?._id || id13,
                  name: game[13]?.team2?.fullName || "Team 2",
                },
                score: {
                  score:
                    game[13]?.resultOfTeam2 === 0
                      ? "0"
                      : game[13]?.resultOfTeam2 || "-",
                },
                seed: {
                  displayName: "A2",
                  rank: 1,
                  sourceGame: {
                    id: game[11]?._id || id11,
                    name: "1/8",
                    scheduled: game[11]?.matchDate || new Date(),
                    sides: {
                      home: {
                        team: {
                          id: game[11]?.team1?._id || id11,
                          name: game[11]?.team1?.fullName || "Team 1",
                        },
                        score: {
                          score:
                            game[11]?.resultOfTeam1 === 0
                              ? "0"
                              : game[11]?.resultOfTeam1 || "-",
                        },
                        seed: {
                          displayName: "A1",
                          rank: 1,
                          sourceGame: {
                            id: game[6]?._id || id6,
                            name: "1/16",
                            scheduled: game[6]?.matchDate || new Date(),
                            sides: {
                              home: {
                                team: {
                                  id: game[6]?.team1?._id || id6,
                                  name: game[6]?.team1?.fullName || "Team 1",
                                },
                                score: {
                                  score:
                                    game[6]?.resultOfTeam1 === 0
                                      ? "0"
                                      : game[6]?.resultOfTeam1 || "-",
                                },
                              },
                              visitor: {
                                team: {
                                  id: game[6]?.team2?._id || id6,
                                  name: game[6]?.team2?.fullName || "Team 2",
                                },
                                score: {
                                  score:
                                    game[6]?.resultOfTeam2 === 0
                                      ? "0"
                                      : game[6]?.resultOfTeam2 || "-",
                                },
                              },
                            },
                          },
                          sourcePool: {},
                        },
                      },
                      visitor: {
                        team: {
                          id: game[11]?.team2?._id || id11,
                          name: game[11]?.team2?.fullName || "Team 2",
                        },
                        score: {
                          score:
                            game[11]?.resultOfTeam2 === 0
                              ? "0"
                              : game[11]?.resultOfTeam2 || "-",
                        },
                        seed: {
                          displayName: "A2",
                          rank: 1,
                          sourceGame: {
                            id: game[7]?._id || id7,
                            name: "1/16",
                            scheduled: game[7]?.matchDate || new Date(),
                            sides: {
                              home: {
                                team: {
                                  id: game[7]?.team1?._id || id7,
                                  name: game[7]?.team1?.fullName || "Team 1",
                                },
                                score: {
                                  score:
                                    game[7]?.resultOfTeam1 === 0
                                      ? "0"
                                      : game[7]?.resultOfTeam1 || "-",
                                },
                              },
                              visitor: {
                                team: {
                                  id: game[7]?.team2?._id || id7,
                                  name: game[7]?.team2?.fullName || "Team 2",
                                },
                                score: {
                                  score:
                                    game[7]?.resultOfTeam2 === 0
                                      ? "0"
                                      : game[7]?.resultOfTeam2 || "-",
                                },
                              },
                            },
                          },
                          sourcePool: {},
                        },
                      },
                    },
                  },
                  sourcePool: {},
                },
              },
            },
          },
          sourcePool: {},
        },
      },
    },
  };

  return (
    <div className="flex items-center min-h-[calc(100vh-50px-60px-40px)]">
      <div className="overflow-x-scroll xl:overflow-x-hidden">
        <Bracket game={gameBracket} />
      </div>

      <div className="ml-16 flex flex-col items-center justify-center">
        <p className="rounded bg-[#FFC107] text-[#333] text-[22px] px-[14px] flex items-center justify-center min-w-fit">
          {game[14]?.result || "Champion team"}
        </p>

        <p className="font-[calibri] text-[12px] text-[#999999]">Champion</p>
      </div>
    </div>
  );
};

export default Brackets;
