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
            borderColor: "#1d1916",
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
            backgroundColor: "#0b0a09",
            borderColor: "#3a322c",
            borderWidth: 1,
            titleColor: "#fff",
            bodyColor: "#e3e0d9",
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
