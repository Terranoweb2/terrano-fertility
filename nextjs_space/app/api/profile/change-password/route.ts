
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.hashedPassword) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.hashedPassword);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Le mot de passe actuel est incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { email: session.user.email },
      data: { hashedPassword },
    });

    return NextResponse.json({ 
      message: 'Mot de passe mis à jour avec succès' 
    });

  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Erreur lors du changement de mot de passe' },
      { status: 500 }
    );
  }
}
