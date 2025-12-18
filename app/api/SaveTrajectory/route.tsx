import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ message: 'No token provided' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const body = await req.json();
        const { distance, duration, carbon, beginning, ending } = body;

        if (distance == null || duration == null || carbon == null || beginning == null || ending == null) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await pool.query(
            `INSERT INTO trajectories (user_id, distance, duration, carbon_emissions, beginning, ending)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [decoded.userId, distance, duration, carbon, beginning, ending]
        );

        return NextResponse.json({ message: 'Trajectory saved successfully' });

    } catch (error) {
        console.error('Error saving trajectory:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}