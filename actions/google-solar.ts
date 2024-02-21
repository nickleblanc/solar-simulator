"use client";

const API_KEY = process.env.GOOGLE_API_KEY;

export async function getGoogleSolar(latitude: string, longitude: string) {
  const data = await fetch(
    `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${latitude}&location.longitude=${longitude}&key=${API_KEY}`
  );
  return data.json();
}

export async function getRoofArea(latitude: string, longitude: string) {
  const data = await fetch(
    `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${latitude}&location.longitude=${longitude}&key=${API_KEY}`,
    { cache: "force-cache" }
  );
  const response = await data.json();
  const roofArea = response.solarPotential.wholeRoofStats.areaMeters2;

  return roofArea;
}
