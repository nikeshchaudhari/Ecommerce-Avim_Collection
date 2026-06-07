import Navbar from "../component/Navbar";
import AdminSideBar from "../component/AdminSideBar";
import { IoSearchOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { WiStars } from "react-icons/wi";
import { RxCross2 } from "react-icons/rx";
import { SlCloudUpload } from "react-icons/sl";
import { useFormik } from "formik";
import { AdminProduct } from "../../Schemas/AdminProductValid";
import axios from "axios";
import { toast } from "react-toastify";
import AdminProductView from "./AdminProductView";

const AdminProducts = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // English Comment: Added refresh trigger to sync parent count and child component table data
  const [refreshKey, setRefreshKey] = useState(0);

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

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileRef.current?.click();
  };

  // formik
  const {
    errors,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    touched,
    resetForm,
  } = useFormik({
    initialValues: {
      name: "",
      slug: "",
      category: "",
      gender: "",
      stock: 0,
      price: 0,
      compare_price: 0,
      status: "in_stock",
      discount_percent: "",
      discount_amount: "",
      discount_starts_at: "",
      discount_ends_at: "",
      featured: false,
      active: false,
      colors: "",
      sizes: "",
      description: "",
      story: "",
      photos: [] as File[],
    },
    validationSchema: AdminProduct,
    onSubmit: async (values) => {
      const token = localStorage.getItem("token");

      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("slug", values.slug);
        formData.append("category", values.category);
        formData.append("gender", values.gender);
        formData.append("stock", String(values.stock));
        formData.append("price", String(values.price));
        formData.append("compare_price", String(values.compare_price));
        formData.append("status", values.status);
        formData.append("discount_percent", String(values.discount_percent));
        formData.append("discount_amount", String(values.discount_amount));
        formData.append("discount_starts_at", values.discount_starts_at);
        formData.append("discount_ends_at", values.discount_ends_at);
        formData.append("featured", String(values.featured));
        formData.append("active", String(values.active));
        formData.append("colors", values.colors);
        formData.append("sizes", values.sizes);
        formData.append("description", values.description);
        formData.append("story", values.story);

        values.photos.forEach((file) => {
          formData.append("photos", file);
        });

        const res = await axios.post(
          "http://localhost:3000/product/add-products",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        
        resetForm();
        setOpen(false);
        setPhotos([]);
        toast.success("Product created successfully!");
        
        setRefreshKey((prev) => prev + 1);
        console.log(res.data);
      } catch (err) {
        toast.error("Error creating product");
      }
    },
  });

  const handleLoading = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (values.photos.length + files.length > 5) {
      alert("Maximum 5 photos allowed");
      return;
    }

    setLoading(true);
    setFieldValue("photos", [...values.photos, ...files]);

    const preview = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...preview]);

    // English Comment: Resetting input value to allow uploading the same deleted file again
    e.target.value = "";

    setTimeout(() => {
      setLoading(false);
      console.log("Upload ready");
    }, 1500);
  };

  const handleDelete = (i: number) => {
    const updatedPhotos = values.photos.filter((_, index) => index !== i);
    setFieldValue("photos", updatedPhotos);
    setPhotos((prev) => prev.filter((_, index) => index !== i));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProduct = await axios.get("http://localhost:3000/product/all-products");
        const allProducts = resProduct.data.products;

        const uniqueData = Array.from(
          new Set(allProducts.map((items: any) => items.category)),
        ).filter(Boolean);
        
        setProducts(allProducts);
        setCategories(uniqueData as string[]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [refreshKey]); 
  return (
    <>
      <nav>
        <Navbar />
      </nav>

      <main>
        <div className="bg-[#f9efe7] dark:bg-black min-h-screen lg:flex">
          <aside className="hidden lg:block">
            <AdminSideBar />
          </aside>
          
          <section className="flex-1 px-5 lg:px-10 pt-5">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="mb-5">
                <span className="text-[12px] tracking-[4px] text-yellow-500 font-semibold">
                  Catalog
                </span>
                <h2 className="text-[25px] md:text-[30px] font-cormorant">
                  Products
                </h2>
                <p className="font-inter text-black/60 dark:text-white/60">
                  {products.length} item(s)
                </p>
              </div>

              <div className="flex items-center flex-wrap gap-2 relative">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products...."
                    className="border border-black/10 dark:border-white/40 pl-10 pr-3 py-1.5 font-inter outline-none shadow bg-white dark:bg-zinc-950 rounded"
                  />
                  <IoSearchOutline className="absolute left-3 text-gray-400" />
                </div>
                
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  className="bg-yellow-500 px-6 py-1.5 rounded hover:bg-yellow-400 transition duration-300 font-inter font-medium text-black"
                >
                  + New product
                </button>
              </div>
            </div>

            {open && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fade-in">
                <div className="bg-white dark:bg-black dark:border border-zinc-800 w-full mx-3 p-4 lg:w-1/2 lg:p-6 rounded-xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
                  
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      resetForm();
                      setPhotos([]);
                    }}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white transition"
                  >
                    <RxCross2 size={22} />
                  </button>
                  
                  <div className="flex items-center gap-1 text-yellow-500 mb-1">
                    <WiStars size={20} />
                    <span className="tracking-[4px] text-[11px] font-inter font-bold">
                      CATALOG
                    </span>
                  </div>

                  <h2 className="text-[26px] font-cormorant mb-4 font-light dark:text-white">
                    New product
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <h2 className="font-inter text-sm font-semibold mb-1 dark:text-gray-300">Product images</h2>
                      <div
                        className="relative w-full h-44 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-gray-50 dark:bg-zinc-950 hover:bg-gray-100 dark:hover:bg-zinc-900 transition"
                        onClick={handleClick}
                      >
                        <div className="bg-red-50 dark:bg-red-950/30 p-2 rounded-full mb-1">
                          <SlCloudUpload size={28} className="text-red-500" />
                        </div>
                        <p className="text-sm font-medium">Drag & drop or click to browse</p>
                        <p className="text-xs text-gray-400">JPEG, JPG, PNG only (Max 5)</p>

                        <input
                          type="file"
                          ref={fileRef}
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleLoading}
                        />

                        {loading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                            <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                      
                      {touched.photos && errors.photos && (
                        <p className="text-xs text-red-500 mt-1 font-medium">
                          {String(errors.photos)}
                        </p>
                      )}
                    </div>

                    {photos.length > 0 && (
                      <div className="grid grid-cols-5 gap-2">
                        {photos.map((img, i) => (
                          <div key={i} className="relative group aspect-square">
                            <img
                              src={img}
                              alt="preview"
                              className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-zinc-800"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center" />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full hover:bg-red-600 transition"
                              onClick={(e) => {
                                e.stopPropagation(); // Stops dragzone trigger
                                handleDelete(i);
                              }}
                            >
                              <RxCross2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1" htmlFor="name">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter product name.."
                          className="w-full border border-gray-300 dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2 rounded-lg outline-none focus:border-amber-500 transition"
                        />
                        {touched.name && errors.name && (
                          <p className="text-xs text-red-500 mt-1">{errors.name} *</p>
                        )}
                      </div>
                      
                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1" htmlFor="slug">Slug</label>
                        <input
                          type="text"
                          name="slug"
                          value={values.slug}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="enter-product-slug"
                          className="w-full border border-gray-300 dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2 rounded-lg outline-none focus:border-amber-500 transition"
                        />
                        {touched.slug && errors.slug && (
                          <p className="text-xs text-red-500 mt-1">{errors.slug} *</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1" htmlFor="category">Category</label>
                        <select
                          name="category"
                          value={values.category}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border border-gray-300 dark:border-zinc-800 dark:bg-zinc-950 px-2 py-2 rounded-lg outline-none"
                        >
                          <option value="">Select</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        {touched.category && errors.category && (
                          <p className="text-xs text-red-500 mt-1">{errors.category} *</p>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1" htmlFor="gender">Gender</label>
                        <select
                          name="gender"
                          value={values.gender}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border border-gray-300 dark:border-zinc-800 dark:bg-zinc-950 px-2 py-2 rounded-lg outline-none"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="unisex">Unisex</option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1" htmlFor="stock">Stock</label>
                        <input
                          type="number"
                          name="stock"
                          min="0"
                          value={values.stock}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border border-gray-300 dark:border-zinc-800 dark:bg-zinc-950 px-2 py-2 rounded-lg outline-none"
                        />
                      </div>
                    </div>

                  
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1" htmlFor="price">Price (NPR)</label>
                        <input
                          type="number"
                          name="price"
                          min="0"
                          value={values.price}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border border-gray-300 dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2 rounded-lg outline-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1" htmlFor="compare_price">Compare price (optional)</label>
                        <input
                          type="number"
                          name="compare_price"
                          min="0"
                          value={values.compare_price}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border border-gray-300 dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2 rounded-lg outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium mb-1" htmlFor="status">Availability status</label>
                      <select
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border border-gray-300 dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2 rounded-lg outline-none"
                      >
                        <option value="in_stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                    </div>

                    <div className="border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 rounded-xl p-4 space-y-3">
                      <h2 className="uppercase text-[11px] tracking-[3px] text-yellow-600 font-bold">
                        Product-level discount
                      </h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-xs font-medium mb-1" htmlFor="discount_percent">Discount %</label>
                          <input
                            type="number"
                            name="discount_percent"
                            min="0"
                            max="100"
                            value={values.discount_percent}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="border border-gray-300 dark:border-zinc-800 dark:bg-zinc-950 px-3 py-1.5 rounded-lg outline-none"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-medium mb-1" htmlFor="discount_amount">Or fixed amount (NPR)</label>
                          <input
                            type="number"
                            name="discount_amount"
                            min="1"
                            value={values.discount_amount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="border border-gray-300 dark:border-zinc-800 dark:bg-zinc-950 px-3 py-1.5 rounded-lg outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-xs font-medium mb-1" htmlFor="discount_starts_at">Starts</label>
                          <input
                            type="datetime-local"
                            name="discount_starts_at"
                            value={values.discount_starts_at}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="border border-gray-300 dark:border-zinc-800 dark:bg-zinc-950 px-3 py-1.5 rounded-lg outline-none"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-medium mb-1" htmlFor="discount_ends_at">Ends</label>
                          <input
                            type="datetime-local"
                            name="discount_ends_at"
                            value={values.discount_ends_at}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="border border-gray-300 dark:border-zinc-800 dark:bg-zinc-950 px-3 py-1.5 rounded-lg outline-none"
                          />
                        </div>
                      </div>
                    </div>

                  
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-1" htmlFor="description">Description</label>
                        <textarea
                          rows={3}
                          name="description"
                          value={values.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border border-gray-300 dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2 rounded-lg outline-none w-full text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1" htmlFor="story">Story</label>
                        <textarea
                          rows={2}
                          name="story"
                          value={values.story}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border border-gray-300 dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2 rounded-lg outline-none w-full text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1" htmlFor="sizes">Sizes (comma separated)</label>
                        <input
                          type="text"
                          name="sizes"
                          placeholder="S, M, L, XL"
                          value={values.sizes}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full border border-gray-300 dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2 rounded-lg outline-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1" htmlFor="colors">Colors (comma separated)</label>
                        <input
                          type="text"
                          name="colors"
                          placeholder="Red, Blue, Black"
                          value={values.colors}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full border border-gray-300 dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2 rounded-lg outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-6 pt-2">
                      <label className="flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          name="featured"
                          onChange={(e) => setFieldValue("featured", e.target.checked)}
                          checked={values.featured}
                          className="w-4 h-4 accent-red-700 mr-2 rounded"
                        />
                        <span className="text-sm">Featured on homepage</span>
                      </label>
                      
                      <label className="flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          name="active"
                          onChange={(e) => setFieldValue("active", e.target.checked)}
                          checked={values.active}
                          className="w-4 h-4 accent-red-700 mr-2 rounded"
                        />
                        <span className="text-sm">Active (visible to shoppers)</span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t dark:border-zinc-800">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-zinc-900 transition"
                        onClick={() => {
                          resetForm();
                          setPhotos([]);
                          setOpen(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                      >
                        Create Product
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          
            <AdminProductView key={refreshKey} search={searchTerm} />
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminProducts;