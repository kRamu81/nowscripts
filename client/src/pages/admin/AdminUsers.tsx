import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/Auth";
import { httpRequest } from "../../interceptor/axiosInterceptor";
import { url } from "../../baseUrl";
import { ShieldAlert, ShieldCheck, MoreVertical, Ban, Trash2, KeyRound, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

type UserRole = "User" | "Admin" | "Super Admin";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  authProviders: string[];
  createdAt: string;
}

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const isSuperAdmin = user?.role === "Super Admin" || user?.email === "mowadmin@gmail.com";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await httpRequest.get(`${url}/admin/users`);
      setUsers(res.data.users);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (userId: string) => {
    try {
      const res = await httpRequest.patch(`${url}/admin/users/${userId}/status`);
      setUsers(users.map(u => u._id === userId ? { ...u, isActive: res.data.isActive } : u));
      toast.success(res.data.isActive ? "User activated" : "User disabled");
    } catch (error) {
      toast.error("Failed to update status");
    }
    setOpenDropdown(null);
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await httpRequest.delete(`${url}/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      toast.success("User deleted permanently");
    } catch (error) {
      toast.error("Failed to delete user");
    }
    setOpenDropdown(null);
  };

  const resetPassword = async (userId: string) => {
    try {
      const res = await httpRequest.post(`${url}/admin/users/${userId}/reset-password`);
      toast.success(res.data.message || "Password reset successful");
    } catch (error) {
      toast.error("Failed to reset password");
    }
    setOpenDropdown(null);
  };

  const changeRole = async (userId: string, newRole: UserRole) => {
    try {
      const res = await httpRequest.patch(`${url}/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: res.data.role } : u));
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      toast.error("Failed to update role");
    }
    setOpenDropdown(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all users in your platform including their name, role, email and status.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg bg-white">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Joined</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{u.name}</div>
                              <div className="text-gray-500">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            u.role === 'Super Admin' ? 'bg-purple-100 text-purple-800' :
                            u.role === 'Admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {u.isActive ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          {u._id !== user?._id && (
                            <div className="relative inline-block text-left">
                              <button
                                onClick={() => setOpenDropdown(openDropdown === u._id ? null : u._id)}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                              >
                                <MoreVertical className="h-5 w-5" />
                              </button>
                              
                              {openDropdown === u._id && (
                                <>
                                  <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)}></div>
                                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                      <button onClick={() => toggleStatus(u._id)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        {u.isActive ? <Ban className="mr-3 h-4 w-4 text-red-500"/> : <CheckCircle2 className="mr-3 h-4 w-4 text-green-500"/>}
                                        {u.isActive ? "Disable User" : "Enable User"}
                                      </button>
                                      
                                      <button onClick={() => resetPassword(u._id)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <KeyRound className="mr-3 h-4 w-4 text-gray-500"/>
                                        Reset Password
                                      </button>

                                      {isSuperAdmin && (
                                        <>
                                          <div className="border-t border-gray-100 my-1"></div>
                                          {u.role !== 'Admin' && (
                                            <button onClick={() => changeRole(u._id, "Admin")} className="w-full text-left flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-gray-100">
                                              <ShieldCheck className="mr-3 h-4 w-4"/> Make Admin
                                            </button>
                                          )}
                                          {u.role !== 'User' && (
                                            <button onClick={() => changeRole(u._id, "User")} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                              <ShieldAlert className="mr-3 h-4 w-4"/> Make User
                                            </button>
                                          )}
                                          <button onClick={() => deleteUser(u._id)} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50">
                                            <Trash2 className="mr-3 h-4 w-4"/> Delete User
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
