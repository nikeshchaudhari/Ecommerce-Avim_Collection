import { IoSearchOutline } from "react-icons/io5";
import AdminSideBar from "../component/AdminSideBar";
import Navbar from "../component/Navbar";
import { useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";
import axios from "axios";

interface OrderItems {
  id: number;
  name: string;
  price: number;
}
interface Orders {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: number;
  shippingAddress: string;
  status: string;
  items: OrderItems[];
  total: number;
  notes: string;
  whatsapp_message: string;
}
const AdminOrders = () => {
  const [openId, setOpenId] = useState(false);
  const [orders, setOrders] = useState<Orders[]>([]);
  const[whatsapp,setWhatsapp] = useState<Orders[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/order/all-order");
        setOrders(res.data.Allorders);
      } catch (err: any) {
        console.error("Orders ", err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <>
      <nav className="">
        <Navbar />
      </nav>
      <main className="overflow-x-hidden">
        <div className="bg-[#f9efe7] dark:bg-black min-h-full lg:flex">
          <aside className="hidden lg:block">
            <AdminSideBar />
          </aside>
          <section className="flex-1 px-5 lg:px-10 pt-5">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="mb-5">
                <span className="text-[12px] tracking-[4px] text-yellow-500">
                  Operations
                </span>
                <h2 className="text-[25px] md:text-[30px] font-cormorant">
                  Orders
                </h2>
                <p className="font-inter text-black/60">
                  {orders.length} order(s)
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-72">
                  <input
                    type="text"
                    placeholder="Search by customer, phone, id..."
                    className="w-full border border-black/10 dark:border-white/40 pl-10 pr-3 py-2 font-inter outline-none shadow"
                  />
                  <IoSearchOutline className="absolute top-3 left-3" />
                </div>

                <div className="flex items-center gap-2 w-full md:w-48 border border-black/10 dark:border-white/40 px-3 py-2 font-inter shadow">
                  <CiFilter />

                  <select className="w-full outline-none bg-transparent">
                    <option value="all_status">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="">
              {orders.length === 0 ? (
                <p className="text-center"> Orders Not found</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((order: any) => {
                    const items =
                      typeof order.items === "string"
                        ? JSON.parse(order.items)
                        : order.items;

                    return (
                      <>
                        <div
                          key={order.id}
                          className="border border-gray-500/30 pt-2 rounded shadow bg-white/60 hover:bg-[#fcf6f6] dark:bg-black"
                          
                        >
                          <div className="flex items-center justify-between " onClick={() =>
                            setOpenId(openId === order.id ? null : order.id)
                          }>
                            <div className="flex px-4 " >
                              <div>
                                <h2 className="text-base font-bold text-stone-800 dark:text-stone-200">
                                  #{order.id} · {order.customerName}
                                </h2>
                                <p className="text-xs text-stone-500 mt-1 px-2 text-[14px] pb-2   ">
                                   {new Date(order.created_at).toLocaleString()}

                                  <span className="font-semibold text-stone-700 dark:text-stone-300 ml-2">
                                    NPR {order.total}
                                  </span>
                                </p>
                              </div>
                            </div>

                            {/*  */}
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                  order.status === "Confirmed"
                                    ? "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {order.status}
                              </span>
                              <select
                                value={order.status}
                                className="border border-stone-300 dark:border-stone-700 rounded-lg px-2 py-1 text-xs bg-white dark:bg-zinc-800 font-medium text-stone-700 dark:text-stone-300 shadow-sm cursor-pointer outline-none"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          {openId === order.id && (
                            <div className="w-full min-h-full mt-3 border-t border-gray-600/30 py-3 bg-[#faf7ef]">
                              <p className="px-4">
                                <span className="font-semibold">Email: </span>
                                {order.customerEmail}
                              </p>
                              <p className="px-4">
                                <span className="font-semibold">Phone: </span>{" "}
                                {order.customerPhone}
                              </p>
                              <p className="px-4">
                                <span className="font-semibold">Address: </span>{" "}
                                {order.shippingAddress}
                              </p>
                              <p className="px-4">
                                <span className="font-semibold">Notes: </span>{" "}
                                {order.notes}
                              </p>
                              <div className=" px-4">
                                <p>
                                  <span className="font-semibold">
                                    Items:{" "}
                                  </span>{" "}
                                </p>
                                {items.map((item: any) => (
                                  <ul className="list-disc list-inside ml-5">
                                    {" "}
                                    <li className="font-semibold text-[14px]">
                                      {item.name} x {item.qty} = {item.price}
                                    </li>
                                  </ul>
                                ))}
                              </div>
                              <div className=" px-4">
                                <p>WhatsApp message</p>
                              </div>

                            </div>
                          )}
                        </div>
                      </>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminOrders;
