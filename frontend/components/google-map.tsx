"use client";

import { useLocationStore } from "@/stores/locations";
import { useFormValueStore } from "@/stores/form-values";
import { Card } from "@/components/ui/card";
import {
  APIProvider,
  Map,
  MapMouseEvent,
  Marker,
} from "@vis.gl/react-google-maps";

export function GoogleMap() {
  const locations = useLocationStore((state) => state.locations);
  const selectedLocations = locations.filter((location) => location.selected);
  const setFormValues = useFormValueStore((state) => state.setValues);

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!API_KEY) {
    throw new Error("Missing GOOGLE_MAPS_API_KEY");
  }

  async function onMapClick(ev: MapMouseEvent) {
    if (!ev.detail.latLng) return;
    setFormValues(ev.detail.latLng.lat, ev.detail.latLng.lng);
  }

  return (
    <Card className="w-full h-full">
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={{ lat: 45.946, lng: -66.638 }}
          defaultZoom={15}
          gestureHandling={"greedy"}
          disableDefaultUI={false}
          onClick={onMapClick}
          mapTypeId={"satellite"}
          className="rounded-md h-full w-full"
        >
          {selectedLocations.map((location) => (
            <Marker
              key={location.id}
              position={{
                lat: location.latitude,
                lng: location.longitude,
              }}
            />
          ))}
        </Map>
      </APIProvider>
    </Card>
  );
}
