
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PUT(
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

    const pregnancy = await prisma.pregnancyTracking.update({
      where: { 
        id: pregnancyId,
        userId: session.user.id,
      },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        lastPeriodDate: data.lastPeriodDate ? new Date(data.lastPeriodDate) : undefined,
        weightStart: data.weightStart ? parseFloat(data.weightStart) : undefined,
      },
    });

    return new Response(JSON.stringify({ pregnancy }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Update pregnancy error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la mise à jour de la grossesse' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function DELETE(
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

    await prisma.pregnancyTracking.delete({
      where: { 
        id: params.id,
        userId: session.user.id,
      },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Delete pregnancy error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la suppression de la grossesse' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
