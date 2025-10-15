
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const educationalContent = await prisma.educationalContent.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
    });

    return NextResponse.json(educationalContent);

  } catch (error) {
    console.error('Get educational content error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement du contenu éducatif' },
      { status: 500 }
    );
  }
}
