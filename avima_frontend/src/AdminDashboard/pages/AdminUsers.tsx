import {
  IoCloseOutline,
  IoSearchOutline,
  IoShieldOutline,
} from "react-icons/io5";
import AdminSideBar from "../component/AdminSideBar";
import Navbar from "../component/Navbar";
import { FiChevronRight } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { RxCross2 } from "react-icons/rx";

interface Users {
  fullName: string;
  id: number | string;
  email: string;
  joined: string;
  orders: number;
  spent: string;
  status: "Active" | "Banned" | string;
  role: string;
}

interface Order {
  id: string | number;
  userId?: string | number;
  totalOrders: number;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<Users[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [Amount, setAmount] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
    //   console.log(selectedUser.fullName);
//   console.log(selectedUser.role);


useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/users/all-user",
        );
        setUsers(response.data.users);
        // console.log(response.data.users);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  // user-orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/users/user-orders/`);
        const resAmount = await axios.get(
          `http://localhost:3000/order/spend-amount`,
        );
        setOrders(res.data.orders);
        setAmount(resAmount.data.spendAmount);

        resAmount.data.spendAmount.map((item: any) =>
          console.log(item.totalAmount),
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  //   search
  const searchUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
                <p className="font-inter text-black/60">member(s)</p>
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

            {/*  */}
            <div className=" w-full  mx-auto">
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
                        <th className="px-6 py-4 w-[11%] text-center">
                          Status
                        </th>
                        <th className="px-6 py-4 w-[8%]"></th>
                      </tr>
                    </thead>

                    <tbody className=" divide-stone-200/80 dark:divide-stone-800">
                      {searchUsers.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="p-8 text-center text-gray-500 font-medium bg-stone-50/30"
                          >
                            No Users found.
                          </td>
                        </tr>
                      ) : (
                        searchUsers.map((user: any) => {
                          // user_Amount Spend
                          const userAmount = Amount.find(
                            (s: any) => Number(s.userId) === Number(user.id),
                          );

                          return (
                            <>
                              <tr
                                key={user.id}
                                className="hover:bg-[#fcf6f6] dark:hover:bg-gray-600/20 cursor-pointer text-sm text-stone-800 dark:text-stone-200 transition"
                              >
                                <td className="px-6 font-bold text-black dark:text-white truncate">
                                  {user.fullName}
                                </td>
                                <td className="px-6  text-black dark:text-white truncate">
                                  {user.role}
                                </td>

                                <td className="px-6  text-stone-600 dark:text-stone-400 truncate">
                                  {user.email}
                                </td>

                                <td className="px-6  text-stone-600 dark:text-stone-400">
                                  {new Date(user.createdAt).toLocaleDateString(
                                    "en-US",
                                  )}
                                </td>

                                <td className="px-6 py-4 text-center text-stone-600 dark:text-stone-400">
                                  {orders.find(
                                    (o: any) =>
                                      Number(o.id) === Number(user.id),
                                  )?.totalOrders || 0}
                                </td>
                                <td className="px-6 py-4 text-right text-stone-600 dark:text-stone-400 ">
                                  <span className="font-bold">$ </span>
                                  {userAmount?.totalAmount || 0}
                                </td>

                                <td
                                  className="px-6  text-center"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setOpen(true);
                                  }}
                                >
                                  <span
                                    className={
                                      user.status === "Active"
                                        ? "text-green-600 font-inter"
                                        : "text-red-800 dark:text-red-400 dark:bg-red-500/10 bg-red-500/20 px-2 py-1 rounded-full font-inter"
                                    }
                                  >
                                    {user.status}
                                  </span>
                                </td>

                                <td className="px-6  text-right text-stone-400">
                                  ➔
                                </td>
                              </tr>
                            </>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* box */}
              {open && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
                  <div className="bg-white dark:bg-black dark:border w-full mx-3 p-3 lg:w-1/2 lg:p-5 rounded shadow-lg relative max-h-[90vh] overflow-y-auto transition duration-700">
                    <button
                      onClick={() => {
                        setOpen(false);
                      }}
                      className="absolute top-2 right-2 text-black dark:text-white"
                    >
                      <RxCross2 size={25} />
                    </button>

                    <div className="mb-6">
                      <span className="text-[11px] tracking-[3px] text-amber-600 dark:text-amber-500 font-semibold uppercase block mb-1">
                        Member Detail
                      </span>
                      <h2 className="text-3xl font-serif text-stone-900 dark:text-white capitalize">
                        {selectedUser.role}
                      </h2>
                    </div>

                    {/* grid blocks 6 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      {/* Card 1: Email */}
                      <div className="border border-stone-300/60 dark:border-stone-800 bg-white/60 dark:bg-zinc-950 p-4 rounded shadow-sm">
                        <span className="text-[10px] tracking-[1px] text-stone-400 dark:text-stone-500 uppercase block font-bold mb-1">
                          Email
                        </span>
                        <p className="font-medium truncate">
                          {selectedUser?.email}
                        </p>
                      </div>

                      <div className="border border-stone-300/60 dark:border-stone-800 bg-white/60 dark:bg-zinc-950 p-4 rounded shadow-sm">
                        <span className="text-[10px] tracking-[1px] text-stone-400 dark:text-stone-500 uppercase block font-bold mb-1">
                          Phone
                        </span>
                        <p className="font-medium">{selectedUser?.phone}</p>
                      </div>

                      <div className="border border-stone-300/60 dark:border-stone-800 bg-white/60 dark:bg-zinc-950 p-4 rounded shadow-sm">
                        <span className="text-[10px] tracking-[1px] text-stone-400 dark:text-stone-500 uppercase block font-bold mb-1">
                          Joined
                        </span>
                        <p className="font-medium">
                          {selectedUser ? new Date((selectedUser as any)
                            .createdAt).toLocaleDateString() : ""}
                        </p>
                      </div>

                      <div className="border border-stone-300/60 dark:border-stone-800 bg-white/60 dark:bg-zinc-950 p-4 rounded shadow-sm">
                        <span className="text-[10px] tracking-[1px] text-stone-400 dark:text-stone-500 uppercase block font-bold mb-1">
                          Orders
                        </span>
                        <p className="font-medium">
                        10
                        </p>
                      </div>

                      <div className="border border-stone-300/60 dark:border-stone-800 bg-white/60 dark:bg-zinc-950 p-4 rounded shadow-sm">
                        <span className="text-[10px] tracking-[1px] text-stone-400 dark:text-stone-500 uppercase block font-bold mb-1">
                          Total Spent
                        </span>
                        <p className="font-semibold text-stone-900 dark:text-stone-100">
                          {Amount?.totalAmount || "NPR 0"}
                        </p>
                      </div>

                      <div className="border border-stone-300/60 dark:border-stone-800 bg-white/60 dark:bg-zinc-950 p-4 rounded shadow-sm">
                        <span className="text-[10px] tracking-[1px] text-stone-400 dark:text-stone-500 uppercase block font-bold mb-1">
                          Status
                        </span>
                        <p className="font-semibold text-emerald-700 dark:text-emerald-500">
                          Active
                        </p>
                      </div>
                    </div>

                    {/* purchase details */}
                    <div className="mb-8">
                      <h3 className="text-xs tracking-[2px] text-stone-500 dark:text-stone-400 font-bold uppercase mb-4">
                        Purchases
                      </h3>

                      <div className="border border-stone-300/70 dark:border-stone-800 bg-stone-50/40 dark:bg-zinc-950/40 rounded overflow-hidden">
                        {/* Top row: Date & Status */}
                        <div className="flex justify-between items-center px-4 pt-3 pb-1 text-xs text-stone-400 dark:text-stone-500">
                          <span>5/21/2026, 5:22:32 PM</span>
                          <span className="font-semibold tracking-wider text-stone-500 dark:text-stone-400 uppercase">
                            CANCELLED
                          </span>
                        </div>

                        <div className="flex justify-between items-start px-4 py-3 border-b border-stone-200 dark:border-stone-800">
                          <p className="text-sm font-medium text-stone-800 dark:text-stone-300">
                            Festival Crown Embroidered Topi{" "}
                            <span className="text-stone-400 dark:text-stone-500 mx-1">
                              ×
                            </span>{" "}
                            10
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
                    {/* footer Actions */}
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
