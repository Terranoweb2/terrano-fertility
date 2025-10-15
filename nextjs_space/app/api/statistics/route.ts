
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
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
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    // Get temperature data for the last 3 months
    const temperatureData = await prisma.dailySymptom.findMany({
      where: {
        userId,
        date: { gte: threeMonthsAgo },
        temperature: { not: null }
      },
      orderBy: { date: 'asc' },
      select: {
        date: true,
        temperature: true
      }
    });

    // Get cycle length data
    const cycles = await prisma.menstrualCycle.findMany({
      where: {
        userId,
        cycleLength: { not: null }
      },
      orderBy: { startDate: 'desc' },
      take: 12,
      select: {
        cycleLength: true,
        startDate: true
      }
    });

    // Get mood distribution
    const moodData = await prisma.dailySymptom.groupBy({
      by: ['mood'],
      where: {
        userId,
        date: { gte: threeMonthsAgo },
        mood: { not: null }
      },
      _count: {
        mood: true
      }
    });

    // Get average pain levels
    const painStats = await prisma.dailySymptom.aggregate({
      where: {
        userId,
        date: { gte: threeMonthsAgo }
      },
      _avg: {
        cramps: true,
        headache: true,
        breastTenderness: true,
        backPain: true
      }
    });

    // Calculate monthly stats
    const totalSymptoms = await prisma.dailySymptom.count({
      where: {
        userId,
        date: { gte: threeMonthsAgo }
      }
    });

    const averageTemperature = temperatureData?.reduce((sum, item) => sum + (item.temperature || 0), 0) / temperatureData?.length || 0;
    const averageCycleLength = cycles?.reduce((sum, cycle) => sum + (cycle.cycleLength || 0), 0) / cycles?.length || 0;
    const regularCycles = cycles?.filter(cycle => cycle.cycleLength && cycle.cycleLength >= 21 && cycle.cycleLength <= 35)?.length || 0;

    // Format data for charts
    const formattedTemperatureData = temperatureData?.map((item, index) => ({
      date: `J${index + 1}`,
      temperature: item.temperature || 0
    })) || [];

    const formattedCycleLengthData = cycles?.map((cycle, index) => ({
      cycle: `C${cycles.length - index}`,
      length: cycle.cycleLength || 0
    })).reverse() || [];

    const formattedMoodData = moodData?.map((item) => ({
      mood: item.mood === 'happy' ? 'Heureuse' : 
            item.mood === 'normal' ? 'Normale' :
            item.mood === 'sad' ? 'Triste' :
            item.mood === 'irritable' ? 'Irritable' :
            item.mood === 'anxious' ? 'Anxieuse' : 'Autre',
      count: item._count?.mood || 0
    })).filter(item => item.count > 0) || [];

    const formattedPainData = [
      { type: 'Crampes', average: Math.round((painStats?._avg?.cramps || 0) * 10) / 10 },
      { type: 'Maux de tête', average: Math.round((painStats?._avg?.headache || 0) * 10) / 10 },
      { type: 'Seins sensibles', average: Math.round((painStats?._avg?.breastTenderness || 0) * 10) / 10 },
      { type: 'Dos', average: Math.round((painStats?._avg?.backPain || 0) * 10) / 10 },
    ].filter(item => item.average > 0);

    return NextResponse.json({
      temperatureData: formattedTemperatureData,
      cycleLengthData: formattedCycleLengthData,
      moodData: formattedMoodData,
      painData: formattedPainData,
      monthlyStats: {
        averageCycleLength: Math.round(averageCycleLength),
        averageTemperature: Math.round(averageTemperature * 10) / 10,
        totalSymptoms,
        regularCycles
      }
    });

  } catch (error) {
    console.error('Statistics error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des statistiques' },
      { status: 500 }
    );
  }
}
