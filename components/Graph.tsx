import { useEffect } from "react";
import { Chart } from "chart.js/auto";

interface GraphProps {
  times: string[];
  acpower: number[];
}

export function Graph({ times, acpower }: GraphProps) {
  useEffect(() => {
    var ctx = document.getElementById("chart") as HTMLCanvasElement | null;
    ctx = ctx?.getContext("2d") as HTMLCanvasElement | null;
    if (!ctx) return;
    var myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: times,
        datasets: [
          {
            data: acpower,
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
  }, [times, acpower]);

  return (
    <div>
      <canvas id="chart" width="600" height="600"></canvas>
    </div>
  );
}
