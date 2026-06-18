const CROPS = {
  lettuce: {
    name: "Butterhead Lettuce",
    a: -0.04092229230971666,
    b: 1.2642707610303354,
    c: -4.234700925228773,
    T: 21,
    P_crop: 5.00,
    color: "#2a7f62",
    colorLight: "rgba(42, 127, 98, 0.12)",
  },
  basil: {
    name: "Basil",
    a: -0.005368313135116408,
    b: 0.2730316756345265,
    c: -0.8078357512023415,
    T: 21,
    P_crop: 18.00,
    color: "#7b5ea7",
    colorLight: "rgba(123, 94, 167, 0.12)",
  },
  strawberry: {
    name: "Strawberry",
    a: -0.005718011156301032,
    b: 0.5882867486765386,
    c: -3.0643072764844237,
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
