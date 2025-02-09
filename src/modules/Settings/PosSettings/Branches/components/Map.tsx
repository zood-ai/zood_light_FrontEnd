import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import { useFormContext } from "react-hook-form";
import LocationIcon from "@/assets/icons/Location";

const LeafletMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerInstance = useRef<L.Marker | null>(null);
  const { watch, setValue } = useFormContext();

  const defaultLat = watch("latitude") || 24.756808; // Default latitude
  const defaultLng = watch("longitude") || 42.369873; // Default longitude

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      // Initialize the map
      const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 6);
      mapInstance.current = map;

      // Add a Tile Layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add a marker at the initial location
      const marker = L.marker([defaultLat, defaultLng]).addTo(map);
      marker.bindPopup(watch("name") || "Branch");
      markerInstance.current = marker;

      // Add geocoder control
      const geocoderControl = L.Control.geocoder({
        collapsed: false, // Keep the search bar visible
        geocoder: L.Control.Geocoder.nominatim(),
        defaultMarkGeocode: false,
      }).on("markgeocode", (e: any) => {
        const { center, name } = e.geocode;
        const { lat, lng } = center;

        // Update map and marker
        map.setView(center, 13);
        marker.setLatLng(center).bindPopup(name).openPopup();

        // Update form values
        setValue("latitude", lat, { shouldDirty: true, shouldValidate: true });
        setValue("longitude", lng, { shouldDirty: true, shouldValidate: true });
      });

      geocoderControl.addTo(map);

      // Handle click events
      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        marker
          .setLatLng([lat, lng])
          .bindPopup(`Lat: ${lat}, Lng: ${lng}`)
          .openPopup();

        // Update form values
        setValue("latitude", +lat, { shouldDirty: true, shouldValidate: true });
        setValue("longitude", +lng, { shouldDirty: true, shouldValidate: true });
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [defaultLat, defaultLng, setValue, watch]);

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
          <LocationIcon />
        </div>
        <h3 className="font-bold text-[16px] py-[24px]">Branch Location</h3>
      </div>
      <div ref={mapRef} style={{ height: "300px", width: "100%" }} />
    </>
  );
};

export default LeafletMap;
