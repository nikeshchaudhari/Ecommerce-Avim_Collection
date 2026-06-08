import { IoSearchOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import AdminSideBar from "../component/AdminSideBar";
import Navbar from "../component/Navbar";
import { useRef, useState, useEffect } from "react";
import { LuCloudUpload } from "react-icons/lu";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

interface FormValues {
  image: File | null;
  caption: string;
}
interface GalleryItem {
  id: string;
  image: string;
  caption?: string;
}

const AdminGallery = () => {
  const [open, setOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [galleryData, setGalleryData] = useState<GalleryItem[]>([]);
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    resetForm,
    isSubmitting,
  } = useFormik<FormValues>({
    initialValues: {
      image: null,
      caption: "",
    },
    validationSchema: Yup.object({
      image: Yup.mixed()
        .required("Please select an image to upload.")
        .test(
          "fileSize",
          "File size exceeds 2MB! Please upload a smaller image.",
          (value) => {
            if (!value) return true;
            return (value as File).size <= 2 * 1024 * 1024; // 2MB Limit
          },
        )
        .test(
          "fileType",
          "Invalid format! Only PNG, JPG, JPEG, and WebP are allowed.",
          (value) => {
            if (!value) return true;
            const allowedTypes = [
              "image/png",
              "image/jpeg",
              "image/jpg",
              "image/webp",
            ];
            return allowedTypes.includes((value as File).type);
          },
        ),
      caption: Yup.string().optional(),
    }),
    onSubmit: async (formValues, { setSubmitting }) => {
      try {
        const formData = new FormData();

        if (formValues.image) {
          formData.append("image", formValues.image);
        }
        formData.append("caption", formValues.caption);

        const response = await axios.post(
          "http://localhost:3000/gallery/add-gallery",
          formData,
        );

        if (response.status === 201 || response.status === 200) {
          toast.success("Image uploaded successfully.");
          resetForm();
          setOpen(false);
        }
      } catch (error: any) {
        console.error("Upload Error Details:", error);
        const serverErrorMessage =
          error.response?.data?.message || "Failed to upload image.";
        toast.error(serverErrorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleFileSelection = (file: File) => {
    setFieldValue("image", file);
    setFieldTouched("image", true, true);
  };

  useEffect(() => {
    if (touched.image && errors.image) {
      toast.error(errors.image as string);
    }
  }, [errors.image, touched.image]);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFieldValue("image", null);
    setFieldTouched("image", false);
  };

  const isImageValid = values.image && !errors.image;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/gallery/all-gallery",
        );
        setGalleryData(res.data.gallery);
      } catch (err) {
        console.error("Fetch Data Error:", err);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <main>
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        <div className="bg-[#f9efe7] dark:bg-black min-h-screen lg:flex">
          <aside className="hidden lg:block  ">
            <AdminSideBar />
          </aside>

          <section className="w-full px-5 lg:px-10 pt-5 flex md:justify-between">
            <div className="min-w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <span className="text-[12px] tracking-[4px] text-yellow-500 font-semibold uppercase">
                    Editorial
                  </span>

                  <h2 className="text-[25px] md:text-[30px] font-cormorant">
                    Lookbook Gallery
                  </h2>

                  <p className="font-inter text-black/60 dark:text-white/60">
                    {galleryData.length} image(s)
                  </p>
                </div>

                <div className="w-full md:w-auto">
                  <button
                    onClick={() => setOpen(true)}
                    type="button"
                    className="w-full md:w-auto bg-yellow-500 px-6 py-1.5 rounded hover:bg-yellow-400 transition duration-300 font-inter text-black font-medium"
                  >
                    + Add Image
                  </button>
                </div>
              </div>
            </div>

            {open && (
              <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 animate-fadeIn">
                <div className="bg-white dark:bg-black dark:border border-zinc-800 w-full mx-3 p-4 lg:w-1/2 lg:p-6 rounded-xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      resetForm();
                    }}
                    className="absolute top-4 right-4 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition"
                  >
                    <RxCross2 size={24} />
                  </button>

                  <div className="mb-6">
                    <div className="flex items-center gap-1.5 text-amber-500 font-semibold tracking-[3px] text-[11px] uppercase">
                      <span className="text-sm">✨</span> Lookbook
                    </div>
                    <h2 className="text-2xl md:text-[26px] font-serif font-medium text-stone-900 dark:text-stone-100 mt-1">
                      Add gallery image
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition text-center min-h-55 ${dragActive
                          ? "border-amber-500 bg-amber-50/40"
                          : "border-stone-300 dark:border-zinc-800 hover:border-stone-400 bg-[#f7f2ea]/40 dark:bg-zinc-900/30"
                        } ${touched.image && errors.image ? "border-red-500 bg-red-50/20" : ""}`}
                    >
                      <input
                        type="file"
                        ref={fileRef}
                        onChange={handleFileChange}
                        accept=".png,.jpg,.jpeg,.webp"
                        className="hidden"
                      />
                      <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-600 dark:text-red-400 mb-4 shadow-sm">
                        <LuCloudUpload size={25} />
                      </div>
                      <p className="text-base font-inter font-medium text-stone-800 dark:text-stone-200">
                        {isImageValid
                          ? (values.image as File).name
                          : "Drag & drop or click to browse"}
                      </p>
                      <p className="text-xs font-inter text-stone-500 dark:text-stone-400 mt-1">
                        PNG, JPG, WebP · Max 2MB
                      </p>
                      <button
                        type="button"
                        className="mt-5 px-6 py-2 bg-[#f4b324] hover:bg-amber-500 text-stone-950 font-inter font-bold text-xs tracking-wider rounded-md uppercase flex items-center gap-2 shadow-sm transition-colors"
                      >
                        <LuCloudUpload size={14} className="stroke-3" />
                        Browse File
                      </button>
                    </div>

                    {touched.image && errors.image && (
                      <p className="text-red-500 text-xs mt-1 font-medium">
                        {errors.image as string}
                      </p>
                    )}

                    {/* image preview                      */}
                    {isImageValid && (
                      <div className="flex justify-center pt-2">
                        <div className="relative w-32 h-32 border dark:border-zinc-800 rounded-lg overflow-hidden bg-stone-100 shadow-sm">
                          <img
                            src={URL.createObjectURL(values.image as File)}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile();
                            }}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-black rounded-full flex items-center justify-center text-white text-xs transition"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-inter font-medium text-stone-800 dark:text-stone-300">
                        Caption (optional)
                      </label>
                      <input
                        type="text"
                        name="caption"
                        value={values.caption}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border border-stone-300 dark:border-zinc-800 bg-[#f7f2ea]/30 dark:bg-zinc-900 rounded-md px-4 py-2.5 font-inter text-stone-900 dark:text-stone-100 outline-none shadow-inner focus:border-stone-400 dark:focus:border-zinc-700 transition"
                      />
                    </div>

                    <div className="flex justify-end items-center gap-4 pt-4 border-t border-stone-200/60 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          resetForm();
                        }}
                        className="px-5 py-2 text-sm font-inter font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2.5 bg-[#781c24] hover:bg-red-900 text-white font-inter font-bold text-sm rounded shadow-md transition-colors ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                      >
                        {isSubmitting ? "Uploading..." : "Add to gallery"}
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

export default AdminGallery;
