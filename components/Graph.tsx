import { useEffect } from "react";
import { Chart } from "chart.js/auto";

export function Graph(data: any) {
  data = data.data.histsearch;
  console.log(data);
  useEffect(() => {
    var ctx = document.getElementById("chart") as HTMLCanvasElement | null;
    ctx = ctx?.getContext("2d") as HTMLCanvasElement | null;
    if (!ctx) return;
    var myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.times,
        datasets: [
          {
            data: data.acpower,
            label: "AC Power",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: true,
          },
        ],
      },
    });
    return () => {
      myChart.destroy();
    };
  }, [data]);

  return (
    <div>
      <canvas id="chart" width="200" height="200"></canvas>
    </div>
  );
}
