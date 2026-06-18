const scenarios = [];

function getParams(index) {
  const card = document.querySelectorAll(".scenario-card")[index];
  const locKey = card.querySelector(".location-select").value;
  const cropKey = card.querySelector(".crop-select").value;
  const PPE = parseFloat(card.querySelector(".ppe-slider").value);
  const P_crop = parseFloat(card.querySelector(".price-input").value);
  const currentDLI = parseFloat(card.querySelector(".dli-slider").value);

  const crop = CROPS[cropKey];
  const loc = LOCATIONS[locKey];

  return {
    a: crop.a,
    b: crop.b,
    c: crop.c,
    T: crop.T,
    P_crop: P_crop,
    PPE: PPE,
    COP: loc.COP,
    C_elec: loc.C_elec,
    cropKey: cropKey,
    currentDLI: currentDLI,
  };
}

function updateScenario(index) {
  const params = getParams(index);
  const crop = CROPS[params.cropKey];
  const curves = generateCurves(params);
  updateChart(scenarios[index].chart, curves, crop.color, params.currentDLI);
  updateSummary(index, params, curves);
}

function updateSummary(index, params, curves) {
  const panel = document.querySelectorAll(".results-panel")[index];
  const { dliOpt, dliOptInRange } = curves;
  const mproiAtCurrent = calcMPROI(
    params.currentDLI,
    params.a, params.b, params.c,
    params.T, params.P_crop,
    params.PPE, params.COP, params.C_elec
  );
  const profitAtCurrent = calcProfitPerDay(
    params.currentDLI,
    params.a, params.b, params.c,
    params.T, params.P_crop,
    params.PPE, params.COP, params.C_elec
  );

  const mproiClass = mproiAtCurrent >= 1 ? "value-positive" : "value-negative";

  let optText, gapText;

  if (dliOpt === null || dliOpt < DLI_MIN) {
    optText = `<span class="value-negative">Below practical range</span>`;
    gapText = `<p class="gap-warning">MPROI is below 1.0 across the entire practical DLI range. Lighting costs exceed returns at these economics.</p>`;
  } else if (!dliOptInRange) {
    optText = `<span class="value-positive">&gt; ${DLI_MAX}</span>`;
    gapText = `<p class="gap-positive">All light in the practical range is profitable at these economics.</p>`;
  } else {
    optText = `<strong>${dliOpt.toFixed(1)}</strong> mol/m²/d`;
    const gap = params.currentDLI - dliOpt;
    if (gap > 0.5) {
      const profitAtOpt = calcProfitPerDay(
        dliOpt,
        params.a, params.b, params.c,
        params.T, params.P_crop,
        params.PPE, params.COP, params.C_elec
      );
      const annualImpact = (profitAtOpt - profitAtCurrent) * 365;
      gapText = `<p class="gap-warning">Operating <strong>${gap.toFixed(1)} mol above</strong> optimal. Estimated margin loss: <strong>$${annualImpact.toFixed(2)}/m²/year</strong></p>`;
    } else if (gap < -0.5) {
      gapText = `<p class="gap-positive">Operating <strong>${Math.abs(gap).toFixed(1)} mol below</strong> optimal. Room to add light profitably.</p>`;
    } else {
      gapText = `<p class="gap-neutral">Operating near the optimal DLI.</p>`;
    }
  }

  const mproiFormatted = mproiAtCurrent.toFixed(2);
  const verdictText =
    mproiAtCurrent >= 1.0 ? "Profitable" : "Value-destroying";
  const verdictClass =
    mproiAtCurrent >= 1.0 ? "verdict-positive" : "verdict-negative";

  panel.innerHTML = `
    <div class="mproi-hero">
      <span class="mproi-hero-label">MPROI at DLI ${params.currentDLI.toFixed(1)}</span>
      <span class="mproi-hero-value ${mproiClass}">${mproiFormatted}</span>
      <span class="mproi-hero-verdict ${verdictClass}">${verdictText}</span>
    </div>
    <div class="summary-row">
      <div class="summary-item">
        <span class="summary-label">Optimal DLI</span>
        <span class="summary-value">${optText}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Profit</span>
        <span class="summary-value">$${profitAtCurrent.toFixed(2)}/m²/d</span>
      </div>
    </div>
    ${gapText}
  `;
}

function initScenario(index) {
  const card = document.querySelectorAll(".scenario-card")[index];
  const canvas = card.querySelector(".mproi-chart");
  const chart = createScenarioChart(canvas);
  scenarios[index] = { chart };

  const cropSelect = card.querySelector(".crop-select");
  const priceInput = card.querySelector(".price-input");
  priceInput.value = CROPS[cropSelect.value].P_crop;

  const ppeSlider = card.querySelector(".ppe-slider");
  const ppeDisplay = card.querySelector(".ppe-value");
  const dliSlider = card.querySelector(".dli-slider");
  const dliDisplay = card.querySelector(".dli-value");

  function refresh() {
    updateScenario(index);
  }

  card.querySelector(".location-select").addEventListener("change", refresh);

  cropSelect.addEventListener("change", () => {
    priceInput.value = CROPS[cropSelect.value].P_crop;
    refresh();
  });

  ppeSlider.addEventListener("input", () => {
    ppeDisplay.textContent = parseFloat(ppeSlider.value).toFixed(1) + " μmol/J";
    refresh();
  });

  priceInput.addEventListener("input", refresh);

  dliSlider.addEventListener("input", () => {
    dliDisplay.textContent =
      parseFloat(dliSlider.value).toFixed(1) + " mol/m²/d";
    refresh();
  });

  refresh();
}

document.addEventListener("DOMContentLoaded", () => {
  for (let i = 0; i < 3; i++) {
    initScenario(i);
  }
});
