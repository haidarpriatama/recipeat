"use client";
import { useState } from "react";
import { X, Trash2, MailQuestion } from "lucide-react";
import { getUnverifiedUsersAction, deleteUnverifiedUserAction } from "./actions";

export default function UnverifiedUsersModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getUnverifiedUsersAction();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (isDeleting) return;
    setIsDeleting(id);
    try {
      await deleteUnverifiedUserAction(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <>
      <button 
        onClick={handleOpen}
        className="rounded-xl bg-[#eff1f2] px-6 py-3 text-[#2c2f30] transition-colors hover:bg-[#e0e3e4]"
      >
        Other
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eff1f2] px-6 py-4">
              <div className="flex items-center gap-3">
                <MailQuestion className="h-6 w-6 text-[#006941]" />
                <div>
                  <h3 className="text-lg font-extrabold text-[#2c2f30]">Pending Verifications</h3>
                  <p className="text-xs text-[#595c5d]">Users awaiting Supabase email confirmation</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[#595c5d] hover:text-[#2c2f30]">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <span className="animate-spin rounded-full h-8 w-8 border-4 border-[#006941] border-t-transparent"></span>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-[#595c5d]">
                  No unverified accounts found.
                </div>
              ) : (
                <ul className="divide-y divide-[#eff1f2] rounded-2xl border border-[#eff1f2]">
                  {users.map((u) => (
                    <li key={u.id} className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-[#f5f6f7]">
                      <div>
                        <p className="font-semibold text-[#2c2f30]">{u.name}</p>
                        <p className="text-sm text-[#595c5d]">{u.email}</p>
                        <p className="mt-1 text-xs text-[#595c5d] opacity-70">
                          Registered: {new Date(u.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(u.id)}
                        disabled={isDeleting === u.id}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#b31b25] transition-colors hover:bg-[#ffefee] disabled:opacity-50"
                        title="Delete from Supabase"
                      >
                        {isDeleting === u.id ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#b31b25] border-t-transparent"></span>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="bg-[#eff1f2]/50 px-6 py-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-5 py-2.5 text-sm font-bold text-[#595c5d] hover:bg-[#e0e3e4]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
