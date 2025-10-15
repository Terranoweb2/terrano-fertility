
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const symptomSchema = z.object({
  date: z.string(),
  temperature: z.number().nullable().optional(),
  cervicalMucus: z.string().optional(),
  cramps: z.number().int().min(1).max(10).optional(),
  headache: z.number().int().min(1).max(10).optional(),
  breastTenderness: z.number().int().min(1).max(10).optional(),
  backPain: z.number().int().min(1).max(10).optional(),
  mood: z.string().optional(),
  energy: z.number().int().min(1).max(10).optional(),
  stress: z.number().int().min(1).max(10).optional(),
  flowHeaviness: z.string().optional(),
  flowColor: z.string().optional(),
  bloating: z.boolean().optional(),
  acne: z.boolean().optional(),
  foodCravings: z.string().optional(),
  sleep: z.number().int().min(1).max(10).optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    let whereClause: any = { userId: session.user.id };
    
    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      whereClause.date = {
        gte: startOfDay,
        lte: endOfDay
      };
    }

    const symptoms = await prisma.dailySymptom.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      take: date ? 1 : 30, // If specific date, get 1, otherwise get last 30
    });

    return NextResponse.json(symptoms);

  } catch (error) {
    console.error('Get symptoms error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des symptômes' },
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
    const validatedData = symptomSchema.parse(body);

    const symptomDate = new Date(validatedData.date);

    // Check if symptom for this date already exists
    const existingSymptom = await prisma.dailySymptom.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: new Date(symptomDate.setHours(0, 0, 0, 0)),
          lt: new Date(symptomDate.setHours(23, 59, 59, 999))
        }
      }
    });

    if (existingSymptom) {
      return NextResponse.json(
        { error: 'Des symptômes existent déjà pour cette date' },
        { status: 409 }
      );
    }

    const symptom = await prisma.dailySymptom.create({
      data: {
        userId: session.user.id,
        date: new Date(validatedData.date),
        temperature: validatedData.temperature,
        cervicalMucus: validatedData.cervicalMucus || null,
        cramps: validatedData.cramps,
        headache: validatedData.headache,
        breastTenderness: validatedData.breastTenderness,
        backPain: validatedData.backPain,
        mood: validatedData.mood || null,
        energy: validatedData.energy,
        stress: validatedData.stress,
        flowHeaviness: validatedData.flowHeaviness || null,
        flowColor: validatedData.flowColor || null,
        bloating: validatedData.bloating || false,
        acne: validatedData.acne || false,
        foodCravings: validatedData.foodCravings || null,
        sleep: validatedData.sleep,
        notes: validatedData.notes || null,
      }
    });

    return NextResponse.json({
      message: 'Symptômes enregistrés avec succès',
      symptom
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Données invalides' },
        { status: 400 }
      );
    }

    console.error('Create symptom error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement des symptômes' },
      { status: 500 }
    );
  }
}
