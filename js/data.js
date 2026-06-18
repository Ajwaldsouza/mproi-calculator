const CROPS = {
  lettuce: {
    name: "Butterhead Lettuce",
    Y_max: 11.06,
    k: 0.0436,
    T: 21,
    P_crop: 5.00,
    color: "#2a7f62",
    colorLight: "rgba(42, 127, 98, 0.12)",
  },
  basil: {
    name: "Basil",
    Y_max: 12.50,
    k: 0.0117,
    T: 21,
    P_crop: 18.00,
    color: "#7b5ea7",
    colorLight: "rgba(123, 94, 167, 0.12)",
  },
  strawberry: {
    name: "Strawberry",
    Y_max: 58.37,
    k: 0.005,
    T: 125,
    P_crop: 8.00,
    color: "#c45c3c",
    colorLight: "rgba(196, 92, 60, 0.12)",
  },
};

const LOCATIONS = {
  netherlands: { name: "Netherlands", C_elec: 0.200, COP: 7.5 },
  sweden: { name: "Sweden", C_elec: 0.120, COP: 10 },
  uae: { name: "UAE", C_elec: 0.080, COP: 3.7 },
};

const K_SPECTRUM = 4.556;

const DLI_MIN = 4;
const DLI_MAX = 24;
const DLI_PLOT_STEPS = 200;
