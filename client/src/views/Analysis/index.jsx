import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ChartColumnTop from "../../components/ChartColumnTop";
import ChartColumnsWinRates from "../../components/ChartColumnWinRates";
import ChartPieCurrentPoints from "../../components/ChartPieCurrentPoints";
import ChartStackingAreaWinBet from "../../components/ChartStackingAreaWinBet";
import ChartStackingColumnWinBet from "../../components/ChartStackingColumnWinBet";
import { capitalize } from "../../helper";
import { getAllUsersReducerAsync, selectUser } from "../../state/userSlice";

const Analysis = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get user form global state
  const {
    users: { users },
    accessToken,
  } = useSelector(selectUser);
  // Initial dispatch
  const dispatch = useDispatch();

  // Get all users
  useEffect(() => {
    dispatch(getAllUsersReducerAsync());
  }, [accessToken, dispatch]);

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname?.slice(1));
  }, [pathname]);

  // Config charts
  const tooltip = { enable: true, shared: false };
  const primaryXAxis = { valueType: "Category" };
  const legendSettings = { visible: true };
  const marker = { visible: true };

  // Get all username with money data sources
  const top3UserNameWithMoneyDataSources = users
    ?.slice(0, 3)
    ?.map((user) => [
      { username: user.username, money: user.money, color: "#FFB266" },
    ])
    .flat(1)
    .sort((a, b) => b.money - a.money);
  const top10UserNameWithMoneyDataSources = users
    ?.slice(0, 10)
    ?.map((user) => [
      { username: user.username, money: user.money, color: "#6FCDCD" },
    ])
    .flat(1)
    .sort((a, b) => b.money - a.money);
  const top20UserNameWithMoneyDataSources = users
    ?.slice(0, 20)
    ?.map((user) => [
      { username: user.username, money: user.money, color: "#FF6384" },
    ])
    .flat(1)
    .sort((a, b) => b.money - a.money);
  const userNameWithMoneyDataSources = users
    ?.filter((user) => user.betTimes > 0)
    ?.map((user) => [{ username: user.username, money: user.money }])
    .flat(1)
    .sort((a, b) => b.money - a.money);

  // Win/Bet data resources
  const winBetDataSourceWithWinTimes = users
    ?.filter((user) => user.betTimes > 0)
    ?.map((user) => [{ username: user.username, winTimes: user.winTimes }])
    .flat(1);
  const winBetDataSourceWithBetTimes = users
    ?.filter((user) => user.betTimes > 0)
    ?.map((user) => [{ username: user.username, betTimes: user.betTimes }])
    .flat(1);

  // Win rates data resources
  const winRatesDataSource = users
    ?.map((user) => [
      {
        username: user.username,
        winRates: ((user.winTimes / user.betTimes) * 100).toFixed(2),
        color: "#FF6384",
      },
    ])
    .flat(1);

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      <div className="grid md:grid-cols-3 md:gap-6 md:h-[300px]">
        {/* Top 3 */}
        <ChartColumnTop
          id="top3"
          title="Top 3 Current Points"
          tooltip={tooltip}
          primaryXAxis={primaryXAxis}
          data={top3UserNameWithMoneyDataSources}
        />

        {/* Top 10 */}
        <ChartColumnTop
          id="top10"
          title="Top 10 Current Points"
          tooltip={tooltip}
          primaryXAxis={primaryXAxis}
          data={top10UserNameWithMoneyDataSources}
        />

        {/* Top 20 */}
        <ChartColumnTop
          id="top20"
          title="Top 20 Current Points"
          tooltip={tooltip}
          primaryXAxis={primaryXAxis}
          data={top20UserNameWithMoneyDataSources?.slice(0, 20)}
        />
      </div>

      {/* Win/Bet */}
      <div className="md:h-[350px]">
        <ChartStackingAreaWinBet
          id="winBetWithStackingArea"
          title="Win/Bet"
          tooltip={tooltip}
          primaryXAxis={primaryXAxis}
          legendSettings={legendSettings}
          winTimesData={winBetDataSourceWithWinTimes}
          betTimesData={winBetDataSourceWithBetTimes}
          marker={marker}
          opacity="0.6"
          xName="username"
          yName1="winTimes"
          yName2="betTimes"
          name1="Win times"
          name2="Bet times"
        />
      </div>

      <div className="grid md:grid-cols-3 md:gap-6 md:h-[300px]">
        {/* Win rates */}
        <ChartColumnsWinRates
          id="winRates"
          title="Win Rates"
          tooltip={tooltip}
          primaryXAxis={primaryXAxis}
          data={winRatesDataSource}
          xName="username"
          yName="winRates"
        />

        {/* Current points with pie chart */}
        <ChartPieCurrentPoints
          id="currentPointsWithPieChart"
          title="Current Points"
          tooltip={tooltip}
          legendSettings={legendSettings}
          data={userNameWithMoneyDataSources}
          xName="username"
          yName="money"
        />

        {/* Bet/Win times with columns chart */}
        <ChartStackingColumnWinBet
          id="winBetWithStackingColumn"
          title="Win/Bet"
          tooltip={tooltip}
          primaryXAxis={primaryXAxis}
          legendSettings={legendSettings}
          xName="username"
          yName1="winTimes"
          name1="Win times"
          yName2="betTimes"
          name2="Bet times"
          data1={winBetDataSourceWithWinTimes}
          data2={winBetDataSourceWithBetTimes}
        />
      </div>
    </div>
  );
};

export default Analysis;
