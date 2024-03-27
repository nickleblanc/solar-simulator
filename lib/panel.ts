const panelLength = 1;
const panelWidth = 2.015;
const costPerWatt = 2.0;
const watts = 385;
const annualReturn = 2125;

import { Segment } from "@/types/segment";

// export function calculateNumberOfPanels(area: number) {
//   const numPanels = Math.floor(area / (panelLength * panelWidth));
//   const solarProduction = numPanels * watts;
//   const costOfPanels = Math.round(costPerWatt * solarProduction * 100) / 100;
//   const payback = costOfPanels / annualReturn;
//   return { numPanels, solarProduction, costOfPanels, payback };
// }

// export function

export function calculateNumberOfPanels(segments: Segment[]) {
  let numberPanels = 0;
  for (let i = 0; i < segments.length; i++) {
    if (
      segments[i].pitchDegrees >= 2 &&
      segments[i].azimuthDegrees > 90 &&
      segments[i].azimuthDegrees < 270
    ) {
      numberPanels += calculateSegmentPanelNumber(
        segments[i].stats.areaMeters2,
        panelLength,
        panelWidth,
        false
      );
    } else if (segments[i].pitchDegrees < 2) {
      numberPanels += calculateSegmentPanelNumber(
        segments[i].stats.areaMeters2,
        panelLength,
        panelWidth,
        true
      );
    }
  }
  console.log(numberPanels);
  return numberPanels;
}

function calculateSegmentPanelNumber(
  area: number,
  panelLength: number,
  panelWidth: number,
  flatRoof: boolean
) {
  const segmentLength = Math.sqrt(area);
  const segmentWidth = Math.sqrt(area);
  if (flatRoof) {
    panelLength = calculatePanelSpacing(panelLength);
  }
  const segmentRows = Math.floor(segmentWidth / panelWidth);
  const segmentColumns = Math.floor(segmentLength / panelLength);
  return segmentRows * segmentColumns;
}

function calculatePanelSpacing(panelLength: number) {
  const h =
    (Math.sin((20 * Math.PI) / 180) * panelLength) /
    Math.tan((20 / 180) * Math.PI);
  return panelLength + h;
}
