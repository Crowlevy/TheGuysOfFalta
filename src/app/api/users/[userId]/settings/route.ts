import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { Prisma } from "@prisma/client";

interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    badges: boolean;
  };
  display: {
    theme: string;
    language: string;
    timeFormat: string;
  };
}

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.id !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: params.userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const defaultSettings: UserSettings = {
      notifications: {
        email: true,
        push: true,
        badges: true,
      },
      display: {
        theme: 'system',
        language: 'pt-BR',
        timeFormat: '24h',
      },
    };

    // Parse user settings from JSON
    let userSettings: Partial<UserSettings> = {};
    if (user.settings && typeof user.settings === 'object') {
      userSettings = user.settings as Partial<UserSettings>;
    }

    // Merge default settings with user settings
    const finalSettings: UserSettings = {
      notifications: { 
        ...defaultSettings.notifications, 
        ...(userSettings.notifications || {}) 
      },
      display: { 
        ...defaultSettings.display, 
        ...(userSettings.display || {}) 
      },
    };

    return NextResponse.json(finalSettings);
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.id !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { notifications, display } = body;

    // Validate the incoming data structure
    if (!notifications || !display) {
      return NextResponse.json({ error: 'Invalid settings format' }, { status: 400 });
    }

    const settingsData: Prisma.JsonObject = {
      notifications,
      display,
    };

    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: {
        settings: settingsData,
      },
      select: {
        settings: true,
      },
    });

    return NextResponse.json(updatedUser.settings);
  } catch (error) {
    console.error('Error updating user settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}