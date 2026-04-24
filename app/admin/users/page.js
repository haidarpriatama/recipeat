import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') redirect('/');

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Users Management</h1>
        <p className="text-slate-500 mt-2">View and manage all registered users in the application.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">ID</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">Name</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">Email</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">Role</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">Joined At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 text-slate-500">#{user.id}</td>
                  <td className="py-4 px-6 font-medium text-slate-900">{user.name}</td>
                  <td className="py-4 px-6 text-slate-600">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
