import {
  Category,
  ChartComponent,
  ColumnSeries,
  DataLabel,
  Inject,
  SeriesCollectionDirective,
  SeriesDirective,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import React, { memo } from "react";

const ChartColumnsWinRates = ({
  id,
  title,
  tooltip,
  primaryXAxis,
  data,
  xName,
  yName,
}) => {
  return (
    <ChartComponent
      id={id}
      title={title}
      tooltip={tooltip}
      primaryXAxis={primaryXAxis}
    >
      <Inject services={[ColumnSeries, Tooltip, DataLabel, Category]} />

      <SeriesCollectionDirective>
        <SeriesDirective
          dataSource={data}
          xName={xName}
          yName={yName}
          type="Column"
          pointColorMapping="color"
        />
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default memo(ChartColumnsWinRates);
