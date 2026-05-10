"use client";
import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { deleteUserAction, updateUserAction } from "./actions";

export default function UserClientTable({ users }) {
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    await updateUserAction(editItem.id, formData.get("name"), formData.get("role"));
    setEditItem(null);
    setIsSubmitting(false);
  };

  const handleDeleteSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await deleteUserAction(deleteItem.id);
    setDeleteItem(null);
    setIsSubmitting(false);
  };

  return (
    <>
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
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#595c5d]">Actions</th>
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
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditItem(user)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#006941] transition-colors hover:bg-[#f3fcf3]"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteItem(user)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#b31b25] transition-colors hover:bg-[#ffefee]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#595c5d]">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eff1f2] px-6 py-4">
              <h3 className="text-lg font-extrabold text-[#2c2f30]">Edit User</h3>
              <button onClick={() => setEditItem(null)} className="text-[#595c5d] hover:text-[#2c2f30]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#2c2f30]">Email (Read-only)</label>
                <input
                  type="email"
                  disabled
                  defaultValue={editItem.email}
                  className="w-full rounded-xl bg-[#eff1f2] px-4 py-3 text-[#595c5d] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-bold text-[#2c2f30]">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  defaultValue={editItem.name}
                  className="w-full rounded-xl border border-[#eff1f2] bg-white px-4 py-3 outline-none focus:border-[#006941] focus:ring-1 focus:ring-[#006941]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-bold text-[#2c2f30]">Role</label>
                <select
                  id="role"
                  name="role"
                  required
                  defaultValue={editItem.role}
                  className="w-full rounded-xl border border-[#eff1f2] bg-white px-4 py-3 outline-none focus:border-[#006941] focus:ring-1 focus:ring-[#006941]"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="rounded-xl px-5 py-2.5 text-sm font-bold text-[#595c5d] hover:bg-[#eff1f2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ color: "white" }}
                  className="rounded-xl bg-[#006941] px-5 py-2.5 text-sm font-bold shadow-md hover:bg-[#005c38] disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="p-6">
              <h3 className="mb-2 text-xl font-extrabold text-[#2c2f30]">Delete User?</h3>
              <p className="text-sm text-[#595c5d]">
                Are you sure you want to delete <span className="font-bold text-[#2c2f30]">{deleteItem.name}</span>? This will permanently remove their account and saved data.
              </p>
            </div>
            <div className="flex justify-end gap-3 bg-[#eff1f2]/50 px-6 py-4">
              <button
                type="button"
                onClick={() => setDeleteItem(null)}
                className="rounded-xl px-4 py-2 text-sm font-bold text-[#595c5d] hover:bg-[#e0e3e4]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={isSubmitting}
                style={{ color: "white" }}
                className="rounded-xl bg-[#b31b25] px-4 py-2 text-sm font-bold shadow-md hover:bg-[#92141c] disabled:opacity-50"
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
