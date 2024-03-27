interface BoundingBox {
  sw: { latitude: number; longitude: number };
  ne: { latitude: number; longitude: number };
}

export interface Segment {
  azimuthDegrees: number;
  boundingBox: BoundingBox;
  center: { lat: number; lng: number };
  pitchDegrees: number;
  planeHeightAtCenterMeters: number;
  stats: {
    areaMeters2: number;
    groundAreaMeters2: number;
    sunshineQuantiles: number[];
  };
}
