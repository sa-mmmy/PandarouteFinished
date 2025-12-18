'use client';
import { LoadScript, GoogleMap } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';
import polyline from '@mapbox/polyline';

const containerStyle = {
    width: '100%',
    height: 'calc(100vh - 60px)',
};

const defaultCenter = {
    lat: 45.74846,
    lng: 4.84671,
};

const mapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    zoomControl: true,
};

type PathData = {
    distanceMeters: number;
    duration: string;
    polyline?: string;
};

export default function MapGoogle({ path }: { path: PathData | null }) {
    const [decodedPath, setDecodedPath] = useState<{ lat: number; lng: number }[]>([]);
    const mapRef = useRef<google.maps.Map | null>(null);
    const polylineRef = useRef<google.maps.Polyline | null>(null);
    const apiKey = "AIzaSyC49QVBat3ATpNQ-Yj5EF0eWlhoEm6Dy4M";

    // Decode the polyline when path changes
    useEffect(() => {
        if (path?.polyline) {
            try {
                const decoded = polyline
                    .decode(path.polyline)
                    .map(([lat, lng]) => ({ lat, lng }));
                setDecodedPath(decoded);
            } catch (err) {
                console.error("Failed to decode polyline:", err);
                setDecodedPath([]);
            }
        } else {
            setDecodedPath([]);
        }
    }, [path]);

    // Display or reset the polyline on the map
    useEffect(() => {
        if (!mapRef.current) return;

        // Clear previous polyline
        if (polylineRef.current) {
            polylineRef.current.setMap(null);
            polylineRef.current = null;
        }

        if (decodedPath.length > 0) {
            const newPolyline = new google.maps.Polyline({
                path: decodedPath,
                strokeColor: '#AE4204',
                strokeOpacity: 1,
                strokeWeight: 10,
                icons: [
                    {
                        icon: {
                            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                            scale: 3,
                            strokeColor: '#AE4204',
                        },
                        offset: '50%',
                    },
                ],
            });

            newPolyline.setMap(mapRef.current);
            polylineRef.current = newPolyline;

            // Fit bounds to new polyline
            const bounds = new google.maps.LatLngBounds();
            decodedPath.forEach((point) => bounds.extend(point));
            mapRef.current.fitBounds(bounds);
        } else {
            // Reset view if no path
            mapRef.current.setZoom(10);
            mapRef.current.setCenter(defaultCenter);
        }
    }, [decodedPath]);

    const handleMapLoad = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    if (!apiKey) {
        return <p>Error: Google Maps API key is missing. Please set it in your environment variables.</p>;
    }

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={10}
                options={mapOptions}
                onLoad={handleMapLoad}
            />
        </LoadScript>
    );
}
