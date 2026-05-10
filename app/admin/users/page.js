import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#2c2f30]">Users Management</h1>
        <p className="mt-2 text-[#595c5d]">Monitor roles and membership growth.</p>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_-30px_rgba(44,47,48,0.25)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#eff1f2]/60">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#595c5d]">ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#595c5d]">Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#595c5d]">Email</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#595c5d]">Role</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#595c5d]">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eff1f2]">
              {users.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-[#f5f6f7]">
                  <td className="px-6 py-4 text-sm text-[#595c5d]">{user.id}</td>
                  <td className="px-6 py-4 font-semibold text-[#2c2f30]">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-[#595c5d]">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        user.role === "ADMIN" ? "bg-[#caffdc] text-[#006941]" : "bg-[#eff1f2] text-[#595c5d]"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#595c5d]">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-[#595c5d]">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
