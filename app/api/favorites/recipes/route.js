// app/api/favorites/recipes/route.js
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Mendapatkan semua favorit
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const favorites = await prisma.favorite.findMany({
      where: { userId: Number(session.user.id) },
      include: { recipe: true },
    });
    return Response.json(favorites, { status: 200 });
  } catch (error) {
    console.error('GET /api/favorites/recipes error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Menambahkan favorit
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const { recipeId } = await request.json();
    const favorite = await prisma.favorite.create({
      data: { userId: Number(session.user.id), recipeId: Number(recipeId) },
    });
    return Response.json(favorite, { status: 201 });
  } catch (error) {
    console.error('POST /api/favorites/recipes error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Menghapus favorit
export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const { recipeId } = await request.json();
    const favorite = await prisma.favorite.delete({
      where: { 
        userId_recipeId: { 
          userId: Number(session.user.id), 
          recipeId: Number(recipeId) 
        } 
      },
    });
    return Response.json(favorite, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/favorites/recipes error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}