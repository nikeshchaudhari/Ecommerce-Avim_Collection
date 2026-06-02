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

const AdminProducts = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);

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

  // file upload

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileRef.current?.click();
  };

  // loading

  const handleLoading = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files) return;
    const totalPhoto = values.photos.length + files.length;
    if (totalPhoto > 5) {
      alert("Maximum 5 photos Allowed");
      return;
    }

    const updatedFiles = [...values.photos, ...files];
    setFieldValue("photos", updatedFiles);
    console.log(setFieldValue);

    const preview = files.map((file) => URL.createObjectURL(file));

    setPhotos((prev) => [...prev, ...preview]);

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      console.log("Upload ready");
    }, 1500);
  };

  // delete photo preview

  const handleDelete = (i: any) => {
    setPhotos((prev) => prev.filter((_, index) => index !== i));
  };

  // validation

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
      photos: [] as File[],
    },
    validationSchema: AdminProduct,
    onSubmit: async (values) => {
      console.log("SUBMIT WORKING", values);
      const token = localStorage.getItem("token");

      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("slug", values.slug);
        formData.append("categoryId", values.category);
        formData.append("gender", values.gender);
        formData.append("stock", String(values.stock));
        formData.append("price", String(values.price));
        if (values.compare_price) {
          formData.append("compare_price", String(values.compare_price));
        }

        values.photos.forEach((file: File) => {
          formData.append("photos", file);
        });

        const res = await axios.post(
          "http://localhost:3000/product/add-products",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // "Content-Type": "multipart/form-data",
            },
          },
        );
        resetForm();
        setOpen(false);
        setPhotos([]);
        console.log(res.data);
      } catch (err) {
        toast.error("Error");
      }
    },
  });

  // getdata
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await axios.get(
          "http://localhost:3000/category/all-data",
        );
        const genderRes = await axios.get(
          "http://localhost:3000/product/all-products",
        );

        setCategories(catRes.data.categories);
        // console.log(catRes.data.categories.categoryName);

        setGenders(genderRes.data.products);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
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
            <div className="flex justify-between  ">
              <div className="mb-5">
                <span className="text-[12px] tracking-[4px] text-yellow-500">
                  Catalog
                </span>

                <h2 className="text-[25px] md:text-[30px] font-cormorant">
                  Products
                </h2>

                <p className="font-inter text-black/60">61 item(s)</p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products...."
                  className="border border-black/10 dark:border-white/40 mx-4 pl-10 pr-3  py-1.5 font-inter outline-none shadow "
                />
                <IoSearchOutline className="absolute top-3 left-8" />
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  className="bg-yellow-500 w-40 py-2 mx-15 md:mx-0 mt-3 md:mt-0  md:px-6  md:py-1.5 rounded hover:bg-yellow-400 transition duration-300 font-inter"
                >
                  + New product
                </button>
              </div>
            </div>
            {/* added catalog  */}
            {open && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white dark:bg-black dark:border w-full mx-3 p-3  lg:w-1/2 lg:p-5 rounded shadow-lg relative  max-h-[90vh] overflow-y-auto transition duration-700  ">
                  {/* close button */}
                  <button
                    onClick={() => setOpen(false)}
                    className="absolute top-2 right-2 text-black dark:text-white"
                  >
                    <RxCross2 size={25} />
                  </button>
                  <div className="flex items-center gap-2  text-yellow-500 ">
                    <WiStars />
                    <span className=" tracking-[4px] text-[12px] font-inter text-yellow-500">
                      CATALOG
                    </span>
                  </div>

                  <h2 className="text-[25px] font-cormorant mb-4 font-light">
                    New product
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <h2 className="font-inter">Product images</h2>
                    {/* image */}
                    <div
                      className="relative w-full h-48 border-2 border-dashed border-gray-400 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-gray-50 dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={handleClick}
                    >
                      <div className="bg-red-200  p-2 rounded-full">
                        <SlCloudUpload size={35} className="text-red-500 " />
                      </div>
                      <p> Drag & drop or click to browse</p>
                      <p className="text-sm text-gray-500">
                        JPEG, JPG,PNG only
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
                        className=" flex  items-center  gap-2 bg-yellow-500 px-4 py-1 mt-2"
                        onClick={handleClick}
                      >
                        <SlCloudUpload /> Browser files
                      </button>

                      {loading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="grid lg:grid-cols-5 grid-cols-3 gap-2 mt-4 ">
                      {photos.map((img, i) => (
                        <div key={i} className="relative group  ">
                          <img
                            src={img}
                            alt="preview"
                            className="w-full h-40 object-cover rounded hover:bg-black "
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition rounded" />

                          <button
                            className=" lg:hidden active:block group-hover:block hover:bg-black absolute  top-1 right-1 bg-black/60 text-white p-1 rounded-full"
                            onClick={() => handleDelete(i)}
                          >
                            <RxCross2 />
                          </button>
                        </div>
                      ))}
                    </div>
                    {/* input field */}
                    <div className="flex justify-between gap-2 mt-5">
                      <div className="flex flex-col w-1/2">
                        <label htmlFor="name">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter product name.."
                          className=" border border-gray-300
    px-3 py-2 rounded
    focus:ring-0.5
    focus:ring-amber-500
    focus:border-amber-600 outline-none"
                        />
                        {touched.name && errors.name && (
                          <p className="text-sm text-red-500">
                            {errors.name} *
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col w-1/2">
                        <label htmlFor="name">Slug</label>
                        <input
                          type="text"
                          name="slug"
                          value={values.slug}
                          onChange={handleChange}
                          placeholder="Enter slug "
                          className="border border-gray-300
    px-3 py-2 rounded
    focus:ring-0.5
    focus:ring-amber-500
    focus:border-amber-600 outline-none"
                        />
                        {touched.slug && errors.slug && (
                          <p className="text-sm text-red-500">
                            {errors.slug} *
                          </p>
                        )}
                      </div>
                    </div>
                    {/*  */}
                    <div className="flex justify-between gap-2 mt-5">
                      <div className="flex flex-col w-1/2">
                        <label htmlFor="categoty">Category</label>
                        <select
                          name="category"
                          value={values.category}
                          onChange={handleChange}
                          className="border border-gray-300
    px-3 py-2 rounded
    focus:ring-0.5
    focus:ring-amber-500
    focus:border-amber-600 outline-none"
                        >
                          <option value="">Select category</option>
                          {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.categoryName}
                            </option>
                          ))}
                        </select>
                        {touched.category && errors.category && (
                          <p className="text-sm text-red-500">
                            {errors.category} *
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col w-1/2">
                        <label htmlFor="gender">Gender</label>
                        <select
                          name="gender"
                          value={values.gender}
                          onChange={handleChange}
                          className="border border-gray-300
    px-3 py-2 rounded
    focus:ring-0.5
    focus:ring-amber-500
    focus:border-amber-600 outline-none"
                        >
                          <option value="">Select Gender</option>
                          {genders.map((gen: any) => (
                            <option value={gen.gender} key={gen.id}>
                              {gen.gender}
                            </option>
                          ))}
                        </select>
                        {touched.gender && errors.gender && (
                          <p className="text-sm text-red-500">
                            {errors.gender} *
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col w-1/2">
                        <label htmlFor="stock">Stock</label>
                        <input
                          type="number"
                          name="stock"
                          value={values.stock}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border border-gray-300
    px-3 py-2 rounded
    focus:ring-0.5
    focus:ring-amber-500
    focus:border-amber-600 outline-none"
                        />
                      </div>
                    </div>
                    {/*  */}
                    {/* input field */}
                    <div className="flex justify-between gap-2 mt-5">
                      <div className="flex flex-col w-1/2">
                        <label htmlFor="price">Price (NPR)</label>
                        <input
                          type="number"
                          name="price"
                          value={values.price}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className=" border border-gray-300
    px-3 py-2 rounded
    focus:ring-0.5
    focus:ring-amber-500
    focus:border-amber-600 outline-none"
                        />
                      </div>
                      <div className="flex flex-col w-1/2">
                        <label htmlFor="compare_price">
                          Compare price (optional)
                        </label>
                        <input
                          name="compare_price"
                          value={values.compare_price}
                          onChange={handleChange}
                          type="number"
                          className="border border-gray-300
    px-3 py-2 rounded
    focus:ring-0.5
    focus:ring-amber-500
    focus:border-amber-600 outline-none"
                        />
                      </div>
                    </div>
                    {/*  */}
                    dfds
                    {/* button */}
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
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminProducts;
