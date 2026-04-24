// app/api/mealplan/route.js
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Mendapatkan semua meal plans (hanya milik user)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const mealPlans = await prisma.mealPlan.findMany({
      where: { userId: Number(session.user.id) }
    });
    return Response.json(mealPlans, { status: 200 });
  } catch (error) {
    console.error('GET /api/mealplan error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Menambahkan meal plan baru
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const { weekStart } = await request.json();
    const newMealPlan = await prisma.mealPlan.create({
      data: { userId: Number(session.user.id), weekStart },
    });
    return Response.json(newMealPlan, { status: 201 });
  } catch (error) {
    console.error('POST /api/mealplan error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Menghapus meal plan
export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = await request.json();
    
    // Pastikan meal plan milik user tersebut
    const deletedMealPlan = await prisma.mealPlan.deleteMany({
      where: { id: Number(id), userId: Number(session.user.id) },
    });
    
    return Response.json(deletedMealPlan, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/mealplan error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}