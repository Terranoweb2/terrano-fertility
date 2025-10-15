
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

    const appointment = await prisma.pregnancyAppointment.create({
      data: {
        pregnancyId,
        appointmentType: data.appointmentType,
        scheduledDate: new Date(data.scheduledDate),
        doctorName: data.doctorName || null,
        location: data.location || null,
        notes: data.notes || null,
        results: data.results || null,
        completed: data.completed || false,
      },
    });

    return new Response(JSON.stringify({ appointment }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Create appointment error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la création du rendez-vous' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
