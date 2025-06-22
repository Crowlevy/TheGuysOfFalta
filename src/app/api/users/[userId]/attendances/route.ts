import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.id !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!start || !end) {
      return NextResponse.json({ error: 'Missing date range parameters' }, { status: 400 });
    }

    const attendances = await prisma.attendance.findMany({
      where: {
        userId: params.userId,
        date: {
          gte: new Date(start).toISOString(),
          lte: new Date(end).toISOString(),
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(attendances);
  } catch (error) {
    console.error('Error fetching user attendances:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 