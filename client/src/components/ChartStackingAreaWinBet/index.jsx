import {
  Category,
  ChartComponent,
  DataLabel,
  Inject,
  Legend,
  SeriesCollectionDirective,
  SeriesDirective,
  StackingAreaSeries,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import React, { memo } from "react";

const ChartStackingAreaWinBet = ({
  id,
  title,
  tooltip,
  primaryXAxis,
  legendSettings,
  winTimesData,
  betTimesData,
  marker,
  opacity,
  xName,
  yName1,
  yName2,
  name1,
  name2,
}) => {
  return (
    <ChartComponent
      id={id}
      title={title}
      tooltip={tooltip}
      primaryXAxis={primaryXAxis}
      legendSettings={legendSettings}
    >
      <Inject
        services={[StackingAreaSeries, Tooltip, DataLabel, Category, Legend]}
      />

      <SeriesCollectionDirective>
        <SeriesDirective
          dataSource={winTimesData}
          type="StackingArea"
          xName={xName}
          yName={yName1}
          marker={marker}
          name={name1}
          opacity={opacity}
        />
        <SeriesDirective
          dataSource={betTimesData}
          type="StackingArea"
          xName={xName}
          yName={yName2}
          marker={marker}
          name={name2}
          opacity={opacity}
        />
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default memo(ChartStackingAreaWinBet);
