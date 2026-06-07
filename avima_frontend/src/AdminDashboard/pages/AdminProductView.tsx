import axios from "axios";
import { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

type Photo = {
  url: string;
  photoId: string;
};

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Inactive" | "Out of Stock";
  photos: Photo[] | string;
  active?: number | string;
  featured?: number | string;
}

interface AdminProductViewProps {
  search: string;
  product?: any;
}

const AdminProductView = ({ search }: AdminProductViewProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/product/all-products");
        setProducts([...res.data.products].reverse());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const searchProduct = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination 
  const totalPages = Math.ceil(searchProduct.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = searchProduct.slice(indexOfFirstProduct, indexOfLastProduct);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1); 
      
      if (currentPage > 3) {
        pages.push("...");
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      let adjustedStart = start;
      let adjustedEnd = end;
      
      if (currentPage <= 2) {
        adjustedEnd = 3;
      }
      if (currentPage >= totalPages - 1) {
        adjustedStart = totalPages - 2;
      }

      for (let i = adjustedStart; i <= adjustedEnd; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      
      if (!pages.includes(totalPages)) {
        pages.push(totalPages); 
      }
    }
    return pages;
  };

  return (
    <>
      <main className="space-y-6">
        <section className="w-full h-full border border-gray-600/20 dark:border-gray-600 rounded-lg overflow-x-auto">
          <table className="w-full border-collapse bg-[#f6f0e7] dark:bg-black rounded-lg">
            <thead>
              <tr className="text-left border-b border-gray-300">
                <th className="p-3 uppercase text-sm text-black/60">Image</th>
                <th className="p-3 uppercase text-sm text-black/60">Name</th>
                <th className="p-3 uppercase text-sm text-black/60">Category</th>
                <th className="p-3 uppercase text-sm text-black/60">Price</th>
                <th className="p-3 uppercase text-sm text-black/60">Stock</th>
                <th className="p-3 uppercase text-sm text-black/60">Status</th>
                <th className="p-3 uppercase text-sm text-black/60">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
              {currentProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 font-medium">
                    No products found.
                  </td>
                </tr>
              ) : (
                currentProducts.map((item: any) => {
                  let productPhotoUrl = "";
                  try {
                    if (typeof item.photos === "string") {
                      productPhotoUrl = JSON.parse(item.photos)[0]?.url;
                    } else if (Array.isArray(item.photos)) {
                      productPhotoUrl = item.photos[0]?.url;
                    }
                  } catch (e) {
                    console.error("Error parsing photos:", e);
                  }

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-black/5 dark:hover:bg-white/5 transition"
                    >
                      <td className="p-3">
                        {productPhotoUrl ? (
                          <img
                            src={productPhotoUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded shadow-sm"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-300 dark:bg-zinc-800 rounded flex items-center justify-center text-xs text-gray-500">
                            No Img
                          </div>
                        )}
                      </td>

                      <td className="p-3 font-medium text-stone-900 dark:text-stone-100">
                        {item.name}
                      </td>

                      <td className="p-3 text-stone-600 dark:text-stone-400">
                        {item.category}
                      </td>

                      <td className="p-3 font-semibold">NPR {item.price}</td>

                      <td className="p-3 text-stone-600 dark:text-stone-400">
                        {item.stock}
                      </td>

                      <td className="p-3 space-x-2">
                        {Number(item.featured) === 1 && (
                          <span className="px-2 py-1 rounded text-xs bg-amber-700 text-gray-100 font-medium mr-1">
                            Featured
                          </span>
                        )}
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold tracking-wide ${
                            Number(item.active) === 1
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {Number(item.active) === 1 ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex gap-2 items-center">
                          <button className="hover:bg-black/10 dark:hover:bg-white/20 w-10 h-10 flex items-center justify-center rounded transition">
                            <MdOutlineEdit size={20} />
                          </button>

                          <button className="hover:bg-red-500/10 dark:hover:bg-red-500/20 w-10 h-10 flex items-center justify-center rounded transition">
                            <RiDeleteBin6Line
                              size={20}
                              className="text-red-500"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>

        {totalPages > 1 && (
          <div className="flex justify-end p-4">
            <div className="inline-flex gap-1.5 items-center bg-transparent">
              
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center text-sm font-medium border border-stone-300 dark:border-stone-700 bg-[#fbf9f6] dark:bg-zinc-900 text-stone-600 dark:text-stone-400 rounded hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                &lt;
              </button>

              {getPageNumbers().map((page, index) => {
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
                        ? "bg-[#9c0d12] text-white border border-[#9c0d12]" // Active Page (Dark Red)
                        : "border border-stone-300 dark:border-stone-700 bg-[#fbf9f6] dark:bg-zinc-900 text-stone-800 dark:text-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center text-sm font-medium border border-stone-300 dark:border-stone-700 bg-[#fbf9f6] dark:bg-zinc-900 text-stone-600 dark:text-stone-400 rounded hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                &gt;
              </button>

            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default AdminProductView;