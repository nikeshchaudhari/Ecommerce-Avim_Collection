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
  const[searchTerm, setSearchTerm] = useState("");
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
      // console.log("SUBMIT WORKING", values);
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

    setLoading(true); // Trigger loading spinner start
    setFieldValue("photos", [...values.photos, ...files]);

    const preview = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...preview]);

    setTimeout(() => {
      setLoading(false);
      console.log("Upload ready");
    }, 1500);
  };

  // 3. Delete photo preview logic
  const handleDelete = (i: number) => {
    const updatedPhotos = values.photos.filter((_, index) => index !== i);
    setFieldValue("photos", updatedPhotos);
    setPhotos((prev) => prev.filter((_, index) => index !== i));
  };

  // Get data logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const catRes = await axios.get("http://localhost:3000/category/all-data");
        const resProduct = await axios.get(
          "http://localhost:3000/product/all-products",
        );
        const allProducts = resProduct.data.products;

        const uniqueData = Array.from(
          new Set(allProducts.map((items: any) => items.category)),
        ).filter(Boolean);
        setProducts(allProducts);
        setCategories(uniqueData as string[]);

        // setCategories(catRes.data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);
// search products


  return (
    <>
      <nav className="">
        <Navbar />
      </nav>

      <main className="">
        <div className="bg-[#f9efe7] dark:bg-black min-h-full lg:flex">
          <aside className="hidden lg:block">
            <AdminSideBar />
          </aside>
          <section className="flex-1 px-5 lg:px-10 pt-5">
            <div className="flex justify-between items-center flex-wrap">
              <div className="mb-5">
                <span className="text-[12px] tracking-[4px] text-yellow-500">
                  Catalog
                </span>
                <h2 className="text-[25px] md:text-[30px] font-cormorant">
                  Products
                </h2>
                <p className="font-inter text-black/60">
                  {products.length} item(s)
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange ={(e)=>setSearchTerm(e.target.value)}
                  placeholder="Search products...."
                  className="border border-black/10 dark:border-white/40 mx-4 pl-10 pr-3 py-1.5 font-inter outline-none shadow"
                />
                <IoSearchOutline className="absolute top-3 left-8" />
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  className="bg-yellow-500 w-40 py-2 mx-15 md:mx-0 mt-3 md:mt-0 md:px-6 md:py-1.5 rounded hover:bg-yellow-400 transition duration-300 font-inter"
                >
                  + New product
                </button>
              </div>
            </div>

            {open && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                <div className="bg-white dark:bg-black dark:border w-full mx-3 p-3 lg:w-1/2 lg:p-5 rounded shadow-lg relative max-h-[90vh] overflow-y-auto transition duration-700">
                  <button
                    onClick={() => {
                      setOpen(false);
                      resetForm();
                    }}
                    className="absolute top-2 right-2 text-black dark:text-white"
                  >
                    <RxCross2 size={25} />
                  </button>
                  <div className="flex items-center gap-2 text-yellow-500">
                    <WiStars />
                    <span className="tracking-[4px] text-[12px] font-inter text-yellow-500">
                      CATALOG
                    </span>
                  </div>

                  <h2 className="text-[25px] font-cormorant mb-4 font-light">
                    New product
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <h2 className="font-inter">Product images</h2>
                    <div
                      className="relative w-full h-48 border-2 border-dashed border-gray-400 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-gray-50 dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={handleClick}
                    >
                      <div className="bg-red-200 p-2 rounded-full">
                        <SlCloudUpload size={35} className="text-red-500" />
                      </div>
                      <p>Drag & drop or click to browse</p>
                      <p className="text-sm text-gray-500">
                        JPEG, JPG, PNG only
                      </p>

                      <input
                        type="file"
                        ref={fileRef}
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleLoading}
                      />
                      <button
                        type="button"
                        className="flex items-center gap-2 bg-yellow-500 px-4 py-1 mt-2"
                        onClick={handleClick}
                      >
                        <SlCloudUpload /> Browse files
                      </button>

                      {loading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                      )}

                      {touched.photos && errors.photos && (
                        <p className="text-sm text-red-500">
                          {String(errors.photos)}
                        </p>
                      )}
                    </div>

                    <div className="grid lg:grid-cols-5 grid-cols-3 gap-2 mt-4">
                      {photos.map((img, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={img}
                            alt="preview"
                            className="w-full h-40 object-cover rounded hover:bg-black"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition rounded" />
                          <button
                            type="button"
                            className="lg:hidden active:block group-hover:block hover:bg-black absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full"
                            onClick={() => handleDelete(i)}
                          >
                            <RxCross2 />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:justify-between gap-2 mt-5">
                      <div className="flex flex-col w-full md:w-1/2">
                        <label htmlFor="name">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter product name.."
                          className="min:w-full border border-gray-300 px-3 py-2 rounded focus:ring-0.5 focus:ring-amber-500 focus:border-amber-600 outline-none"
                        />
                        {touched.name && errors.name && (
                          <p className="text-sm text-red-500">
                            {errors.name} *
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col w-full md:w-1/2">
                        <label htmlFor="slug">Slug</label>
                        <input
                          type="text"
                          name="slug"
                          value={values.slug}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter slug"
                          className="border border-gray-300 px-3 py-2 rounded focus:ring-0.5 focus:ring-amber-500 focus:border-amber-600 outline-none"
                        />
                        {touched.slug && errors.slug && (
                          <p className="text-sm text-red-500">
                            {errors.slug} *
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:justify-between gap-2 mt-5">
                      <div className="flex flex-col w-full md:w-1/2">
                        <label htmlFor="category">Category</label>
                        <select
                          name="category"
                          value={values.category}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border border-gray-300 px-3 py-2 rounded focus:ring-0.5 focus:ring-amber-500 focus:border-amber-600 outline-none"
                        >
                          <option value="">Select category</option>
                          {categories.map((cat: any) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        {touched.category && errors.category && (
                          <p className="text-sm text-red-500">
                            {errors.category} *
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col w-full md:w-1/2">
                        <label htmlFor="gender">Gender</label>
                        <select
                          name="gender"
                          value={values.gender}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border border-gray-300 px-3 py-2 rounded focus:ring-0.5 focus:ring-amber-500 focus:border-amber-600 outline-none"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="unisex">Unisex</option>
                        </select>
                        {touched.gender && errors.gender && (
                          <p className="text-sm text-red-500">
                            {errors.gender} *
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col w-full md:w-1/2">
                        <label htmlFor="stock">Stock</label>
                        <input
                          type="number"
                          name="stock"
                          min="0"
                          value={values.stock}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border border-gray-300 px-3 py-2 rounded focus:ring-0.5 focus:ring-amber-500 focus:border-amber-600 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:justify-between gap-2 mt-5">
                      <div className="flex flex-col w-full md:w-1/2">
                        <label htmlFor="price">Price (NPR)</label>
                        <input
                          type="number"
                          name="price"
                          min="0"
                          value={values.price}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border border-gray-300 px-3 py-2 rounded focus:ring-0.5 focus:ring-amber-500 focus:border-amber-600 outline-none"
                        />
                      </div>
                      <div className="flex flex-col w-full md:w-1/2">
                        <label htmlFor="compare_price">
                          Compare price (optional)
                        </label>
                        <input
                          type="number"
                          name="compare_price"
                          min="0"
                          value={values.compare_price}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border border-gray-300 px-3 py-2 rounded focus:ring-0.5 focus:ring-amber-500 focus:border-amber-600 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:justify-between gap-2 mt-5">
                      <div className="flex flex-col w-full md:w-1/2">
                        <label htmlFor="status">Availability status</label>
                        <select
                          name="status"
                          value={values.status}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border border-gray-300 px-3 py-2 rounded focus:ring-0.5 focus:ring-amber-500 focus:border-amber-600 outline-none"
                        >
                          <option value="in_stock">In Stock</option>
                          <option value="out_of_stock">Out of Stock</option>
                          <option value="unavailable">Unavailable</option>
                        </select>
                      </div>
                    </div>

                    <div className="w-full border border-black/20 bg-gray-300/20 mt-5 h-full rounded px-2 py-5">
                      <h2 className="uppercase px-3 text-[12px] tracking-[4px] text-yellow-500">
                        Product-level discount
                      </h2>
                      <div className="flex flex-col md:flex-row items-start md:justify-between gap-2 mt-5">
                        <div className="flex flex-col w-full md:w-1/2">
                          <label htmlFor="discount_percent">Discount %</label>
                          <input
                            type="number"
                            name="discount_percent"
                            min="0"
                            max="100"
                            id="discount_percent"
                            value={values.discount_percent}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="border border-gray-300 px-3 py-2 rounded focus:ring-0.5 focus:ring-amber-500 focus:border-amber-600 outline-none"
                          />
                        </div>
                        <div className="flex flex-col w-full md:w-1/2">
                          <label htmlFor="discount_amount">
                            Or fixed amount (NPR)
                          </label>
                          <input
                            type="number"
                            name="discount_amount"
                            min="1"
                            id="discount_amount"
                            value={values.discount_amount} // Fixed missing field state binding
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="border border-gray-300 px-3 py-2 rounded focus:ring-0.5 focus:ring-amber-500 focus:border-amber-600 outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row items-start md:justify-between gap-2 mt-5">
                        <div className="flex flex-col w-full md:w-1/2">
                          <label htmlFor="discount_starts_at">Starts</label>
                          <input
                            type="datetime-local"
                            name="discount_starts_at"
                            id="discount_starts_at"
                            value={values.discount_starts_at}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="border border-gray-300 px-3 py-2 rounded focus:ring-0.5 focus:ring-amber-500 focus:border-amber-600 outline-none"
                          />
                        </div>
                        <div className="flex flex-col w-full md:w-1/2">
                          <label htmlFor="discount_ends_at">Ends</label>
                          <input
                            type="datetime-local"
                            name="discount_ends_at"
                            id="discount_ends_at"
                            value={values.discount_ends_at}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="border border-gray-300 px-3 py-2 rounded focus:ring-0.5 focus:ring-amber-500 focus:border-amber-600 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label htmlFor="description">Description</label>
                      <div>
                        <textarea
                          rows={4}
                          name="description"
                          id="description"
                          value={values.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border border-gray-300 px-3 py-2 rounded focus:ring-0.5 focus:ring-amber-500 focus:border-amber-600 outline-none w-full"
                        ></textarea>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label htmlFor="story">Story</label>
                      <div>
                        <textarea
                          rows={2}
                          name="story"
                          id="story"
                          value={values.story}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border border-gray-300 px-3 py-2 rounded focus:ring-0.5 focus:ring-amber-500 focus:border-amber-600 outline-none w-full"
                        ></textarea>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:justify-between gap-2 mt-5">
                      <div className="flex flex-col w-full md:w-1/2">
                        <label htmlFor="sizes">Sizes (comma separated)</label>
                        <input
                          type="text"
                          name="sizes"
                          value={values.sizes}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="min:w-full border border-gray-300 px-3 py-2 rounded focus:ring-0.5 focus:ring-amber-500 focus:border-amber-600 outline-none"
                        />
                      </div>
                      <div className="flex flex-col w-full md:w-1/2">
                        <label htmlFor="colors">Colors (comma separated)</label>
                        <input
                          type="text"
                          name="colors"
                          value={values.colors}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="min:w-full border border-gray-300 px-3 py-2 rounded focus:ring-0.5 focus:ring-amber-500 focus:border-amber-600 outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex gap-5">
                      <div>
                        <input
                          type="checkbox"
                          name="featured"
                          id="featured"
                          onChange={(e) =>
                            setFieldValue("featured", e.target.checked)
                          }
                          checked={values.featured}
                          className="accent-red-700"
                        />
                        <span className="ml-2 text-[12px] md:text-[16px]">
                          Featured on homepage
                        </span>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="active"
                          id="active"
                          onChange={(e) =>
                            setFieldValue("active", e.target.checked)
                          }
                          checked={values.active}
                          className="accent-red-700"
                        />
                        <span className="text-[12px] md:text-[16px] ml-2">
                          Active (visible to shoppers)
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-3">
                      <button
                        type="button"
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
                        className="bg-red-700 px-3 py-1.5 rounded font-inter text-white"
                      >
                        Create Products
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            <AdminProductView  search={searchTerm} />
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminProducts;
