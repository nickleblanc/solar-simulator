const length = 10;
const width = 20;
const cost = 3.01;
const watts = 500;
const annualreturn = 2125;

export function calculateNumberOfPanels(area: number) {
  const numPanels = Math.floor(area / (length * width));
  const solarProduction = numPanels * watts;
  const costOfPanels = Math.round(cost * solarProduction * 100) / 100;
  const payback = costOfPanels / annualreturn;
  return { numPanels, solarProduction, costOfPanels, payback };
}
