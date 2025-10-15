
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const pregnancies = await prisma.pregnancyTracking.findMany({
      where: { userId: session.user.id },
      include: {
        appointments: {
          orderBy: { scheduledDate: 'asc' },
        },
        weeklyProgress: {
          orderBy: { weekNumber: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return new Response(JSON.stringify({ pregnancies }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Get pregnancy error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la récupération des données de grossesse' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();
    const { lastPeriodDate, dueDate, weightStart, bloodType, notes } = data;

    if (!lastPeriodDate) {
      return new Response(JSON.stringify({ error: 'Date des dernières règles requise' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Calculate due date if not provided (280 days from last period)
    const calculatedDueDate = dueDate || new Date(
      new Date(lastPeriodDate).getTime() + 280 * 24 * 60 * 60 * 1000
    );

    // Calculate current week
    const weeksSinceStart = Math.floor(
      (new Date().getTime() - new Date(lastPeriodDate).getTime()) / 
      (1000 * 60 * 60 * 24 * 7)
    );

    // Deactivate any existing active pregnancies
    await prisma.pregnancyTracking.updateMany({
      where: { 
        userId: session.user.id,
        isActive: true 
      },
      data: { isActive: false },
    });

    const pregnancy = await prisma.pregnancyTracking.create({
      data: {
        userId: session.user.id,
        lastPeriodDate: new Date(lastPeriodDate),
        dueDate: new Date(calculatedDueDate),
        currentWeek: weeksSinceStart,
        currentDay: Math.floor((new Date().getTime() - new Date(lastPeriodDate).getTime()) / (1000 * 60 * 60 * 24)) % 7,
        weightStart: weightStart ? parseFloat(weightStart) : null,
        bloodType: bloodType || null,
        notes: notes || null,
        isActive: true,
      },
    });

    return new Response(JSON.stringify({ pregnancy }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Create pregnancy error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la création du suivi de grossesse' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
