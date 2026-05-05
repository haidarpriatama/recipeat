import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: { recipe: { include: { category: true } } },
    });
    return Response.json(favorites);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Ensure user exists in our DB (Fail-safe)
    await prisma.user.upsert({
      where: { id: session.user.id },
      update: {},
      create: { 
        id: session.user.id, 
        email: session.user.email, 
        name: session.user.name || session.user.email 
      },
    });

    const { recipeId } = await request.json();
    
    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_recipeId: {
          userId: session.user.id,
          recipeId: Number(recipeId),
        },
      },
    });

    if (existing) {
      // Toggle off
      await prisma.favorite.delete({
        where: {
          userId_recipeId: {
            userId: session.user.id,
            recipeId: Number(recipeId),
          },
        },
      });
      return Response.json({ favorited: false });
    } else {
      // Toggle on
      await prisma.favorite.create({
        data: {
          userId: session.user.id,
          recipeId: Number(recipeId),
        },
      });
      return Response.json({ favorited: true });
    }
  } catch (error) {
    console.error('Favorite API Error:', error);
    return Response.json({ error: 'Failed to toggle favorite' }, { status: 500 });
  }
}
