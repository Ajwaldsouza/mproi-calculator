function calcMPROI(DLI, Y_max, k, T, P_crop, PPE, alpha, C_elec) {
  const numerator = 3.6 * PPE * Y_max * (1 - Math.exp(-k * DLI)) * P_crop;
  const denominator = alpha * T * C_elec;
  return numerator / denominator;
}

function calcDLIOptimal(Y_max, k, T, P_crop, PPE, alpha, C_elec) {
  const ratio = (alpha * T * C_elec) / (3.6 * PPE * Y_max * P_crop);
  if (ratio >= 1) return null;
  const arg = 1 - ratio;
  if (arg <= 0) return null;
  return -(1 / k) * Math.log(arg);
}

function calcYield(DLI, Y_max, k) {
  return Y_max * (1 - Math.exp(-k * DLI));
}

function calcProfitPerDay(DLI, Y_max, k, T, P_crop, PPE, alpha, C_elec) {
  const revenuePerCycle = calcYield(DLI, Y_max, k) * P_crop;
  const energyCostPerCycle =
    (DLI * alpha * T) / (3.6 * PPE) * C_elec;
  return (revenuePerCycle - energyCostPerCycle) / T;
}

function generateCurves(params) {
  const { Y_max, k, T, P_crop, PPE, alpha, C_elec } = params;
  const mproiData = [];
  const profitData = [];

  for (let i = 0; i <= DLI_PLOT_STEPS; i++) {
    const dli = DLI_MIN + (i / DLI_PLOT_STEPS) * (DLI_MAX - DLI_MIN);
    mproiData.push({
      x: dli,
      y: calcMPROI(dli, Y_max, k, T, P_crop, PPE, alpha, C_elec),
    });
    profitData.push({
      x: dli,
      y: calcProfitPerDay(dli, Y_max, k, T, P_crop, PPE, alpha, C_elec),
    });
  }

  const dliOpt = calcDLIOptimal(Y_max, k, T, P_crop, PPE, alpha, C_elec);
  const inRange = dliOpt !== null && dliOpt >= DLI_MIN && dliOpt <= DLI_MAX;

  return { mproiData, profitData, dliOpt, dliOptInRange: inRange };
}
