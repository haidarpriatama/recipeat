// app/api/users/route.js
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { auth } from '@/lib/auth';

// Registrasi pengguna baru
export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Cek apakah email sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json({ message: 'Email already registered' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = newUser;

    return Response.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Mendapatkan detail pengguna berdasarkan ID
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return Response.json({ message: 'User ID required' }, { status: 400 });
    }
    
    // Hanya bisa melihat datanya sendiri (atau admin)
    if (Number(id) !== Number(session.user.id) && session.user.role !== 'ADMIN') {
      return Response.json({ message: 'Forbidden' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    const { password: _, ...userWithoutPassword } = user;
    return Response.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('GET /api/users error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Mengupdate pengguna
export async function PUT(request) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const { id, name, email } = await request.json();

    // Hanya bisa mengubah datanya sendiri
    if (Number(id) !== Number(session.user.id) && session.user.role !== 'ADMIN') {
      return Response.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email },
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return Response.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('PUT /api/users error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}