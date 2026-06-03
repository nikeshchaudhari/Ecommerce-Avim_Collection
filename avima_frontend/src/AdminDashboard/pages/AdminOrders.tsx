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
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState<Orders[]>([]);

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
  if (orders.length === 0) {
    return (
      <div className="p-4 text-center text-stone-500">Orders Not Found</div>
    );
  }
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
                <p className="font-inter text-black/60">{orders.length} order(s)</p>
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

            <div>
              {orders.length === 0 ? (
                <p>Not found</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border p-4 rounded shadow bg-white dark:bg-black"
                    >
                      <h3 className="font-bold">{order.customerName}</h3>
                      <p>{order.customerEmail}</p>
                      <p>{order.customerPhone}</p>
                      <p>Status: {order.status}</p>
                      <p>Total: NPR {order.total}</p>
                    </div>
                  ))}
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
