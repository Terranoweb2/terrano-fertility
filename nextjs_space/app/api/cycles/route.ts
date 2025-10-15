
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const cycleSchema = z.object({
  startDate: z.string(),
  endDate: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const cycles = await prisma.menstrualCycle.findMany({
      where: { userId: session.user.id },
      orderBy: { startDate: 'desc' },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        periodLength: true,
        notes: true,
      }
    });

    return NextResponse.json(cycles);

  } catch (error) {
    console.error('Get cycles error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des cycles' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = cycleSchema.parse(body);

    const startDate = new Date(validatedData.startDate);
    const endDate = validatedData.endDate ? new Date(validatedData.endDate) : null;

    // Calculate period length if endDate provided
    let periodLength = null;
    if (endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      periodLength = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    const cycle = await prisma.menstrualCycle.create({
      data: {
        userId: session.user.id,
        startDate,
        endDate,
        periodLength,
        notes: validatedData.notes || null,
      }
    });

    return NextResponse.json({
      message: 'Cycle enregistré avec succès',
      cycle: {
        id: cycle.id,
        startDate: cycle.startDate,
        endDate: cycle.endDate,
        periodLength: cycle.periodLength,
        notes: cycle.notes,
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Données invalides' },
        { status: 400 }
      );
    }

    console.error('Create cycle error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement du cycle' },
      { status: 500 }
    );
  }
}
