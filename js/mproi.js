function calcMPROI(DLI, Y_max, k, T, P_crop, PPE, COP, C_elec) {
  const numerator = Y_max * (1 - Math.exp(-k * DLI)) * P_crop * 3.6 * COP;
  const beta = (COP + 1) / PPE - 1 / K_SPECTRUM;
  const denominator = DLI * T * C_elec * beta;
  return numerator / denominator;
}

function calcDLIOptimal(Y_max, k, T, P_crop, PPE, COP, C_elec) {
  const beta = (COP + 1) / PPE - 1 / K_SPECTRUM;
  const target = (T * C_elec * beta) / (Y_max * P_crop * 3.6 * COP);
  if (target >= k) return null;
  let lo = 0.001, hi = 500;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if ((1 - Math.exp(-k * mid)) / mid > target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

function calcYield(DLI, Y_max, k) {
  return Y_max * (1 - Math.exp(-k * DLI));
}

function calcRevenue(DLI, Y_max, k, P_crop) {
  return calcYield(DLI, Y_max, k) * P_crop;
}

function calcEnergyCost(DLI, T, PPE, COP, C_elec) {
  const beta = (COP + 1) / PPE - 1 / K_SPECTRUM;
  return (DLI * T) / (3.6 * COP) * beta * C_elec;
}

function calcProfitPerDay(DLI, Y_max, k, T, P_crop, PPE, COP, C_elec) {
  return (calcRevenue(DLI, Y_max, k, P_crop) - calcEnergyCost(DLI, T, PPE, COP, C_elec)) / T;
}

function generateCurves(params) {
  const { Y_max, k, T, P_crop, PPE, COP, C_elec } = params;
  const mproiData = [];
  const revenueData = [];
  const energyCostData = [];

  for (let i = 0; i <= DLI_PLOT_STEPS; i++) {
    const dli = DLI_MIN + (i / DLI_PLOT_STEPS) * (DLI_MAX - DLI_MIN);
    mproiData.push({
      x: dli,
      y: calcMPROI(dli, Y_max, k, T, P_crop, PPE, COP, C_elec),
    });
    revenueData.push({
      x: dli,
      y: calcRevenue(dli, Y_max, k, P_crop),
    });
    energyCostData.push({
      x: dli,
      y: calcEnergyCost(dli, T, PPE, COP, C_elec),
    });
  }

  const dliOpt = calcDLIOptimal(Y_max, k, T, P_crop, PPE, COP, C_elec);
  const inRange = dliOpt !== null && dliOpt >= DLI_MIN && dliOpt <= DLI_MAX;

  return { mproiData, revenueData, energyCostData, dliOpt, dliOptInRange: inRange };
}
