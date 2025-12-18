import { NextRequest, NextResponse } from 'next/server';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache de 1h
const GOOGLE_MAPS_API_KEY = "AIzaSyC49QVBat3ATpNQ-Yj5EF0eWlhoEm6Dy4M";
const ROUTES_API_URL = "https://routes.googleapis.com/directions/v2:computeRoutes";
const GEOCODING_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";

async function getCoordinates(location: string | { lat: number, lng: number }) {
    if (typeof location === "object" && location.lat !== undefined && location.lng !== undefined) {
        return location;
    }

    if (typeof location === "string" && cache.has(location)) {
        return cache.get(location) as { lat: number; lng: number };
    }


    const url = `${GEOCODING_API_URL}?address=${encodeURIComponent(typeof location === "string" ? location : JSON.stringify(location))}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" || !data.results.length) {
        throw new Error(`Invalid address: ${location}`);
    }

    const coords = data.results[0].geometry.location;
    cache.set(typeof location === "string" ? location : JSON.stringify(location), coords);
    return coords;
}

export async function POST(req: NextRequest) {
    try {
        const { from, to, mode } = await req.json();
        if (!from || !to) {
            return NextResponse.json({ error: 'Missing from or to parameter' }, { status: 400 });
        }

        const originCoords = await getCoordinates(from);
        const destinationCoords = await getCoordinates(to);

        const requestBody = {
            origin: { location: { latLng: { latitude: originCoords.lat, longitude: originCoords.lng } } },
            destination: { location: { latLng: { latitude: destinationCoords.lat, longitude: destinationCoords.lng } } },
            travelMode: mode,
        };

        const response = await fetch(ROUTES_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
                "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!data.routes || data.routes.length === 0) {
            return NextResponse.json({ error: 'No route found', fullResponse : response }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: (error instanceof Error ? error.message : 'Failed to fetch data') }, { status: 500 });    }
}
