import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Bracket } from "react-tournament-bracket";
import { capitalize } from "../../helper";
import { selectMatch } from "../../state/matchSlice";

const Brackets = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get all matches form global state
  const {
    matches: { matches },
  } = useSelector(selectMatch);
  // Initial state
  const [game, setGame] = useState([]);

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Set game after filter
  useEffect(() => {
    setGame(
      [...matches]
        ?.filter((match) => match.isShow && !match.isCanceled)
        ?.sort((a, b) => moment(a.matchDate) - moment(b.matchDate))
    );
  }, [matches]);

  // Game bracket
  const gameBracket = {
    id: game[14]?._id,
    name: "Final",
    scheduled: game[14]?.matchDate,
    sides: {
      home: {
        team: { id: game[14]?.team1?._id, name: game[14]?.team1?.fullName },
        score: { score: game[14]?.resultOfTeam1 || "-" },
        seed: {
          displayName: "A1",
          rank: 1,
          sourceGame: {
            id: game[12]?._id,
            name: "Semi Final",
            scheduled: game[12]?.matchDate,
            sides: {
              home: {
                team: {
                  id: game[12]?.team1?._id,
                  name: game[12]?.team1?.fullName,
                },
                score: { score: game[12]?.resultOfTeam1 || "-" },
                seed: {
                  displayName: "A1",
                  rank: 1,
                  sourceGame: {
                    id: game[8]?._id,
                    name: "1/8",
                    scheduled: game[8]?.matchDate,
                    sides: {
                      home: {
                        team: {
                          id: game[8]?.team1?._id,
                          name: game[8]?.team1?.fullName,
                        },
                        score: { score: game[8]?.resultOfTeam1 || "-" },
                        seed: {
                          displayName: "A1",
                          rank: 1,
                          sourceGame: {
                            id: game[0]?._id,
                            name: "1/16",
                            scheduled: game[0]?.matchDate,
                            sides: {
                              home: {
                                team: {
                                  id: game[0]?.team1?._id,
                                  name: game[0]?.team1?.fullName,
                                },
                                score: { score: game[0]?.resultOfTeam1 || "-" },
                              },
                              visitor: {
                                team: {
                                  id: game[0]?.team2?._id,
                                  name: game[0]?.team2?.fullName,
                                },
                                score: { score: game[0]?.resultOfTeam2 || "-" },
                              },
                            },
                          },
                          sourcePool: {},
                        },
                      },
                      visitor: {
                        team: {
                          id: game[8]?.team2?._id,
                          name: game[8]?.team2?.fullName,
                        },
                        score: { score: game[8]?.resultOfTeam2 || "-" },
                        seed: {
                          displayName: "A2",
                          rank: 1,
                          sourceGame: {
                            id: game[1]?._id,
                            name: "1/16",
                            scheduled: game[1]?.matchDate,
                            sides: {
                              home: {
                                team: {
                                  id: game[1]?.team1?._id,
                                  name: game[1]?.team1?.fullName,
                                },
                                score: { score: game[1]?.resultOfTeam1 || "-" },
                              },
                              visitor: {
                                team: {
                                  id: game[1]?.team2?._id,
                                  name: game[1]?.team2?.fullName,
                                },
                                score: { score: game[1]?.resultOfTeam2 || "-" },
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
                  id: game[12]?.team2?._id,
                  name: game[12]?.team2?.fullName,
                },
                score: { score: game[12]?.resultOfTeam2 || "-" },
                seed: {
                  displayName: "A2",
                  rank: 1,
                  sourceGame: {
                    id: game[9]?._id,
                    name: "1/8",
                    scheduled: game[9]?.matchDate,
                    sides: {
                      home: {
                        team: {
                          id: game[9]?.team1?._id,
                          name: game[9]?.team1?.fullName,
                        },
                        score: { score: game[9]?.resultOfTeam1 || "-" },
                        seed: {
                          displayName: "A1",
                          rank: 1,
                          sourceGame: {
                            id: game[2]?._id,
                            name: "1/16",
                            scheduled: game[2]?.matchDate,
                            sides: {
                              home: {
                                team: {
                                  id: game[2]?.team1?._id,
                                  name: game[2]?.team1?.fullName,
                                },
                                score: { score: game[2]?.resultOfTeam1 || "-" },
                              },
                              visitor: {
                                team: {
                                  id: game[2]?.team2?._id,
                                  name: game[2]?.team2?.fullName,
                                },
                                score: { score: game[2]?.resultOfTeam2 || "-" },
                              },
                            },
                          },
                          sourcePool: {},
                        },
                      },
                      visitor: {
                        team: {
                          id: game[9]?.team2?._id,
                          name: game[9]?.team2?.fullName,
                        },
                        score: { score: game[9]?.resultOfTeam2 || "-" },
                        seed: {
                          displayName: "A2",
                          rank: 1,
                          sourceGame: {
                            id: game[3]?._id,
                            name: "1/16",
                            scheduled: game[3]?.matchDate,
                            sides: {
                              home: {
                                team: {
                                  id: game[3]?.team1?._id,
                                  name: game[3]?.team1?.fullName,
                                },
                                score: { score: game[3]?.resultOfTeam1 || "-" },
                              },
                              visitor: {
                                team: {
                                  id: game[3]?.team2?._id,
                                  name: game[3]?.team2?.fullName,
                                },
                                score: { score: game[3]?.resultOfTeam2 || "-" },
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
        team: { id: game[14]?.team2?._id, name: game[14]?.team2?.fullName },
        score: { score: game[14]?.resultOfTeam2 || "-" },
        seed: {
          displayName: "A2",
          rank: 1,
          sourceGame: {
            id: game[13]?._id,
            name: "Semi Final",
            scheduled: game[13]?.matchDate,
            sides: {
              home: {
                team: {
                  id: game[13]?.team1?._id,
                  name: game[13]?.team1?.fullName,
                },
                score: { score: game[13]?.resultOfTeam1 || "-" },
                seed: {
                  displayName: "A1",
                  rank: 1,
                  sourceGame: {
                    id: game[10]?._id,
                    name: "1/8",
                    scheduled: game[10]?.matchDate,
                    sides: {
                      home: {
                        team: {
                          id: game[10]?.team1?._id,
                          name: game[10]?.team1?.fullName,
                        },
                        score: { score: game[10]?.resultOfTeam1 || "-" },
                        seed: {
                          displayName: "A1",
                          rank: 1,
                          sourceGame: {
                            id: game[4]?._id,
                            name: "1/16",
                            scheduled: game[4]?.matchDate,
                            sides: {
                              home: {
                                team: {
                                  id: game[4]?.team1?._id,
                                  name: game[4]?.team1?.fullName,
                                },
                                score: { score: game[4]?.resultOfTeam1 || "-" },
                              },
                              visitor: {
                                team: {
                                  id: game[4]?.team2?._id,
                                  name: game[4]?.team2?.fullName,
                                },
                                score: { score: game[4]?.resultOfTeam2 || "-" },
                              },
                            },
                          },
                          sourcePool: {},
                        },
                      },
                      visitor: {
                        team: {
                          id: game[10]?.team2?._id,
                          name: game[10]?.team2?.fullName,
                        },
                        score: { score: game[10]?.resultOfTeam2 || "-" },
                        seed: {
                          displayName: "A2",
                          rank: 1,
                          sourceGame: {
                            id: game[5]?._id,
                            name: "1/16",
                            scheduled: game[5]?.matchDate,
                            sides: {
                              home: {
                                team: {
                                  id: game[5]?.team1?._id,
                                  name: game[5]?.team1?.fullName,
                                },
                                score: { score: game[5]?.resultOfTeam1 || "-" },
                              },
                              visitor: {
                                team: {
                                  id: game[5]?.team2?._id,
                                  name: game[5]?.team2?.fullName,
                                },
                                score: { score: game[5]?.resultOfTeam2 || "-" },
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
                  id: game[13]?.team2?._id,
                  name: game[13]?.team2?.fullName,
                },
                score: { score: game[13]?.resultOfTeam2 || "-" },
                seed: {
                  displayName: "A2",
                  rank: 1,
                  sourceGame: {
                    id: game[11]?._id,
                    name: "1/8",
                    scheduled: game[11]?.matchDate,
                    sides: {
                      home: {
                        team: {
                          id: game[11]?.team1?._id,
                          name: game[11]?.team1?.fullName,
                        },
                        score: { score: game[11]?.resultOfTeam1 || "-" },
                        seed: {
                          displayName: "A1",
                          rank: 1,
                          sourceGame: {
                            id: game[6]?._id,
                            name: "1/16",
                            scheduled: game[6]?.matchDate,
                            sides: {
                              home: {
                                team: {
                                  id: game[6]?.team1?._id,
                                  name: game[6]?.team1?.fullName,
                                },
                                score: { score: game[6]?.resultOfTeam1 || "-" },
                              },
                              visitor: {
                                team: {
                                  id: game[6]?.team2?._id,
                                  name: game[6]?.team2?.fullName,
                                },
                                score: { score: game[6]?.resultOfTeam2 || "-" },
                              },
                            },
                          },
                          sourcePool: {},
                        },
                      },
                      visitor: {
                        team: {
                          id: game[11]?.team2?._id,
                          name: game[11]?.team2?.fullName,
                        },
                        score: { score: game[11]?.resultOfTeam2 || "-" },
                        seed: {
                          displayName: "A2",
                          rank: 1,
                          sourceGame: {
                            id: game[7]?._id,
                            name: "1/16",
                            scheduled: game[7]?.matchDate,
                            sides: {
                              home: {
                                team: {
                                  id: game[7]?.team1?._id,
                                  name: game[7]?.team1?.fullName,
                                },
                                score: { score: game[7]?.resultOfTeam1 || "-" },
                              },
                              visitor: {
                                team: {
                                  id: game[7]?.team2?._id,
                                  name: game[7]?.team2?.fullName,
                                },
                                score: { score: game[7]?.resultOfTeam2 || "-" },
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
    <div className="h-[calc(100vh-50px-60px-40px)] -ml-[50px] overflow-x-scroll xl:overflow-hidden">
      <Bracket game={gameBracket} />
    </div>
  );
};

export default Brackets;
