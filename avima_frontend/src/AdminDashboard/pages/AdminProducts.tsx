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
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const processFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(
      (file) =>
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png"
    );

    if (validFiles.length !== fileArray.length) {
      toast.error("Only JPEG, JPG, and PNG files are allowed");
      return;
    }

    if (values.photos.length + validFiles.length > 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }

    setLoading(true);
    setFieldValue("photos", [...values.photos, ...validFiles]);

    const preview = validFiles.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...preview]);

    setTimeout(() => {
      setLoading(false);
      toast.success(`${validFiles.length} file(s) added successfully`);
    }, 500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    processFiles(files);
  };

  const handleLoading = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    processFiles(files);
    e.target.value = ""; // Reset input to allow re-uploading same files
  };

  const handleDelete = (i: number) => {
    // Revoke URL to avoid memory leaks
    URL.revokeObjectURL(photos[i]);
    
    const updatedPhotos = values.photos.filter((_, index) => index !== i);
    setFieldValue("photos", updatedPhotos);
    setPhotos((prev) => prev.filter((_, index) => index !== i));
  };

  const {
    errors,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    touched,
    resetForm,
    isSubmitting,
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
        formData.append("featured", String(values.featured ? 1 : 0));
        formData.append("active", String(values.active ? 1 : 0));
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

        // Cleanup object URLs
        photos.forEach((url) => URL.revokeObjectURL(url));
        
        resetForm();
        setOpen(false);
        setPhotos([]);
        toast.success("Product created successfully!");
        setRefreshKey((prev) => prev + 1);
        console.log(res.data);
      } catch (err) {
        toast.error("Error creating product");
        console.error(err);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProduct = await axios.get(
          "http://localhost:3000/product/all-products",
        );
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
      <main>
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        <div className="bg-[#f9efe7] dark:bg-black min-h-screen lg:flex">
          <aside className="hidden lg:block">
            <AdminSideBar />
          </aside>

          <section className="flex-1 px-5 lg:px-10 pt-5">
            <div className="flex justify-between items-center gap-4">
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

            <AdminProductView search={searchTerm} />

            {open && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-3 animate-fade-in">
                <div className="bg-white dark:bg-zinc-950 dark:border border-zinc-900 w-full max-w-3xl p-5 lg:p-7 rounded-2xl shadow-2xl relative max-h-[92vh] overflow-y-auto custom-scrollbar">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setOpen(false);
                      resetForm();
                      // Cleanup object URLs
                      photos.forEach((url) => URL.revokeObjectURL(url));
                      setPhotos([]);
                    }}
                    className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 transition disabled:opacity-50"
                  >
                    <RxCross2 size={22} />
                  </button>

                  <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                    <WiStars size={22} className="animate-pulse" />
                    <span className="tracking-[4px] text-[11px] font-inter font-bold uppercase">
                      Catalog
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-cormorant font-medium mb-5 text-zinc-900 dark:text-zinc-50">
                    New Product
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <h3 className="font-inter text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        Product Images
                      </h3>
                      <div
                        className={`relative w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition ${
                          loading
                            ? "border-zinc-300 bg-zinc-100 dark:bg-zinc-900 cursor-not-allowed"
                            : isDragOver
                            ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20"
                            : "border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/70"
                        }`}
                        onClick={!loading ? handleClick : undefined}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <div
                          className={`bg-red-50 dark:bg-red-950/20 p-2.5 rounded-full mb-2 transition ${
                            isDragOver ? "scale-110" : ""
                          }`}
                        >
                          <SlCloudUpload
                            size={26}
                            className={`text-red-600 dark:text-red-500 transition ${
                              isDragOver ? "text-amber-500" : ""
                            }`}
                          />
                        </div>
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 text-center">
                          {isDragOver
                            ? "Drop your images here"
                            : "Drag & drop or click to browse"}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5 text-center">
                          JPEG, JPG, PNG only (Max 5)
                        </p>

                        <input
                          type="file"
                          ref={fileRef}
                          multiple
                          accept="image/png, image/jpeg, image/jpg"
                          className="hidden"
                          onChange={handleLoading}
                          disabled={loading}
                        />

                        {loading && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Browse files button */}
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={handleClick}
                          disabled={loading || values.photos.length >= 5}
                          className="px-4 py-1.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Browse Files
                        </button>
                      </div>

                      {touched.photos && errors.photos && (
                        <p className="text-xs text-red-500 font-medium pl-1 text-center">
                          {String(errors.photos)} *
                        </p>
                      )}
                    </div>

                    {photos.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 p-2 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-100 dark:border-zinc-900">
                        {photos.map((img, i) => (
                          <div
                            key={i}
                            className="relative group aspect-square rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm"
                          >
                            <img
                              src={img}
                              alt={`preview-${i}`}
                              className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center" />
                            <button
                              type="button"
                              disabled={isSubmitting}
                              className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full hover:bg-red-600 transition shadow-md disabled:opacity-50"
                              onClick={(e) => {
                                e.stopPropagation();
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
                      <div className="flex flex-col space-y-1.5">
                        <label
                          className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                          htmlFor="name"
                        >
                          Product Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="e.g. Premium Silk Dress"
                          className="w-full border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 px-3 py-2 rounded-xl outline-none focus:border-amber-500 dark:focus:border-amber-500/70 transition text-sm text-zinc-900 dark:text-zinc-100"
                        />
                        {touched.name && errors.name && (
                          <p className="text-xs text-red-500 font-medium">
                            {errors.name} *
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <label
                          className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                          htmlFor="slug"
                        >
                          Product Slug
                        </label>
                        <input
                          type="text"
                          name="slug"
                          id="slug"
                          value={values.slug}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="premium-silk-dress"
                          className="w-full border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 px-3 py-2 rounded-xl outline-none focus:border-amber-500 dark:focus:border-amber-500/70 transition text-sm text-zinc-900 dark:text-zinc-100"
                        />
                        {touched.slug && errors.slug && (
                          <p className="text-xs text-red-500 font-medium">
                            {errors.slug} *
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <label
                          className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                          htmlFor="category"
                        >
                          Category
                        </label>
                        <select
                          name="category"
                          id="category"
                          value={values.category}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded-xl outline-none focus:border-amber-500 transition text-sm text-zinc-900 dark:text-zinc-100"
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        {touched.category && errors.category && (
                          <p className="text-xs text-red-500 font-medium">
                            {errors.category} *
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <label
                          className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                          htmlFor="gender"
                        >
                          Gender Target
                        </label>
                        <select
                          name="gender"
                          id="gender"
                          value={values.gender}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded-xl outline-none focus:border-amber-500 transition text-sm text-zinc-900 dark:text-zinc-100"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="unisex">Unisex</option>
                        </select>
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <label
                          className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                          htmlFor="stock"
                        >
                          Available Stock
                        </label>
                        <input
                          type="number"
                          name="stock"
                          id="stock"
                          min="0"
                          value={values.stock}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 px-3 py-2 rounded-xl outline-none focus:border-amber-500 transition text-sm text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <label
                          className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                          htmlFor="price"
                        >
                          Selling Price (NPR)
                        </label>
                        <input
                          type="number"
                          name="price"
                          id="price"
                          min="0"
                          value={values.price}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="0.00"
                          className="w-full border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 px-3 py-2 rounded-xl outline-none focus:border-amber-500 transition text-sm text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <label
                          className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                          htmlFor="compare_price"
                        >
                          Original / Compare Price (Optional)
                        </label>
                        <input
                          type="number"
                          name="compare_price"
                          id="compare_price"
                          min="0"
                          value={values.compare_price}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="0.00"
                          className="w-full border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 px-3 py-2 rounded-xl outline-none focus:border-amber-500 transition text-sm text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label
                        className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                        htmlFor="status"
                      >
                        Availability Status
                      </label>
                      <select
                        name="status"
                        id="status"
                        value={values.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded-xl outline-none focus:border-amber-500 transition text-sm text-zinc-900 dark:text-zinc-100"
                      >
                        <option value="in_stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                    </div>

                    <div className="border border-zinc-200 dark:border-zinc-900 bg-zinc-50/70 dark:bg-zinc-900/20 rounded-xl p-4 space-y-4">
                      <h4 className="uppercase text-[11px] tracking-[2.5px] text-amber-600 dark:text-amber-500 font-bold">
                        Product-level Discount
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <label
                            className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
                            htmlFor="discount_percent"
                          >
                            Discount %
                          </label>
                          <input
                            type="number"
                            name="discount_percent"
                            id="discount_percent"
                            min="0"
                            max="100"
                            value={values.discount_percent}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 px-3 py-2 rounded-xl outline-none focus:border-amber-500 transition text-sm text-zinc-900 dark:text-zinc-100"
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <label
                            className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
                            htmlFor="discount_amount"
                          >
                            Or Fixed Amount (NPR)
                          </label>
                          <input
                            type="number"
                            name="discount_amount"
                            id="discount_amount"
                            min="1"
                            value={values.discount_amount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 px-3 py-2 rounded-xl outline-none focus:border-amber-500 transition text-sm text-zinc-900 dark:text-zinc-100"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <label
                            className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
                            htmlFor="discount_starts_at"
                          >
                            Starts Promotion
                          </label>
                          <input
                            type="datetime-local"
                            name="discount_starts_at"
                            id="discount_starts_at"
                            value={values.discount_starts_at}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 px-3 py-1.5 rounded-xl outline-none focus:border-amber-500 transition text-sm text-zinc-600 dark:text-zinc-300"
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <label
                            className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
                            htmlFor="discount_ends_at"
                          >
                            Ends Promotion
                          </label>
                          <input
                            type="datetime-local"
                            name="discount_ends_at"
                            id="discount_ends_at"
                            value={values.discount_ends_at}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 px-3 py-1.5 rounded-xl outline-none focus:border-amber-500 transition text-sm text-zinc-600 dark:text-zinc-300"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col space-y-1.5">
                        <label
                          className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                          htmlFor="description"
                        >
                          Short Description
                        </label>
                        <textarea
                          rows={3}
                          name="description"
                          id="description"
                          value={values.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Write a brief product description..."
                          className="border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 px-3 py-2 rounded-xl outline-none w-full text-sm text-zinc-900 dark:text-zinc-100 focus:border-amber-500 transition resize-none"
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <label
                          className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                          htmlFor="story"
                        >
                          Behind the Design / Story
                        </label>
                        <textarea
                          rows={2}
                          name="story"
                          id="story"
                          value={values.story}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="The inspiration behind this release..."
                          className="border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 px-3 py-2 rounded-xl outline-none w-full text-sm text-zinc-900 dark:text-zinc-100 focus:border-amber-500 transition resize-none"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <label
                          className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                          htmlFor="sizes"
                        >
                          Available Sizes (Comma separated)
                        </label>
                        <input
                          type="text"
                          name="sizes"
                          id="sizes"
                          placeholder="S, M, L, XL"
                          value={values.sizes}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 px-3 py-2 rounded-xl outline-none focus:border-amber-500 transition text-sm text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <label
                          className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                          htmlFor="colors"
                        >
                          Available Colors (Comma separated)
                        </label>
                        <input
                          type="text"
                          name="colors"
                          id="colors"
                          placeholder="Red, Blue, Black"
                          value={values.colors}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 px-3 py-2 rounded-xl outline-none focus:border-amber-500 transition text-sm text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-6 py-1 bg-zinc-50 dark:bg-zinc-900/20 px-3 py-2.5 rounded-xl border border-zinc-100 dark:border-zinc-900">
                      <label className="flex items-center cursor-pointer select-none group">
                        <input
                          type="checkbox"
                          name="featured"
                          id="featured"
                          onChange={(e) =>
                            setFieldValue("featured", e.target.checked)
                          }
                          checked={values.featured}
                          disabled={isSubmitting}
                          className="w-4 h-4 accent-red-700"
                        />
                        <span className="ml-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Featured Product
                        </span>
                      </label>

                      <label className="flex items-center cursor-pointer select-none group">
                        <input
                          type="checkbox"
                          name="active"
                          id="active"
                          onChange={(e) =>
                            setFieldValue("active", e.target.checked)
                          }
                          checked={values.active}
                          disabled={isSubmitting}
                          className="w-4 h-4 accent-red-700"
                        />
                        <span className="ml-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Active Visibility
                        </span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => {
                          setOpen(false);
                          resetForm();
                          photos.forEach((url) => URL.revokeObjectURL(url));
                          setPhotos([]);
                        }}
                        className="px-5 py-2 text-sm font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 text-sm font-medium bg-red-700 hover:bg-red-400 text-white rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {isSubmitting && (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        Create Product
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminProducts;