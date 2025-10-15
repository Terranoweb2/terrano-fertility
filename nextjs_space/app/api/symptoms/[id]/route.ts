
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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const symptomId = params.id;
    const body = await req.json();
    const validatedData = symptomSchema.parse(body);

    // Check if symptom exists and belongs to user
    const existingSymptom = await prisma.dailySymptom.findFirst({
      where: {
        id: symptomId,
        userId: session.user.id
      }
    });

    if (!existingSymptom) {
      return NextResponse.json(
        { error: 'Symptôme non trouvé' },
        { status: 404 }
      );
    }

    const updatedSymptom = await prisma.dailySymptom.update({
      where: { id: symptomId },
      data: {
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
      message: 'Symptômes mis à jour avec succès',
      symptom: updatedSymptom
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Données invalides' },
        { status: 400 }
      );
    }

    console.error('Update symptom error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des symptômes' },
      { status: 500 }
    );
  }
}
