function createScenarioChart(canvas) {
  return new Chart(canvas, {
    type: "line",
    data: {
      datasets: [
        {
          label: "MPROI",
          data: [],
          borderColor: "#2a7f62",
          borderWidth: 2.2,
          pointRadius: 0,
          tension: 0.3,
          yAxisID: "yMPROI",
          order: 1,
        },
        {
          label: "Profit",
          data: [],
          borderColor: "#999",
          borderWidth: 1.4,
          borderDash: [6, 3],
          pointRadius: 0,
          tension: 0.3,
          yAxisID: "yProfit",
          order: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(255,255,255,0.95)",
          titleColor: "#1a1a1a",
          bodyColor: "#444",
          borderColor: "#e0e0e0",
          borderWidth: 1,
          padding: 10,
          titleFont: { family: "'Georgia', serif", size: 12 },
          bodyFont: { family: "system-ui, sans-serif", size: 11 },
          callbacks: {
            title: (items) =>
              `DLI ${items[0].parsed.x.toFixed(1)} mol/m²/d`,
            label: (ctx) => {
              if (ctx.datasetIndex === 0)
                return ` MPROI: ${ctx.parsed.y.toFixed(2)}`;
              return ` Profit: $${ctx.parsed.y.toFixed(3)}/m²/d`;
            },
          },
        },
        annotation: { annotations: {} },
      },
      scales: {
        x: {
          type: "linear",
          min: DLI_MIN,
          max: DLI_MAX,
          title: {
            display: true,
            text: "DLI (mol m⁻² d⁻¹)",
            font: { family: "system-ui, sans-serif", size: 11 },
            color: "#666",
          },
          grid: { display: false },
          border: { color: "#ccc" },
          ticks: {
            stepSize: 4,
            font: { size: 10 },
            color: "#888",
          },
        },
        yMPROI: {
          type: "linear",
          position: "left",
          min: 0,
          title: {
            display: true,
            text: "MPROI",
            font: {
              family: "'Georgia', serif",
              size: 11,
              style: "italic",
            },
            color: "#444",
          },
          grid: { color: "#f0f0ee", lineWidth: 0.6 },
          border: { display: false },
          ticks: {
            font: { size: 10 },
            color: "#888",
            callback: (v) => v.toFixed(1),
          },
        },
        yProfit: {
          type: "linear",
          position: "right",
          title: {
            display: true,
            text: "Profit ($/m²/d)",
            font: {
              family: "system-ui, sans-serif",
              size: 10,
              style: "italic",
            },
            color: "#999",
          },
          grid: { display: false },
          border: { display: false },
          ticks: {
            font: { size: 9 },
            color: "#aaa",
            callback: (v) => "$" + v.toFixed(2),
          },
        },
      },
    },
  });
}

function updateChart(chart, curves, cropColor, currentDLI) {
  const { mproiData, profitData, dliOpt, dliOptInRange } = curves;

  chart.data.datasets[0].data = mproiData;
  chart.data.datasets[0].borderColor = cropColor;
  chart.data.datasets[1].data = profitData;

  const maxMPROI = Math.max(...mproiData.map((d) => d.y));
  chart.options.scales.yMPROI.max =
    Math.ceil(Math.max(maxMPROI, 1.5) * 1.15 * 10) / 10;

  const profitValues = profitData.map((d) => d.y);
  const minP = Math.min(...profitValues);
  const maxP = Math.max(...profitValues);
  const pPad = (maxP - minP) * 0.15 || 0.01;
  chart.options.scales.yProfit.min = Math.floor((minP - pPad) * 100) / 100;
  chart.options.scales.yProfit.max = Math.ceil((maxP + pPad) * 100) / 100;

  const annotations = {};

  annotations.breakeven = {
    type: "line",
    yMin: 1,
    yMax: 1,
    yScaleID: "yMPROI",
    borderColor: "#aaa",
    borderWidth: 1,
    borderDash: [5, 4],
    label: {
      display: true,
      content: "MPROI = 1",
      position: "start",
      backgroundColor: "transparent",
      color: "#aaa",
      font: { size: 9, family: "system-ui, sans-serif" },
      yAdjust: -8,
      padding: 0,
    },
  };

  if (dliOptInRange) {
    annotations.optLine = {
      type: "line",
      xMin: dliOpt,
      xMax: dliOpt,
      yScaleID: "yMPROI",
      borderColor: cropColor,
      borderWidth: 1.5,
      borderDash: [4, 3],
      label: {
        display: true,
        content: `Optimal: ${dliOpt.toFixed(1)}`,
        position: "start",
        backgroundColor: "rgba(255,255,255,0.85)",
        color: cropColor,
        font: { size: 10, weight: "600", family: "system-ui, sans-serif" },
        padding: { top: 2, bottom: 2, left: 4, right: 4 },
      },
    };

    annotations.destructionZone = {
      type: "box",
      xMin: dliOpt,
      xMax: DLI_MAX,
      yScaleID: "yMPROI",
      backgroundColor: "rgba(196, 92, 60, 0.04)",
      borderWidth: 0,
    };
  }

  annotations.currentDLI = {
    type: "line",
    xMin: currentDLI,
    xMax: currentDLI,
    yScaleID: "yMPROI",
    borderColor: "#555",
    borderWidth: 1.5,
    label: {
      display: true,
      content: `Current: ${currentDLI.toFixed(1)}`,
      position: "end",
      backgroundColor: "rgba(255,255,255,0.85)",
      color: "#555",
      font: { size: 10, family: "system-ui, sans-serif" },
      padding: { top: 2, bottom: 2, left: 4, right: 4 },
    },
  };

  chart.options.plugins.annotation.annotations = annotations;
  chart.update("none");
}
