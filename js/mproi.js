function calcYield(DLI, a, b, c) {
  return a * DLI * DLI + b * DLI + c;
}

function calcRevenue(DLI, a, b, c, P_crop) {
  return calcYield(DLI, a, b, c) * P_crop;
}

function calcEnergyCost(DLI, T, PPE, COP, C_elec) {
  const beta = (COP + 1) / PPE - 1 / K_SPECTRUM;
  return (DLI * T) / (3.6 * COP) * beta * C_elec;
}

function calcMPROI(DLI, a, b, c, T, P_crop, PPE, COP, C_elec) {
  const revenue = calcRevenue(DLI, a, b, c, P_crop);
  const cost = calcEnergyCost(DLI, T, PPE, COP, C_elec);
  if (cost === 0) return Infinity;
  return revenue / cost;
}

function calcDLIOptimal(a, b, c, T, P_crop, PPE, COP, C_elec) {
  const beta = (COP + 1) / PPE - 1 / K_SPECTRUM;
  const gamma = (T * C_elec * beta) / (P_crop * 3.6 * COP);
  const B = b - gamma;
  const discriminant = B * B - 4 * a * c;
  if (discriminant < 0) return null;
  const sqrtD = Math.sqrt(discriminant);
  const root1 = (-B + sqrtD) / (2 * a);
  const root2 = (-B - sqrtD) / (2 * a);
  const dliOpt = Math.max(root1, root2);
  if (dliOpt <= 0) return null;
  return dliOpt;
}

function calcProfitPerDay(DLI, a, b, c, T, P_crop, PPE, COP, C_elec) {
  return (calcRevenue(DLI, a, b, c, P_crop) - calcEnergyCost(DLI, T, PPE, COP, C_elec)) / T;
}

function generateCurves(params) {
  const { a, b, c, T, P_crop, PPE, COP, C_elec } = params;
  const mproiData = [];
  const revenueData = [];
  const energyCostData = [];

  for (let i = 0; i <= DLI_PLOT_STEPS; i++) {
    const dli = DLI_MIN + (i / DLI_PLOT_STEPS) * (DLI_MAX - DLI_MIN);
    mproiData.push({
      x: dli,
      y: calcMPROI(dli, a, b, c, T, P_crop, PPE, COP, C_elec),
    });
    revenueData.push({
      x: dli,
      y: calcRevenue(dli, a, b, c, P_crop),
    });
    energyCostData.push({
      x: dli,
      y: calcEnergyCost(dli, T, PPE, COP, C_elec),
    });
  }

  const dliOpt = calcDLIOptimal(a, b, c, T, P_crop, PPE, COP, C_elec);
  const inRange = dliOpt !== null && dliOpt >= DLI_MIN && dliOpt <= DLI_MAX;

  return { mproiData, revenueData, energyCostData, dliOpt, dliOptInRange: inRange };
}
