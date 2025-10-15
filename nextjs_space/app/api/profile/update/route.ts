
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
    const { firstName, lastName, dateOfBirth, averageCycleLength, averagePeriodLength, language, country } = body;

    // Update user profile
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: `${firstName} ${lastName}`,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        averageCycleLength: averageCycleLength ? parseInt(averageCycleLength) : null,
        averagePeriodLength: averagePeriodLength ? parseInt(averagePeriodLength) : null,
        language: language || null,
        country: country || null,
      },
    });

    return NextResponse.json({ 
      message: 'Profil mis à jour avec succès',
      user: {
        name: `${firstName} ${lastName}`,
        dateOfBirth,
        averageCycleLength,
        averagePeriodLength,
        language,
        country,
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du profil' }, { status: 500 });
  }
}
