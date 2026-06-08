import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { FiUploadCloud } from "react-icons/fi";

type Photo = {
  url: string;
  photoId: string;
};

interface Product {
  id: string;
  name: string;
  slug?: string;
  category: string;
  genderTarget?: "Men" | "Women" | "Unisex" | string;
  price: number;
  originalPrice?: number;
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
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [genderTarget, setGenderTarget] = useState("");
  const [stock, setStock] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/product/all-products");
      setProducts([...res.data.products].reverse());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Safe parsing helper
  const parseProductPhoto = (photos: Photo[] | string): string => {
    try {
      if (typeof photos === "string") {
        return JSON.parse(photos)[0]?.url || "";
      } else if (Array.isArray(photos)) {
        return photos[0]?.url || "";
      }
    } catch (e) {
      console.error("Error parsing photo:", e);
    }
    return "";
  };

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedProduct(null);
    setName("");
    setSlug("");
    setCategory("");
    setGenderTarget("");
    setStock(0);
    setSellingPrice(0);
    setOriginalPrice(0);
    setImagePreview("");
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Product) => {
    setIsEditMode(true);
    setSelectedProduct(item);
    setName(item.name);
    setSlug(item.slug || "");
    setCategory(item.category);
    setGenderTarget(item.genderTarget || "");
    setStock(item.stock);
    setSellingPrice(item.price);
    setOriginalPrice(item.originalPrice || 0);
    setSelectedFile(null);
    
    const currentImg = parseProductPhoto(item.photos);
    setImagePreview(currentImg); 

    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("category", category);
    formData.append("genderTarget", genderTarget);
    formData.append("stock", String(stock));
    formData.append("price", String(sellingPrice));
    if (originalPrice > 0) formData.append("originalPrice", String(originalPrice));
    
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      
      if (isEditMode && selectedProduct) {
        await axios.put(`http://localhost:3000/product/update/${selectedProduct.id}`, formData, config);
      } else {
        await axios.post("http://localhost:3000/product/add", formData, config);
      }
      fetchProducts();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to submit data:", error);
    }
  };

  const searchProduct = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalPages = Math.ceil(searchProduct.length / itemsPerPage);
  
  const currentProducts = searchProduct.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <>
      <main className="space-y-6">
        <section className="w-full border border-gray-600/20 dark:border-gray-600 rounded-lg overflow-x-auto">
          <table className="w-full border-collapse bg-[#f6f0e7] dark:bg-black rounded-lg">
            <thead>
              <tr className="text-left border-b border-gray-300">
                <th className="p-3 uppercase text-sm text-black/60">Image</th>
                <th className="p-3 uppercase text-sm text-black/60">Name</th>
                <th className="p-3 uppercase text-sm text-black/60">Category</th>
                <th className="p-3 uppercase text-sm text-black/60">Price</th>
                <th className="p-3 uppercase text-sm text-black/60">Stock</th>
                <th className="p-3 uppercase text-sm text-black/60">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
              {currentProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">No products found.</td>
                </tr>
              ) : (
                currentProducts.map((item) => {
                  const productPhotoUrl = parseProductPhoto(item.photos);
                  return (
                    <tr key={item.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="p-3">
                        {productPhotoUrl ? (
                          <img src={productPhotoUrl} alt={item.name} className="w-16 h-16 object-cover rounded shadow-sm" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-300 dark:bg-zinc-800 rounded flex items-center justify-center text-xs text-gray-400">No Img</div>
                        )}
                      </td>
                      <td className="p-3 font-medium text-stone-900 dark:text-stone-100">{item.name}</td>
                      <td className="p-3 text-stone-600 dark:text-stone-400">{item.category}</td>
                      <td className="p-3 font-semibold">NPR {item.price}</td>
                      <td className="p-3 text-stone-600 dark:text-stone-400">{item.stock}</td>
                      <td className="p-3">
                        <div className="flex gap-2 items-center">
                          <button onClick={() => openEditModal(item)} className="hover:bg-black/10 dark:hover:bg-white/20 w-10 h-10 flex items-center justify-center rounded transition">
                            <MdOutlineEdit size={20} />
                          </button>
                          <button className="hover:bg-red-500/10 w-10 h-10 flex items-center justify-center rounded transition">
                            <RiDeleteBin6Line size={20} className="text-red-500" />
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
          <div className="flex justify-end p-2">
            <div className="inline-flex gap-1.5 items-center bg-transparent">
              {/* Previous Button */}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center text-sm font-medium border border-stone-300 dark:border-stone-700 bg-[#fbf9f6] dark:bg-zinc-900 text-stone-600 dark:text-stone-400 rounded hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                &lt;
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded transition ${
                    currentPage === page
                      ? "bg-[#9c0d12] text-white border border-[#9c0d12]"
                      : "border border-stone-300 dark:border-stone-700 bg-[#fbf9f6] dark:bg-zinc-900 text-stone-800 dark:text-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center text-sm font-medium border border-stone-300 dark:border-stone-700 bg-[#fbf9f6] dark:bg-zinc-900 text-stone-600 dark:text-stone-400 rounded hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                &gt;
              </button>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center z-[110] p-4 animate-fade-in">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl p-6 rounded-2xl shadow-2xl relative max-h-[92vh] overflow-y-auto">
              
              <button type="button" onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition">
                <RxCross2 size={20} />
              </button>

              <div className="mb-6">
                <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-500 font-semibold block mb-1">✨ Catalog </span>
                <h2 className="text-3xl font-serif text-zinc-900 dark:text-zinc-50 font-medium">
                  {isEditMode ? "Modify Product" : "New Product"}
                </h2>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Image System */}
                <div>
                  <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 block mb-2">Product Images</label>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden" 
                  />
                  {imagePreview ? (
                    <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50 flex items-center justify-center group h-48 w-full">
                      <img src={imagePreview} alt="Product preview" className="h-full w-auto object-contain" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setSelectedFile(null);
                          }}
                          className="bg-white text-zinc-900 text-xs font-medium px-4 py-2 rounded-xl shadow-sm hover:bg-zinc-100 transition"
                        >
                          Remove & Change Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div onClick={triggerFileSelect} className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/70 transition cursor-pointer">
                      <FiUploadCloud className="text-red-500 mb-2" size={32} />
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Drag & drop or <span className="text-red-500 underline">click to browse</span>
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">JPEG, JPG, PNG only (Max 5)</p>
                    </div>
                  )}
                </div>

                {/* Name & Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Product Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Premium Silk Dress"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/60 px-3.5 py-2 rounded-xl outline-none focus:border-amber-500 text-sm transition"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Product Slug</label>
                    <input
                      type="text"
                      placeholder="premium-silk-dress"
                      value={slug}
                      className="w-full border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/40 px-3.5 py-2 rounded-xl outline-none text-sm transition text-zinc-500 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/60 px-3 py-2 rounded-xl text-sm outline-none bg-white dark:bg-zinc-900 transition"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Saree">Saree</option>
                      <option value="Haku Patasi">Haku Patasi</option>
                      <option value="Lehenga">Lehenga</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Gender Target</label>
                    <select
                      value={genderTarget}
                      onChange={(e) => setGenderTarget(e.target.value)}
                      className="w-full border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/60 px-3 py-2 rounded-xl text-sm outline-none bg-white dark:bg-zinc-900 transition"
                    >
                      <option value="">Select Gender</option>
                      <option value="Women">Women</option>
                      <option value="Men">Men</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Available Stock</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/60 px-3.5 py-2 rounded-xl outline-none text-sm transition"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Selling Price (NPR)</label>
                    <input
                      type="number"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                      className="w-full border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/60 px-3.5 py-2 rounded-xl outline-none text-sm transition"
                      min="0"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Original / Compare Price (Optional)</label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/60 px-3.5 py-2 rounded-xl outline-none text-sm transition"
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-900">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2 text-sm font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-sm font-semibold bg-red-700 hover:bg-red-500 text-white rounded-xl shadow-md transition"
                  >
                    {isEditMode ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default AdminProductView;