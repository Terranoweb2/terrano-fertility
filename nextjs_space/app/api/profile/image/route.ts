
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { uploadFile, deleteFile, getFileUrl } from '@/lib/s3';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Le fichier ne doit pas dépasser 5MB' }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Delete old profile image if exists
    if (user.profileImage) {
      try {
        await deleteFile(user.profileImage);
      } catch (error) {
        console.error('Error deleting old profile image:', error);
      }
    }

    // Upload new image
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `profile-images/${user.id}-${Date.now()}.${file.name.split('.').pop()}`;
    const cloud_storage_path = await uploadFile(buffer, fileName);

    // Update user profile
    await prisma.user.update({
      where: { email: session.user.email },
      data: { profileImage: cloud_storage_path },
    });

    // Get signed URL for the uploaded image
    const imageUrl = await getFileUrl(cloud_storage_path);

    return NextResponse.json({ 
      message: 'Photo de profil mise à jour avec succès',
      imageUrl,
      cloud_storage_path
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return NextResponse.json({ error: 'Erreur lors du téléchargement de l\'image' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { profileImage: true },
    });

    if (!user || !user.profileImage) {
      return NextResponse.json({ imageUrl: null });
    }

    const imageUrl = await getFileUrl(user.profileImage);
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error getting profile image:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération de l\'image' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    if (user.profileImage) {
      await deleteFile(user.profileImage);
      await prisma.user.update({
        where: { email: session.user.email },
        data: { profileImage: null },
      });
    }

    return NextResponse.json({ message: 'Photo de profil supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting profile image:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression de l\'image' }, { status: 500 });
  }
}
