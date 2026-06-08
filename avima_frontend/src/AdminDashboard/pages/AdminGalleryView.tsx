import axios from "axios";
import { useState, useEffect } from "react";
import { LuTrash2 } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";

interface GalleryItem {
  id?: number | string;
  image_url: string;
  caption?: string;
}

const AdminGalleryView = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/gallery/all-gallery");
      setImages(res.data.gallery || res.data.data || res.data || []);
    } catch (err) {
      console.error("Fetch Data Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🗑️ Delete Image Handler
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `http://localhost:3000/gallery/delete/${deleteId}`,
      );

      if (response.status === 200 || response.status === 204) {
        toast.success("Image deleted successfully.");
        setDeleteId(null);
        fetchData();
      }
    } catch (error: any) {
      console.error("Delete Error:", error);
      const serverErrorMessage =
        error.response?.data?.message || "Failed to delete image.";
      toast.error(serverErrorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <main className="dark:bg-zinc-950 min-h-screen text-stone-900 dark:text-stone-100 py-8 px-5 lg:px-10">
        <section className="max-w-7xl mx-auto w-full space-y-6">
          {loading ? (
            <p className="text-center py-12 text-stone-400">
              Loading gallery pieces...
            </p>
          ) : images.length === 0 ? (
            <p className="text-center py-12 text-stone-400">
              No images available.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((item) => {
                const itemId = item.id !== undefined ? item.id : item.id || "";

                const imgUrl = item.image_url?.startsWith("http")
                  ? item.image_url
                  : item.image_url
                    ? `http://localhost:3000/${item.image_url}`
                    : "https://placehold.co/400x500?text=No+Image";

                return (
                  <div
                    key={itemId.toString()}
                    className="group relative flex flex-col bg-[#fcfaf6] dark:bg-zinc-900 rounded-2xl overflow-hidden border border-stone-200/40 dark:border-zinc-800/40 shadow-sm transition-all duration-300"
                  >
                    {/* Delete Button */}
                    <div className="absolute top-3 right-3 z-10 opacity-0 translate-y-[-5px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                      <button
                        onClick={() => setDeleteId(itemId)} // क्लिक गर्दा ID स्टेटमा बस्छ र मोडल खुल्छ
                        type="button"
                        className="p-2 bg-white/90 dark:bg-zinc-800/90 text-stone-700 dark:text-stone-200 rounded-xl shadow-lg backdrop-blur-sm hover:bg-red-600 hover:text-white transition-colors duration-200"
                        title="Delete Image"
                      >
                        <LuTrash2 size={16} />
                      </button>
                    </div>

                    <div className="aspect-[4/5] w-full overflow-hidden bg-stone-100 dark:bg-zinc-900">
                      <img
                        src={imgUrl}
                        alt={item.caption || "Gallery piece"}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.01]"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-3 bg-[#fcfaf6] dark:bg-zinc-900 min-h-[44px] flex items-center">
                      <p className="text-[13px] text-stone-500 dark:text-stone-400 truncate w-full pl-1">
                        {item.caption || "Untitled"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

{/* delete popup model */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 dark:border border-zinc-800 w-full max-w-md p-6 rounded-2xl shadow-2xl relative transition-all transform scale-100">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setDeleteId(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition"
            >
              <RxCross2 size={20} />
            </button>

            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-4 shadow-sm">
                <LuTrash2 size={22} />
              </div>
              <h3 className="text-lg font-semibold font-inter text-stone-900 dark:text-stone-100">
                Delete Image
              </h3>
              <p className="text-sm font-inter text-stone-500 dark:text-stone-400 mt-2 max-w-[280px]">
                Are you sure you want to delete this gallery piece? This action
                cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-sm font-medium font-inter text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-zinc-800 rounded-xl hover:bg-stone-200 dark:hover:bg-zinc-700/80 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-sm font-bold font-inter text-white bg-red-600 rounded-xl hover:bg-red-700 active:bg-red-800 shadow-md transition disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminGalleryView;
