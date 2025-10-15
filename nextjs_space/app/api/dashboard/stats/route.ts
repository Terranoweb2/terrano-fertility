
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();

    // Get current cycle
    const currentCycle = await prisma.menstrualCycle.findFirst({
      where: {
        userId,
        startDate: { lte: now },
        OR: [
          { endDate: null },
          { endDate: { gte: now } }
        ]
      },
      orderBy: { startDate: 'desc' }
    });

    // Calculate current cycle day
    let currentCycleDay = null;
    if (currentCycle) {
      const startDate = new Date(currentCycle.startDate);
      const diffTime = Math.abs(now.getTime() - startDate.getTime());
      currentCycleDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    // Get user's average cycle length for predictions
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { averageCycleLength: true }
    });

    // Calculate next period prediction
    let nextPeriodDays = null;
    if (currentCycle && user?.averageCycleLength && currentCycleDay) {
      const daysRemaining = user.averageCycleLength - currentCycleDay;
      nextPeriodDays = daysRemaining > 0 ? daysRemaining : 0;
    }

    // Check if in fertile window (days 10-16 of cycle for 28-day average)
    const fertileWindow = currentCycleDay ? 
      (currentCycleDay >= 10 && currentCycleDay <= 16) : false;

    // Count symptoms this month
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const totalSymptoms = await prisma.dailySymptom.count({
      where: {
        userId,
        date: { gte: firstDayOfMonth }
      }
    });

    // Count active reminders
    const activeReminders = await prisma.reminder.count({
      where: {
        userId,
        isActive: true
      }
    });

    return NextResponse.json({
      currentCycle: currentCycleDay,
      nextPeriodDays,
      fertileWindow,
      totalSymptoms,
      activeReminders
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des statistiques' },
      { status: 500 }
    );
  }
}
