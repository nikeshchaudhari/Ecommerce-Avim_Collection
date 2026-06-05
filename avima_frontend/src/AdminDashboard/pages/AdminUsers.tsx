import { IoSearchOutline } from "react-icons/io5";
import AdminSideBar from "../component/AdminSideBar";
import Navbar from "../component/Navbar";
import { FiChevronRight } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

interface Users {
  fullName: string;
  id: number | string;
  email: string;
  joined: string;
  orders: number;
  spent: string;
  status: "Active" | "Banned" | string;
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

        resAmount.data.spendAmount.map((item) => console.log(item.totalAmount));
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

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
                  // value={searchTerm}
                  // onChange ={(e)=>setSearchTerm(e.target.value)}
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
                      {users.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="p-8 text-center text-gray-500 font-medium bg-stone-50/30"
                          >
                            No Users found.
                          </td>
                        </tr>
                      ) : (
                        users.map((user: any) => {
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

                                <td className="px-6  text-center">
                                  <span
                                    className={
                                      user.status === "Active"
                                        ? "text-green-600 font-inter"
                                        : "text-red-800 bg-red-500/20 px-2 py-1 rounded-full font-inter"
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
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminUsers;
