import { NextRequest, NextResponse } from "next/server";

const GOOGLE_PLACES_API_URL = "https://places.googleapis.com/v1/places:autocomplete";
const GOOGLE_MAPS_API_KEY = "AIzaSyC49QVBat3ATpNQ-Yj5EF0eWlhoEm6Dy4M"; // Clé API sécurisée dans .env.local

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const input = searchParams.get("query");

        if (!input) {
            return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
        }

        const response = await fetch(GOOGLE_PLACES_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY
            },
            body: JSON.stringify({ input }),
        });

        const data = await response.json();

        if (!data.places || data.places.length === 0) {
            // Retourne toute la réponse pour analyse
            return NextResponse.json({ suggestions: data.suggestions, fullResponse: data  }, { status: 200 });
        }

        const suggestions = data.places.map((place: any) => ({
            address: place.displayName.text,
            place_id: place.id,
        }));

        return NextResponse.json({ suggestions }, { status: 200 });
    } catch (error) {
        console.error("Erreur API Places :", error);
        return NextResponse.json({ error: "Failed to fetch place suggestions" }, { status: 500 });
    }
}
