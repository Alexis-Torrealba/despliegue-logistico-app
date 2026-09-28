import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { fmt } from "../utils/format.js";

export default function Doughnut({ labels, data, colors, centerLabel, centerValue }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderColor: "#131a2b",
            borderWidth: 3,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        cutout: "68%",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0f1420",
            borderColor: "#232d45",
            borderWidth: 1,
            titleColor: "#eef1f8",
            bodyColor: "#c3c9db",
            padding: 10,
            callbacks: {
              label: (c) => ` ${c.label}: ${fmt(c.parsed)} t`,
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [JSON.stringify(data), JSON.stringify(labels), JSON.stringify(colors)]);

  return (
    <div className="chart-box">
      <canvas ref={canvasRef}></canvas>
      <div className="chart-center">
        <div className="val">{centerValue}</div>
        <div className="lbl">{centerLabel}</div>
      </div>
    </div>
  );
}
