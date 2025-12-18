'use client';
import { useState } from 'react';
import FloatingMenu from './minibox';
import MapGoogle from './map';

export default function App() {
    const [path, setPath] = useState<{ distanceMeters: number; duration: string; polyline?: string } | null>(null);

    return (
        <div>

            <MapGoogle path={path} />
                <FloatingMenu setPathAction={setPath} />
        </div>
    );
}