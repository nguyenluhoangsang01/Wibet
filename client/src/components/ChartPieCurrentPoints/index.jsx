import {
  AccumulationChartComponent,
  AccumulationDataLabel,
  AccumulationLegend,
  AccumulationSeriesCollectionDirective,
  AccumulationSeriesDirective,
  AccumulationTooltip,
  Inject,
  PieSeries,
} from "@syncfusion/ej2-react-charts";
import React, { memo } from "react";

const ChartPieCurrentPoints = ({
  id,
  title,
  tooltip,
  legendSettings,
  data,
  xName,
  yName,
}) => {
  return (
    <AccumulationChartComponent
      id={id}
      title={title}
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
          dataSource={data}
          xName={xName}
          yName={yName}
          type="Pie"
        />
      </AccumulationSeriesCollectionDirective>
    </AccumulationChartComponent>
  );
};

export default memo(ChartPieCurrentPoints);
