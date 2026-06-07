import { useEffect, useState } from "react";
import axios from "axios";
import {
  IoCloseOutline,
  IoSearchOutline,
  IoShieldOutline,
} from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import AdminSideBar from "../component/AdminSideBar";
import Navbar from "../component/Navbar";
import { IoIosArrowForward } from "react-icons/io";

interface User {
  fullName: string;
  id: number | string;
  email: string;
  createdAt: string; 
  phone?: string;
  status: "Active" | "Banned" | string;
  role: string;
}

interface Order {
  id: string | number;
  userId?: string | number;
  totalOrders: number;
}

interface SpendAmount {
  userId: string | number;
  totalAmount: number | string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [amounts, setAmounts] = useState<SpendAmount[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users/all-user");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch Orders 
  useEffect(() => {
    const fetchOrdersAndSpending = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/users/user-orders/`);
        const resAmount = await axios.get(`http://localhost:3000/order/spend-amount`);
        
        setOrders(res.data.orders);
        setAmounts(resAmount.data.spendAmount);
      } catch (err) {
        console.error("Error fetching orders/spending:", err);
      }
    };
    fetchOrdersAndSpending();
  }, []);

  // Filter Search
  const searchUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const selectedUserAmount = amounts.find(
    (s) => Number(s.userId) === Number(selectedUser?.id)
  )?.totalAmount || 0;

  const selectedUserOrders = orders.find(
    (o) => Number(o.id) === Number(selectedUser?.id)
  )?.totalOrders || 0;

  return (
    <>
      <main>
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        <div className="bg-[#f9efe7] dark:bg-black min-h-screen lg:flex">
          <aside className="hidden lg:block">
            <AdminSideBar />
          </aside>
          
          <section className="flex-1 px-5 lg:px-10 pt-5">
            <div className="flex justify-between items-center flex-wrap">
              <div className="mb-5">
                <span className="text-[12px] tracking-[4px] text-yellow-500 uppercase">
                  Members
                </span>
                <h2 className="text-[25px] md:text-[30px] font-cormorant">
                  Users
                </h2>
                <p className="font-inter text-black/60">
                  {searchUsers.length} member(s) found
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name or email...."
                  className="border border-black/10 dark:border-white/40 mx-4 pl-10 pr-3 py-1.5 font-inter outline-none shadow"
                />
                <IoSearchOutline className="absolute top-3 left-8" />
              </div>
            </div>

            <div className="w-full mx-auto">
              <div className="w-full border border-stone-300/70 rounded-xl bg-[#faf6f0] dark:bg-zinc-900 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 font-bold text-xs tracking-wider uppercase">
                        <th className="px-6 py-4 w-[16%]">Name</th>
                        <th className="px-6 py-4 w-[16%]">Role</th>
                        <th className="px-6 py-4 w-[25%]">Email</th>
                        <th className="px-6 py-4 w-[16%]">Joined</th>
                        <th className="px-6 py-4 w-[8%] text-center">Orders</th>
                        <th className="px-6 py-4 w-[16%] text-right">Spent</th>
                        <th className="px-6 py-4 w-[11%] text-center">Status</th>
                        <th className="px-6 py-4 w-[8%]"></th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-stone-200/80 dark:divide-stone-800">
                      {searchUsers.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="p-8 text-center text-gray-500 font-medium bg-stone-50/30"
                          >
                            No Users found
                          </td>
                        </tr>
                      ) : (
                        searchUsers.map((user) => {
                          const userAmount = amounts.find(
                            (s) => Number(s.userId) === Number(user.id)
                          );
                          const userOrder = orders.find(
                            (o) => Number(o.id) === Number(user.id)
                          );

                          return (
                            <tr
                              key={user.id}
                              onClick={() => {
                                setSelectedUser(user);
                                setOpen(true);
                              }}
                              className="hover:bg-[#fcf6f6] dark:hover:bg-gray-600/20 cursor-pointer text-sm text-stone-800 dark:text-stone-200 transition"
                            >
                              <td className="px-6 font-bold text-black dark:text-white truncate">
                                {user.fullName}
                              </td>
                              <td className="px-6 text-black dark:text-white truncate">
                                {user.role}
                              </td>
                              <td className="px-6 text-stone-600 dark:text-stone-400 truncate">
                                {user.email}
                              </td>
                              <td className="px-6 text-stone-600 dark:text-stone-400">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US") : "N/A"}
                              </td>
                              <td className="px-6 py-4 text-center text-stone-600 dark:text-stone-400">
                                {userOrder?.totalOrders || 0}
                              </td>
                              <td className="px-6 py-4 text-right text-stone-600 dark:text-stone-400">
                                <span className="font-bold">$ </span>
                                {userAmount?.totalAmount || 0}
                              </td>
                              <td className="px-6 text-center">
                                <span
                                  className={
                                    user.status === "Active"
                                      ? "text-green-600 font-inter font-semibold"
                                      : "text-red-800 dark:text-red-400 dark:bg-red-500/10 bg-red-500/20 px-2 py-1 rounded-full font-inter text-xs"
                                  }
                                >
                                  {user.status}
                                </span>
                              </td>
                              <td className="px-6 text-right text-stone-400" >
                                <IoIosArrowForward   />
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Box */}
              {open && selectedUser && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
                  <div className="bg-white dark:bg-black dark:border w-full mx-3 p-3 lg:w-1/2 lg:p-5 rounded shadow-lg relative max-h-[90vh] overflow-y-auto transition duration-700">
                    <button
                      onClick={() => setOpen(false)}
                      className="absolute top-2 right-2 text-black dark:text-white hover:opacity-70 transition"
                    >
                      <RxCross2 size={25} />
                    </button>

                    <div className="mb-6">
                      <span className="text-[11px] tracking-[3px] text-amber-600 dark:text-amber-500 font-semibold uppercase block mb-1">
                        Member Detail ({selectedUser.role})
                      </span>
                      <h2 className="text-3xl font-serif text-stone-900 dark:text-white capitalize">
                        {selectedUser.fullName}
                      </h2>
                    </div>

                    {/* Grid blocks */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      <div className="border border-stone-300/60 dark:border-stone-800 bg-white/60 dark:bg-zinc-950 p-4 rounded shadow-sm">
                        <span className="text-[10px] tracking-[1px] text-stone-400 dark:text-stone-500 uppercase block font-bold mb-1">
                          Email
                        </span>
                        <p className="font-medium truncate">{selectedUser.email}</p>
                      </div>

                      <div className="border border-stone-300/60 dark:border-stone-800 bg-white/60 dark:bg-zinc-950 p-4 rounded shadow-sm">
                        <span className="text-[10px] tracking-[1px] text-stone-400 dark:text-stone-500 uppercase block font-bold mb-1">
                          Phone
                        </span>
                        <p className="font-medium">{selectedUser.phone || "N/A"}</p>
                      </div>

                      <div className="border border-stone-300/60 dark:border-stone-800 bg-white/60 dark:bg-zinc-950 p-4 rounded shadow-sm">
                        <span className="text-[10px] tracking-[1px] text-stone-400 dark:text-stone-500 uppercase block font-bold mb-1">
                          Joined
                        </span>
                        <p className="font-medium">
                          {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>

                      <div className="border border-stone-300/60 dark:border-stone-800 bg-white/60 dark:bg-zinc-950 p-4 rounded shadow-sm">
                        <span className="text-[10px] tracking-[1px] text-stone-400 dark:text-stone-500 uppercase block font-bold mb-1">
                          Orders
                        </span>
                        <p className="font-medium">{selectedUserOrders}</p>
                      </div>

                      <div className="border border-stone-300/60 dark:border-stone-800 bg-white/60 dark:bg-zinc-950 p-4 rounded shadow-sm">
                        <span className="text-[10px] tracking-[1px] text-stone-400 dark:text-stone-500 uppercase block font-bold mb-1">
                          Total Spent
                        </span>
                        <p className="font-semibold text-stone-900 dark:text-stone-100">
                          $ {selectedUserAmount}
                        </p>
                      </div>

                      <div className="border border-stone-300/60 dark:border-stone-800 bg-white/60 dark:bg-zinc-950 p-4 rounded shadow-sm">
                        <span className="text-[10px] tracking-[1px] text-stone-400 dark:text-stone-500 uppercase block font-bold mb-1">
                          Status
                        </span>
                        <p className={`font-semibold ${selectedUser.status === "Active" ? "text-emerald-700 dark:text-emerald-500" : "text-red-600 dark:text-red-400"}`}>
                          {selectedUser.status}
                        </p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-xs tracking-[2px] text-stone-500 dark:text-stone-400 font-bold uppercase mb-4">
                        Recent Purchases
                      </h3>

                      <div className="border border-stone-300/70 dark:border-stone-800 bg-stone-50/40 dark:bg-zinc-950/40 rounded overflow-hidden">
                        <div className="flex justify-between items-center px-4 pt-3 pb-1 text-xs text-stone-400 dark:text-stone-500">
                          <span>5/21/2026, 5:22:32 PM</span>
                          <span className="font-semibold tracking-wider text-stone-500 dark:text-stone-400 uppercase">
                            CANCELLED
                          </span>
                        </div>

                        <div className="flex justify-between items-start px-4 py-3 border-b border-stone-200 dark:border-stone-800">
                          <p className="text-sm font-medium text-stone-800 dark:text-stone-300">
                            Festival Crown Embroidered Topi{" "}
                            <span className="text-stone-400 dark:text-stone-500 mx-1">×</span> 10
                          </p>
                          <span className="text-sm font-medium text-stone-700 dark:text-stone-400">
                            NPR 32,000
                          </span>
                        </div>

                        <div className="flex justify-between items-center px-4 py-3 bg-stone-100/50 dark:bg-zinc-900/50">
                          <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                            Total
                          </span>
                          <span className="text-sm font-bold text-red-600 dark:text-red-400">
                            NPR 36,160
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end items-center gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                      <button
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium border border-stone-300 dark:border-stone-700 bg-white dark:bg-zinc-800 rounded shadow-sm hover:bg-stone-50 dark:hover:bg-zinc-700 transition"
                      >
                        <IoCloseOutline className="text-lg" /> Close
                      </button>

                      <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#be2e2e] hover:bg-red-700 rounded shadow-sm transition">
                        <IoShieldOutline className="text-base" /> Ban user
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminUsers;