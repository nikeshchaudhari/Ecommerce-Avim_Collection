import axios from "axios";
import  { useEffect, useState } from "react";
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
  photos: Photo[];
}
interface AdminProductViewProps {
  search: string;
  product?: any;
}
const AdminProductView = ({ search }: AdminProductViewProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get("http://localhost:3000/product/all-products");
      const categoryRes = await axios.get(
        "http://localhost:3000/category/all-data",
      );

      setProducts(res.data.products);
      setCategories(categoryRes.data.categories);
    };

    fetchProducts();
  }, []);

  const searchProduct = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <main>
        <section className="w-full  h-full border border-gray-600/20 dark:border-gray-600 rounded-lg overflow-x-auto">
          <div>
            <table className="w-full bg-[#f6f0e7] dark:bg-black rounded-lg">
              {/* HEADER */}
              <thead>
                <tr className="text-left border-b border-gray-300">
                  <th className="p-3 uppercase text-sm text-black/60">Image</th>
                  <th className="p-3 uppercase text-sm text-black/60">Name</th>
                  <th className="p-3 uppercase text-sm text-black/60">
                    Category
                  </th>
                  <th className="p-3 uppercase text-sm text-black/60">Price</th>
                  <th className="p-3 uppercase text-sm text-black/60">Stock</th>
                  <th className="p-3 uppercase text-sm text-black/60">
                    Status
                  </th>
                  <th className="p-3 uppercase text-sm text-black/60">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
               {searchProduct.length===0?(
                <tr>
                  <td colSpan={8} className="p-3 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
               ):(
                <div>
                   {searchProduct.filter((item:any)=> Number(item.active)===1).map((items: any) => {
                  // console.log(items.photos?.[0]?.url);
                  return (
                    <tr key={items.id} className=" ">
                      <td colSpan={8} className="border-b bg-red-600 border-gray-300">
                        <td className="p-3" >
                        <img
                          src={JSON.parse(items.photos)[0]?.url}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>

                      <td className="p-3">{items.name}</td>

                      <td className="p-3">{items.category}</td>

                      <td className="p-3">{items.price}</td>

                      <td className="p-3">{items.stock}</td>

                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                            Number(items.featured) === 1 ?
                            "bg-yellow-700 text-gray-300":"hidden"
                            }`}>
                                Featured

                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold tracking-wide  ${
                            Number(items.active) === 1
                              ? " text-emerald-800 dark:text-emerald-400" 
                              : " text-red-600-800 dark:text-stone-400" 
                          }`}
                        >
                         
                          {Number(items.active) === 1 ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2 items-center">
                          <button className="hover:bg-black/10 dark:hover:bg-white/20 w-10 h-10 flex items-center justify-center rounded">
                            <MdOutlineEdit size={20} />
                          </button>

                          <button className="hover:bg-red-500/10 dark:hover:bg-red-500/20 w-10 h-10 flex items-center justify-center rounded">
                            <RiDeleteBin6Line
                              size={20}
                              className="text-red-500"
                            />
                          </button>
                        </div>
                      </td>
                      </td>
                    </tr>
                  );
                })}
                </div>
               )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
};

export default AdminProductView;
