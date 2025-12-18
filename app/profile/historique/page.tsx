'use client';

import { useEffect, useState } from 'react';

type Trajectory = {
    id: number;
    user_id: number;
    distance: number;
    duration: string;
    carbon_emissions: number;
    beginning: string;
    ending: string;
};

export default function Historique() {
    const [trajectories, setTrajectories] = useState<Trajectory[]>([]);
    const [loading, setLoading] = useState(true);

    /**
     * Fetches the user's trajectory history from the API.
     */
    const fetchTrajectories = async () => {
        try {
            const response = await fetch('/api/getHistory', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch trajectories');
            }

            const data = await response.json();
            setTrajectories(data);
        } catch (error) {
            console.error('Error fetching trajectories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrajectories();
    }, []);

    return (
        <div className="p-6 bg-card text-card-foreground rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-primary">Historique des Trajets</h1>

            {loading ? (
                <p className="text-muted">Chargement des données...</p>
            ) : trajectories.length === 0 ? (
                <p className="text-muted">Aucun trajet enregistré.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                        <thead className="bg-secondary text-secondary-foreground">
                        <tr>
                            <th className="p-3 border border-border">Départ</th>
                            <th className="p-3 border border-border">Arrivée</th>
                            <th className="p-3 border border-border">Distance (km)</th>
                            <th className="p-3 border border-border">Durée</th>
                            <th className="p-3 border border-border">Émissions CO2 (kg)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {trajectories.map((trajectory) => (
                            <tr key={trajectory.id} className="odd:bg-muted even:bg-card">
                                <td className="p-3 border border-border">{trajectory.beginning}</td>
                                <td className="p-3 border border-border">{trajectory.ending}</td>
                                <td className="p-3 border border-border">
                                    {trajectory.distance.toFixed(2)}
                                </td>
                                <td className="p-3 border border-border">{trajectory.duration}</td>
                                <td className="p-3 border border-border">
                                    {trajectory.carbon_emissions.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}