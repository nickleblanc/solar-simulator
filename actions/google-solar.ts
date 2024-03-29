// "use server";

import { Segment } from "@/types/segment";

const API_KEY = "AIzaSyCLNTEwwzO2ni2D675At4AXrqXE0pKnX7w";

// export async function getGoogleSolar(latitude: string, longitude: string) {
//   const data = await fetch(
//     `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${latitude}&location.longitude=${longitude}&key=${API_KEY}`
//   );
//   return data.json();
// }

export async function getRoofArea(latitude: number, longitude: number) {
  const data = await fetch(
    `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${latitude}&location.longitude=${longitude}&key=${API_KEY}`,
    { cache: "force-cache" }
  );
  const response = await data.json();
  const roofArea = response.solarPotential.wholeRoofStats.areaMeters2;

  return roofArea;
}

export async function getRoofSegments(
  latitude: number,
  longitude: number
): Promise<Segment[]> {
  const data = await fetch(
    `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${latitude}&location.longitude=${longitude}&key=${API_KEY}`,
    { cache: "force-cache" }
  );
  const response = await data.json();
  const roofSegments = response.solarPotential.roofSegmentStats;

  return roofSegments;
}
