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
      options: {
        scales: {
          y: {
            ticks: {
              font: {
                size: 16,
              },
            },
            min: 0,
          },
          x: {
            ticks: {
              font: {
                size: 16,
              },
            },
          },
        },
        responsive: true,
      },
    });
    return () => {
      myChart.destroy();
    };
  }, [times, acpower]);

  return (
    <div className="relative h-full w-full">
      <canvas id="chart"></canvas>
    </div>
  );
}
