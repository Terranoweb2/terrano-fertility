
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();
    const { notifications, privacy } = body;

    // Update user preferences
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        notificationPreferences: notifications,
        privacySettings: privacy,
      },
    });

    return NextResponse.json({ 
      message: 'Préférences mises à jour avec succès'
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour des préférences' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        notificationPreferences: true,
        privacySettings: true,
      },
    });

    return NextResponse.json({
      notifications: user?.notificationPreferences || {},
      privacy: user?.privacySettings || {},
    });
  } catch (error) {
    console.error('Error getting preferences:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des préférences' }, { status: 500 });
  }
}
