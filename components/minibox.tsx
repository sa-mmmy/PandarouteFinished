'use client';
import { useState } from "react";
import { FaCar, FaWalking, FaBicycle, FaBus } from "react-icons/fa";
import { PiPathBold } from "react-icons/pi";
import { BsGeoAltFill } from "react-icons/bs";
import { TbDotsVertical } from "react-icons/tb";
import { FiTarget } from "react-icons/fi";


type FloatingMenuProps = {
    setPathAction: React.Dispatch<React.SetStateAction<{ distanceMeters: number; duration: string; polyline?: string } | null>>;
};

export default function FloatingMenu({ setPathAction }: FloatingMenuProps) {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [fromSuggestions, setFromSuggestions] = useState<{ address: string }[]>([]);
    const [toSuggestions, setToSuggestions] = useState<{ address: string }[]>([]);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
    const [path, setPathState] = useState<{ distanceMeters: number; duration: string; polyline?: string } | null>(null);
    const [carbonData, setCarbonData] = useState<{ emissions: number } | null>(null);
    const [selectedTransport, setSelectedTransport] = useState<number>(6);
    const [mode, setMode] = useState("DRIVE");

    /**
     * Formats the duration string (in seconds) into a more readable format (e.g., "1h 30m").
     * @param duration - The duration string in seconds (e.g., "3600s").
     * @returns A formatted string representing the duration in hours and minutes.
     */
    const formatDuration = (duration: string) => {
        const totalMinutes = Math.floor(parseInt(duration.replace("s", "")) / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };

    /**
     * Fetches address suggestions based on user input.
     * @param input - The user's input string.
     * @param setFunction - The state setter function to update suggestions.
     */
    const fetchSuggestions = async (
        input: string,
        setFunction: React.Dispatch<React.SetStateAction<{ address: string }[]>>
    ) => {
        if (!input) return setFunction([]);

        const response = await fetch(`/api/autocomplete?query=${encodeURIComponent(input)}`);
        const data = await response.json();

        const suggestions = data.suggestions?.map((item: any) => ({
            address: `${item.placePrediction.structuredFormat.mainText.text}, ${item.placePrediction.structuredFormat.secondaryText.text}`,
        })) || [];

        setFunction(suggestions);
    };

    /**
     * Handles user input changes and fetches suggestions after a delay.
     * @param value - The current input value.
     * @param setValue - The state setter function for the input value.
     * @param setSuggestions - The state setter function for suggestions.
     */
    const handleInputChange = (
        value: string,
        setValue: React.Dispatch<React.SetStateAction<string>>,
        setSuggestions: React.Dispatch<React.SetStateAction<{ address: string }[]>>
    ) => {
        setValue(value);
        if (typingTimeout) clearTimeout(typingTimeout);
        setTypingTimeout(
            setTimeout(() => fetchSuggestions(value, setSuggestions), 500) as unknown as NodeJS.Timeout
        );
    };

    /**
     * Fetches carbon emission data based on the distance and selected transport mode.
     * @param distanceMeters - The distance of the route in meters.
     */
    const getCarbonData = async (distanceMeters: number) => {
        try {
            const km = distanceMeters / 1000;
            const response = await fetch(`/api/carbon?km=${km}&transports=${selectedTransport}`);
            const data = await response.json();

            if (response.ok) {
                setCarbonData({ emissions: parseFloat(data.data[0].value.toFixed(2)) });
            } else {
                console.error("Failed to fetch carbon data:", data.error);
                setCarbonData(null);
            }
        } catch (error) {
            console.error("Error fetching carbon data:", error);
            setCarbonData(null);
        }
    };

    /**
     * Fetches the route path between the origin and destination and updates the state.
     */
    const getPath = async () => {
        if (!from || !to) {
            alert("Veuillez saisir des adresses valides.");
            return;
        }

        const response = await fetch("/api/getPath", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from, to, mode }),
        });

        const data = await response.json();
        if (response.ok) {
            const encodedPath = data.routes[0].polyline.encodedPolyline;
            setPathState({ distanceMeters: data.routes[0].distanceMeters, duration: data.routes[0].duration, polyline : encodedPath });
            setPathAction({
                distanceMeters: data.routes[0].distanceMeters,
                duration: data.routes[0].duration,
                polyline: data.routes[0].polyline.encodedPolyline
            });

            await getCarbonData(data.routes[0].distanceMeters);
        } else {
            alert("Erreur lors de la récupération de l'itinéraire.");
        }
    };

    /**
     * Saves the current trajectory to the user's profile.
     */
    const saveTrajectory = async () => {
        if (!path || !carbonData) return;

        try {
            const response = await fetch("/api/saveTrajectory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass user token
                },
                body: JSON.stringify({
                    distance: path.distanceMeters / 1000, // Convert to km
                    duration: path.duration,
                    carbon: carbonData.emissions,
                    beginning: from,
                    ending: to,
                }),
            });

            if (response.ok) {
                alert("Traject saved successfully!");
            } else {
                console.error("Failed to save trajectory:", await response.text());
                alert("Failed to save trajectory.");
            }
        } catch (error) {
            console.error("Error saving trajectory:", error);
            alert("An error occurred while saving the trajectory.");
        }
    };

    return (
        <div className="absolute top-20 left-6 bg-white p-6 rounded-2xl shadow-lg w-80">
            <div className="space-y-4">
                <div className="flex flex-row">
                    <div className="flex flex-col justify-around w-7 text-green-700">
                        <BsGeoAltFill />
                        <TbDotsVertical />
                        <FiTarget />
                    </div>
                    <div className="flex justify-between flex-col w-full">
                        <input
                            type="text"
                            placeholder="Départ"
                            value={from}
                            onChange={(e) => handleInputChange(e.target.value, setFrom, setFromSuggestions)}
                            className="w-full p-2 border rounded-lg"
                        />
                        {fromSuggestions.length > 0 && (
                            <ul className="absolute top-15 bg-white border w-full mt-1 rounded-lg shadow-lg z-10">
                                {fromSuggestions.map((s, index) => (
                                    <li key={index} className="p-2 cursor-pointer hover:bg-gray-200"
                                        onClick={() => {
                                            setFrom(s.address);
                                            setFromSuggestions([]);
                                        }}>
                                        {s.address}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="flex justify-between text-3xl w-fit ml-auto text-green-700">
                            <PiPathBold />
                        </div>
                        <input
                            type="text"
                            placeholder="Arrivée"
                            value={to}
                            onChange={(e) => handleInputChange(e.target.value, setTo, setToSuggestions)}
                            className="w-full p-2 border rounded-lg"
                        />
                        {toSuggestions.length > 0 && (
                            <ul className="absolute top-33 bg-white border w-full mt-1 rounded-lg shadow-lg z-10">
                                {toSuggestions.map((s, index) => (
                                    <li key={index} className="p-2 cursor-pointer hover:bg-gray-200"
                                        onClick={() => {
                                            setTo(s.address);
                                            setToSuggestions([]);
                                        }}>
                                        {s.address}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="flex justify-between text-xl text-green-700">
                    <FaCar
                        className={`cursor-pointer ${selectedTransport === 6 ? "text-orange-500" : ""}`}
                        onClick={() => { setSelectedTransport(6); setMode("DRIVE"); }}
                    />
                    <FaWalking
                        className={`cursor-pointer ${selectedTransport === 30 ? "text-orange-500" : ""}`}
                        onClick={() => { setSelectedTransport(30); setMode("WALK"); }}
                    />
                    <FaBicycle
                        className={`cursor-pointer ${selectedTransport === 7 ? "text-orange-500" : ""}`}
                        onClick={() => { setSelectedTransport(7); setMode("BICYCLE"); }}
                    />
                    <FaBus
                        className={`cursor-pointer ${selectedTransport === 3 ? "text-orange-500" : ""}`}
                        onClick={() => { setSelectedTransport(3); setMode("TRANSIT"); }}
                    />
                </div>

                <button
                    className="w-full bg-green-900 text-white py-2 rounded-lg hover:bg-green-800"
                    onClick={getPath}
                >
                    Trouver un itinéraire
                </button>

                {path && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                        <p className="text-lg font-semibold text-gray-800">Détails de l'itinéraire</p>
                        <p className="text-sm text-gray-600"><strong>Distance :</strong> {(path.distanceMeters / 1000).toFixed(2)} km</p>
                        <p className="text-sm text-gray-600"><strong>Durée :</strong> {formatDuration(path.duration)}</p>
                    </div>
                )}

                {carbonData && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                        <p className="text-lg font-semibold text-gray-800">Impact Carbone</p>
                        <p className="text-sm text-gray-600"><strong>Émissions de CO2 :</strong> {carbonData.emissions} kg</p>
                    </div>
                )}
            </div>
            {path && carbonData && localStorage.getItem('token') && (
                <button
                    className="w-full bg-green-900 text-white py-2 rounded-lg hover:bg-green-800  mt-4"
                    onClick={saveTrajectory}
                >
                    Sauvegarder le trajet
                </button>
            )}
        </div>
    );
}