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

const ChartColumnTop = ({ id, title, tooltip, primaryXAxis, data }) => {
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
          xName="username"
          yName="money"
          type="Column"
          pointColorMapping="color"
        />
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default memo(ChartColumnTop);
