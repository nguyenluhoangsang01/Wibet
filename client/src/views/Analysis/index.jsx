import {
  AccumulationChartComponent,
  AccumulationDataLabel,
  AccumulationLegend,
  AccumulationSeriesCollectionDirective,
  AccumulationSeriesDirective,
  AccumulationTooltip,
  Category,
  ChartComponent,
  ColumnSeries,
  DataLabel,
  Inject,
  Legend,
  PieSeries,
  SeriesCollectionDirective,
  SeriesDirective,
  StackingAreaSeries,
  StackingColumnSeries,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
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
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Config charts
  const tooltip = { enable: true, shared: false };
  const primaryXAxis = { valueType: "Category" };
  const legendSettings = { visible: true };
  const marker = { visible: true };

  // Get all username with money data sources
  const userNameWithMoneyDataSources = users
    .map((user) => [{ username: user.username, money: user.money }])
    .flat(1)
    .sort((a, b) => b.money - a.money);

  // Win/Bet data resources
  const winBetDataSourceWithWinTimes = users
    .map((user) => [{ username: user.username, winTimes: user.winTimes }])
    .flat(1);
  const winBetDataSourceWithBetTimes = users
    .map((user) => [{ username: user.username, betTimes: user.betTimes }])
    .flat(1);

  // Win rates data resources
  const winRatesDataSource = users
    .map((user) => [
      {
        username: user.username,
        winRates: ((user.winTimes / user.betTimes) * 100).toFixed(2),
      },
    ])
    .flat(1);

  return (
    <>
      <div className="grid md:grid-cols-3 md:gap-6">
        {/* Top 3 */}
        <ChartComponent
          id="top3"
          title="Top 3 current points"
          tooltip={tooltip}
          primaryXAxis={primaryXAxis}
        >
          <Inject services={[ColumnSeries, Tooltip, DataLabel, Category]} />

          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={userNameWithMoneyDataSources.slice(0, 3)}
              xName="username"
              yName="money"
              type="Column"
            />
          </SeriesCollectionDirective>
        </ChartComponent>

        {/* Top 10 */}
        <ChartComponent
          id="top10"
          title="Top 10 current points"
          tooltip={tooltip}
          primaryXAxis={primaryXAxis}
        >
          <Inject services={[ColumnSeries, Tooltip, DataLabel, Category]} />

          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={userNameWithMoneyDataSources.slice(0, 10)}
              xName="username"
              yName="money"
              type="Column"
            />
          </SeriesCollectionDirective>
        </ChartComponent>

        {/* Top 20 */}
        <ChartComponent
          id="top20"
          title="Top 20 current points"
          tooltip={tooltip}
          primaryXAxis={primaryXAxis}
        >
          <Inject services={[ColumnSeries, Tooltip, DataLabel, Category]} />

          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={userNameWithMoneyDataSources.slice(0, 20)}
              xName="username"
              yName="money"
              type="Column"
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </div>

      {/* Win/Bet */}
      <ChartComponent
        id="winBet1"
        title="Win/Bet"
        tooltip={tooltip}
        primaryXAxis={primaryXAxis}
        legendSettings={legendSettings}
      >
        <Inject
          services={[StackingAreaSeries, Tooltip, DataLabel, Category, Legend]}
        />

        <SeriesCollectionDirective>
          <SeriesDirective
            dataSource={winBetDataSourceWithWinTimes}
            type="StackingArea"
            xName="username"
            yName="winTimes"
            marker={marker}
            name="Win times"
            opacity={0.6}
          />
          <SeriesDirective
            dataSource={winBetDataSourceWithBetTimes}
            type="StackingArea"
            xName="username"
            yName="betTimes"
            marker={marker}
            name="Bet times"
            opacity={0.6}
          />
        </SeriesCollectionDirective>
      </ChartComponent>

      <div className="grid md:grid-cols-3 md:gap-6">
        {/* Win rates */}
        <ChartComponent
          id="winRates"
          title="Win rates"
          tooltip={tooltip}
          primaryXAxis={primaryXAxis}
        >
          <Inject services={[ColumnSeries, Tooltip, DataLabel, Category]} />

          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={winRatesDataSource}
              xName="username"
              yName="winRates"
              type="Column"
            />
          </SeriesCollectionDirective>
        </ChartComponent>

        {/* Current points with pie chart */}
        <AccumulationChartComponent
          id="currentPointsWithPieChart"
          tooltip={tooltip}
          enableSmartLabels={true}
          legendSettings={legendSettings}
          enableAnimation={true}
        >
          <Inject
            services={[
              PieSeries,
              AccumulationTooltip,
              AccumulationDataLabel,
              AccumulationLegend,
            ]}
          />

          <AccumulationSeriesCollectionDirective>
            <AccumulationSeriesDirective
              dataSource={userNameWithMoneyDataSources}
              xName="username"
              yName="money"
              type="Pie"
            />
          </AccumulationSeriesCollectionDirective>
        </AccumulationChartComponent>

        {/* Bet/Win times with columns chart */}
        <ChartComponent
          id="winBet2"
          title="Win/Bet"
          tooltip={tooltip}
          primaryXAxis={primaryXAxis}
          legendSettings={legendSettings}
        >
          <Inject
            services={[
              StackingColumnSeries,
              Tooltip,
              DataLabel,
              Category,
              Legend,
            ]}
          />

          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={winBetDataSourceWithWinTimes}
              type="StackingColumn"
              xName="username"
              yName="winTimes"
              name="Win times"
            />
            <SeriesDirective
              dataSource={winBetDataSourceWithBetTimes}
              type="StackingColumn"
              xName="username"
              yName="betTimes"
              name="Bet times"
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </div>
    </>
  );
};

export default Analysis;
