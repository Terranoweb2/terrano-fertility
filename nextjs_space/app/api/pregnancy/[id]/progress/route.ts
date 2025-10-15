
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();
    const pregnancyId = params.id;

    // Verify pregnancy belongs to user
    const pregnancy = await prisma.pregnancyTracking.findFirst({
      where: { 
        id: pregnancyId,
        userId: session.user.id,
      },
    });

    if (!pregnancy) {
      return new Response(JSON.stringify({ error: 'Grossesse non trouvée' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const progress = await prisma.pregnancyWeeklyProgress.upsert({
      where: {
        pregnancyId_weekNumber: {
          pregnancyId,
          weekNumber: data.weekNumber,
        },
      },
      create: {
        pregnancyId,
        weekNumber: data.weekNumber,
        weight: data.weight ? parseFloat(data.weight) : null,
        bloodPressure: data.bloodPressure || null,
        babyMovements: data.babyMovements || null,
        symptoms: data.symptoms || [],
        mood: data.mood || null,
        notes: data.notes || null,
      },
      update: {
        weight: data.weight ? parseFloat(data.weight) : undefined,
        bloodPressure: data.bloodPressure || undefined,
        babyMovements: data.babyMovements || undefined,
        symptoms: data.symptoms || undefined,
        mood: data.mood || undefined,
        notes: data.notes || undefined,
      },
    });

    return new Response(JSON.stringify({ progress }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Create/update progress error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de l\'enregistrement du progrès' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
