
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const reminderSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  type: z.string(),
  scheduledDate: z.string(),
  isRecurring: z.boolean().optional(),
  recurringType: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const reminders = await prisma.reminder.findMany({
      where: { userId: session.user.id },
      orderBy: { scheduledDate: 'asc' },
    });

    return NextResponse.json(reminders);

  } catch (error) {
    console.error('Get reminders error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des rappels' },
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
    const validatedData = reminderSchema.parse(body);

    const reminder = await prisma.reminder.create({
      data: {
        userId: session.user.id,
        title: validatedData.title,
        description: validatedData.description || null,
        type: validatedData.type,
        scheduledDate: new Date(validatedData.scheduledDate),
        isRecurring: validatedData.isRecurring || false,
        recurringType: validatedData.recurringType || null,
        isActive: true,
      }
    });

    return NextResponse.json({
      message: 'Rappel créé avec succès',
      reminder
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Données invalides' },
        { status: 400 }
      );
    }

    console.error('Create reminder error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du rappel' },
      { status: 500 }
    );
  }
}
