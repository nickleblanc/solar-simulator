"use server";

export async function getRoofSegments(latitude: number, longitude: number) {
  if (!process.env.GOOGLE_SOLAR_API_KEY) {
    return { error: "No API key found." };
  }
  try {
    const data = await fetch(
      `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${latitude}&location.longitude=${longitude}&key=${process.env.GOOGLE_SOLAR_API_KEY}`,
      { cache: "force-cache" }
    );
    const response = await data.json();
    const roofSegments = response.solarPotential.roofSegmentStats;
    const roofArea = response.solarPotential.wholeRoofStats.areaMeters2;

    return { roofSegments, roofArea };
  } catch (error) {
    return { error: "No location found." };
  }
}
