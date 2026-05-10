import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import UserClientTable from "./UserClientTable";

export default async function AdminUsersPage({ searchParams }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const q = searchParams?.q || "";

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#2c2f30]">Users Management</h1>
        <p className="mt-2 text-[#595c5d]">Monitor roles and membership growth.</p>
      </div>

      <UserClientTable users={users} />
    </div>
  );
}
