import {
  Category,
  ChartComponent,
  DataLabel,
  Inject,
  Legend,
  SeriesCollectionDirective,
  SeriesDirective,
  StackingColumnSeries,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import React, { memo } from "react";

const ChartStackingColumnWinBet = ({
  id,
  title,
  tooltip,
  primaryXAxis,
  legendSettings,
  data1,
  data2,
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
        services={[StackingColumnSeries, Tooltip, DataLabel, Category, Legend]}
      />

      <SeriesCollectionDirective>
        <SeriesDirective
          dataSource={data1}
          type="StackingColumn"
          xName={xName}
          yName={yName1}
          name={name1}
        />
        <SeriesDirective
          dataSource={data2}
          type="StackingColumn"
          xName={xName}
          yName={yName2}
          name={name2}
        />
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default memo(ChartStackingColumnWinBet);
