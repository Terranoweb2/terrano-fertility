
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const reminderId = params.id;
    const body = await req.json();

    // Check if reminder exists and belongs to user
    const existingReminder = await prisma.reminder.findFirst({
      where: {
        id: reminderId,
        userId: session.user.id
      }
    });

    if (!existingReminder) {
      return NextResponse.json(
        { error: 'Rappel non trouvé' },
        { status: 404 }
      );
    }

    const updatedReminder = await prisma.reminder.update({
      where: { id: reminderId },
      data: {
        isActive: body.isActive !== undefined ? body.isActive : existingReminder.isActive,
      }
    });

    return NextResponse.json({
      message: 'Rappel mis à jour avec succès',
      reminder: updatedReminder
    });

  } catch (error) {
    console.error('Update reminder error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du rappel' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const reminderId = params.id;

    // Check if reminder exists and belongs to user
    const existingReminder = await prisma.reminder.findFirst({
      where: {
        id: reminderId,
        userId: session.user.id
      }
    });

    if (!existingReminder) {
      return NextResponse.json(
        { error: 'Rappel non trouvé' },
        { status: 404 }
      );
    }

    await prisma.reminder.delete({
      where: { id: reminderId }
    });

    return NextResponse.json({
      message: 'Rappel supprimé avec succès'
    });

  } catch (error) {
    console.error('Delete reminder error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du rappel' },
      { status: 500 }
    );
  }
}
