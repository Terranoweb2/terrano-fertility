
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' },
      take: 50, // Last 50 messages
    });

    return new Response(JSON.stringify({ messages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Chat history error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la récupération de l\'historique' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await prisma.chatMessage.deleteMany({
      where: { userId: session.user.id },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Delete chat history error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la suppression de l\'historique' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
