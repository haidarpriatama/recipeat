// app/api/recipes/route.js
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Mendapatkan semua resep
export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      include: { ingredients: true },
    });
    return Response.json(recipes, { status: 200 });
  } catch (error) {
    console.error('GET /api/recipes error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Menambahkan resep baru
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const { title, description, cookTime, categoryId, imageUrl } = await request.json();
    const newRecipe = await prisma.recipe.create({
      data: { title, description, cookTime, categoryId, imageUrl },
    });
    return Response.json(newRecipe, { status: 201 });
  } catch (error) {
    console.error('POST /api/recipes error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Mengupdate resep
export async function PUT(request) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const { id, title, description, cookTime, categoryId, imageUrl } = await request.json();
    const updatedRecipe = await prisma.recipe.update({
      where: { id },
      data: { title, description, cookTime, categoryId, imageUrl },
    });
    return Response.json(updatedRecipe, { status: 200 });
  } catch (error) {
    console.error('PUT /api/recipes error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Menghapus resep
export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = await request.json();
    const deletedRecipe = await prisma.recipe.delete({
      where: { id },
    });
    return Response.json(deletedRecipe, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/recipes error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}