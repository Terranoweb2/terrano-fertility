
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Get all user data
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        cycles: true,
        symptoms: true,
        reminders: true,
        pregnancies: {
          include: {
            appointments: true,
            weeklyProgress: true,
          },
        },
        chatMessages: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Remove sensitive data
    const { hashedPassword, ...userData } = user;

    // Create export data
    const exportData = {
      exportDate: new Date().toISOString(),
      user: userData,
    };

    // Return as JSON file
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="terrano-fertility-export-${Date.now()}.json"`,
      },
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'exportation des données' }, { status: 500 });
  }
}
