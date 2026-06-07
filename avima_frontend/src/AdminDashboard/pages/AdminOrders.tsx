import { IoSearchOutline } from "react-icons/io5";
import AdminSideBar from "../component/AdminSideBar";
import Navbar from "../component/Navbar";
import { useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";
import axios from "axios";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";

interface OrderItems {
  id: number;
  name: string;
  price: number;
  qty?: number;
}

interface Orders {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: number;
  shippingAddress: string;
  status: string;
  items: OrderItems[] | string;
  total: number;
  notes: string;
  whatsapp_message: string;
  created_at: string;
}

const AdminOrders = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Orders[]>([]);
  const [whatsappOpen, setWhatsappOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState("all_status");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/order/all-order");
        setOrders(res.data.Allorders || []);
      } catch (err: any) {
        console.error("Orders ", err);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedStatus]);

  const updateStatus = async (orderId: number, status: string) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:3000/order/update-status/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const searchData = orders.filter((order) => {
    if (!order) return false;
    
    const matchSearch =
      (order.customerName || "").toLowerCase().includes(search.toLowerCase()) ||
      (order.customerPhone?.toString() || "").includes(search) ||
      (order.id?.toString() || "").includes(search);

    const matchStatus =
      selectedStatus === "all_status" || order.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  // Pagination 
  const totalPage = Math.ceil(searchData.length / ordersPerPage);
  const indexOfLastPage = currentPage * ordersPerPage;
  const indexOfFirstPage = indexOfLastPage - ordersPerPage;
  const currentOrders = searchData.slice(indexOfFirstPage, indexOfLastPage);

  const getPageNumber = () => {
    const pages: (number | string)[] = [];
    const siblingRange = 1; 
    if (totalPage <= 5) {
      for (let i = 1; i <= totalPage; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > siblingRange + 2) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - siblingRange);
      const end = Math.min(totalPage - 1, currentPage + siblingRange);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPage - siblingRange - 1) {
        pages.push("...");
      }

      pages.push(totalPage);
    }

    return pages;
  };

  return (
    <>
      <main className="min-h-screen bg-[#f9efe7] dark:bg-neutral-950 text-stone-800 dark:text-stone-100 flex flex-col">
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        
        <div className="flex-1 flex flex-col lg:flex-row min-h-full">
          <aside className="hidden lg:block w-64 shrink-0">
            <AdminSideBar />
          </aside>
          
          <section className="flex-1 px-5 lg:px-10 pt-5 flex flex-col justify-between">
            <div className="w-full">
              <div className="flex md:justify-between items-center flex-wrap gap-4">
                <div className="mb-5">
                  <span className="text-[12px] tracking-[4px] text-yellow-500 font-semibold">
                    Operations
                  </span>
                  <h2 className="text-[25px] md:text-[30px] font-cormorant font-bold">
                    Orders
                  </h2>
                  <p className="font-inter text-black/60 dark:text-white/60">
                    {searchData.length} order(s) found
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative w-full md:w-72">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by customer, phone, id..."
                      className="w-full border border-black/10 dark:border-white/20 pl-10 pr-3 py-2 font-inter outline-none shadow rounded bg-white dark:bg-neutral-900 text-stone-900 dark:text-stone-100"
                    />
                    <IoSearchOutline className="absolute top-3 left-3 text-stone-400" />
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-48 border border-black/10 dark:border-white/20 px-3 py-2 font-inter shadow rounded bg-white dark:bg-neutral-900 text-stone-900 dark:text-stone-100">
                    <CiFilter className="text-stone-400" />
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full outline-none bg-transparent cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="all_status" className="dark:bg-neutral-900">All Status</option>
                      <option value="pending" className="dark:bg-neutral-900">Pending</option>
                      <option value="confirmed" className="dark:bg-neutral-900">Confirmed</option>
                      <option value="shipped" className="dark:bg-neutral-900">Shipped</option>
                      <option value="delivered" className="dark:bg-neutral-900">Delivered</option>
                      <option value="cancelled" className="dark:bg-neutral-900">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-2">
                {currentOrders.length === 0 ? (
                  <p className="text-center border border-gray-500/30 pt-2 rounded shadow bg-white/60 dark:bg-neutral-900/40 py-3 text-gray-500 dark:text-stone-400">
                    No orders founds
                  </p>
                ) : (
                  <div className="space-y-3">
                    {currentOrders.map((order: Orders) => {
                      const items: OrderItems[] =
                        typeof order.items === "string"
                          ? JSON.parse(order.items)
                          : order.items;

                      return (
                        <div
                          key={order.id}
                          className="border border-gray-500/30 pt-2 rounded-xl shadow bg-white/60 hover:bg-[#fcf6f6] dark:bg-neutral-900/60 dark:hover:bg-neutral-900"
                        >
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => {
                              setOpenId(openId === order.id ? null : order.id);
                              setWhatsappOpen(false);
                            }}
                          >
                            <div className="flex px-4">
                              <div>
                                <h2 className="w-full whitespace-nowrap text-[12px] md:text-base font-bold text-stone-800 dark:text-stone-200">
                                  {order.id} · {order.customerName}
                                </h2>
                                <p className="text-[12px] whitespace-break-spaces text-stone-500 mt-1 px-2 md:text-[14px] pb-2 dark:text-stone-400">
                                  {new Date(order.created_at).toLocaleString()}
                                  <span className="font-semibold text-stone-700 dark:text-stone-300 ml-2">
                                    NPR {order.total}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 px-2">
                              <span
                                className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-base lg:text-[11px] font-bold uppercase tracking-wider ${
                                  order.status === "pending"
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                                    : order.status === "confirmed"
                                      ? "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400"
                                      : order.status === "shipped"
                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                                        : order.status === "cancelled"
                                          ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                                          : order.status === "delivered"
                                            ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                            : ""
                                }`}
                              >
                                {order.status}
                              </span>
                              <select
                                value={order.status}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                  updateStatus(order.id, e.target.value);
                                }}
                                className="border border-stone-300 dark:border-stone-700 rounded-lg px-2 py-1 text-xs bg-white dark:bg-neutral-800 font-medium text-stone-700 dark:text-stone-300 shadow-sm cursor-pointer outline-none"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          {openId === order.id && (
                            <div className="w-full min-h-full text-[12px] md:text-[16px] mt-3 border-t border-gray-600/30 py-3 bg-[#faf7ef] dark:bg-neutral-900 text-stone-800 dark:text-stone-200 rounded-b-xl">
                              <p className="px-4 py-0.5">
                                <span className="font-semibold text-stone-500 dark:text-stone-400">Email: </span>
                                {order.customerEmail}
                              </p>
                              <p className="px-4 py-0.5">
                                <span className="font-semibold text-stone-500 dark:text-stone-400">Phone: </span>{" "}
                                {order.customerPhone}
                              </p>
                              <p className="px-4 py-0.5">
                                <span className="font-semibold text-stone-500 dark:text-stone-400">Address: </span>{" "}
                                {order.shippingAddress}
                              </p>
                              <p className="px-4 py-0.5">
                                <span className="font-semibold text-stone-500 dark:text-stone-400">Notes: </span>{" "}
                                {order.notes || "N/A"}
                              </p>
                              <div className="px-4 py-1">
                                <p className="font-semibold text-stone-500 dark:text-stone-400 mb-1">
                                  Items:
                                </p>
                                {items?.map((item: OrderItems, idx: number) => (
                                  <ul key={idx} className="list-disc list-inside ml-5">
                                    <li className="font-medium text-[12px] md:text-[15px]">
                                      {item.name} <span className="text-stone-400 dark:text-stone-500">x</span> {item.qty || 1} = <span className="font-semibold">NPR {item.price}</span>
                                    </li>
                                  </ul>
                                ))}
                              </div>
                              <div className="px-4 mt-4">
                                <button
                                  onClick={() => setWhatsappOpen(!whatsappOpen)}
                                  className="flex items-center gap-1.5 text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-bold text-sm transition select-none"
                                >
                                  <span className="text-[10px]">
                                    {whatsappOpen ? <BiSolidDownArrow /> : <BiSolidUpArrow />}
                                  </span>
                                  WhatsApp Message 
                                </button>

                                <div className="mt-2">
                                  {whatsappOpen && (
                                    <div className="w-full border rounded dark:bg-neutral-800 border-stone-300 dark:border-stone-700 px-3 py-2 bg-white text-stone-700 dark:text-stone-300">
                                      <p className="whitespace-pre-wrap">{order.whatsapp_message || "No custom template message generated."}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Pagination Controls safely aligned beneath order rows */}
            {totalPage > 1 && (
              <div className="flex justify-end py-6 mt-4">
                <div className="inline-flex gap-1.5 items-center bg-transparent">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center text-sm font-medium border border-stone-300 dark:border-stone-700 bg-[#fbf9f6] dark:bg-neutral-900 text-stone-600 dark:text-stone-400 rounded hover:bg-stone-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    &lt;
                  </button>

                  {getPageNumber().map((page, index) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="w-8 h-8 flex items-center justify-center text-sm text-stone-500 tracking-widest"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={`page-${page}`}
                        onClick={() => setCurrentPage(Number(page))}
                        className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded transition ${
                          currentPage === page
                            ? "bg-[#9c0d12] text-white border border-[#9c0d12]"
                            : "border border-stone-300 dark:border-stone-700 bg-[#fbf9f6] dark:bg-neutral-900 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-neutral-800"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPage))}
                    disabled={currentPage === totalPage}
                    className="w-8 h-8 flex items-center justify-center text-sm font-medium border border-stone-300 dark:border-stone-700 bg-[#fbf9f6] dark:bg-neutral-900 text-stone-600 dark:text-stone-400 rounded hover:bg-stone-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminOrders;