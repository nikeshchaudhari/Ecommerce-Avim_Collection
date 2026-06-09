import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { IoLogoWhatsapp, IoMailOutline, IoLocationOutline, IoLogoInstagram } from "react-icons/io5";
import { FiSave } from "react-icons/fi";
import AdminSideBar from "../component/AdminSideBar";
import Navbar from "../component/Navbar";

const AdminSetting = () => {
  // Database ko column names matching initial state
  const [settings, setSettings] = useState({
    whatsapp_number: "",
    store_email: "",
    store_address: "",
    instagram_handle: "",
  });

  const [loadingField, setLoadingField] = useState<string | null>(null);

  // 1. Data Fetching (GET) - Real Column Names Map gareko
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("http://localhost:3000/store/setting/");
        if (res.data) {
          // Backend table ko column data anusar map gareko
          setSettings({
            whatsapp_number: res.data.whatsapp_number || "",
            store_email: res.data.store_email || "",
            store_address: res.data.store_address || "",
            instagram_handle: res.data.instagram_handle || "",
          });
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
        toast.error("Failed to load store settings.");
      }
    };
    fetchSettings();
  }, []);

  // Input typing edit huna ko lagi (Ondata change handler)
  const handleChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  // 2. Data Updating (POST) - Table column name kai payload jancha
  const handleSaveField = async (columnName: string, backendEndpoint: string, displayLabel: string) => {
    setLoadingField(columnName);
    const token = localStorage.getItem("token");

    try {
      // Send dynamic object key matching your table column (e.g., { whatsapp_number: '...' })
      const payload = { [columnName]: settings[columnName as keyof typeof settings] };
      
      await axios.post(`http://localhost:3000/api/settings/${backendEndpoint}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(`${displayLabel} updated successfully!`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to save ${displayLabel.toLowerCase()}`);
    } finally {
      setLoadingField(null);
    }
  };

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

          <section className="flex-1 px-5 lg:px-10 pt-5 pb-10">
            {/* Header Titles */}
            <div className="mb-8">
              <span className="text-[12px] tracking-[4px] text-yellow-500 uppercase font-semibold">
                Configuration
              </span>
              <h2 className="text-[25px] md:text-[30px] font-cormorant font-medium text-zinc-900 dark:text-zinc-50">
                Store Settings
              </h2>
            </div>

            {/* 2-Column Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
              
              {/* WhatsApp Number Card */}
              <div className="bg-[#FAF6F0] dark:bg-zinc-900 border border-gray-200/60 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#A71D24] dark:text-red-400 font-medium mb-3">
                    <IoLogoWhatsapp size={19} />
                    <span className="text-sm font-semibold tracking-wide">WhatsApp Number</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={settings.whatsapp_number}
                      onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                      className="flex-1 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 rounded px-4 py-2 text-gray-800 dark:text-zinc-200 shadow-sm focus:outline-none focus:border-[#A71D24] dark:focus:border-red-400 text-sm"
                    />
                    <button
                      type="button"
                      disabled={loadingField === "whatsapp_number"}
                      onClick={() => handleSaveField("whatsapp_number", "whatsapp", "WhatsApp Number")}
                      className="bg-[#61161A] hover:bg-[#4d1114] text-white p-2.5 rounded transition-colors flex items-center justify-center w-12 h-[38px] disabled:opacity-50"
                    >
                      {loadingField === "whatsapp_number" ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <FiSave size={18} />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-2.5">
                  Used for checkout deep-links. Format: +97798XXXXXXXX
                </p>
              </div>

              {/* Store Email Card */}
              <div className="bg-[#FAF6F0] dark:bg-zinc-900 border border-gray-200/60 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-2 text-[#A71D24] dark:text-red-400 font-medium mb-3">
                  <IoMailOutline size={19} />
                  <span className="text-sm font-semibold tracking-wide">Store Email</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={settings.store_email}
                    onChange={(e) => handleChange("store_email", e.target.value)}
                    className="flex-1 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 rounded px-4 py-2 text-gray-800 dark:text-zinc-200 shadow-sm focus:outline-none focus:border-[#A71D24] dark:focus:border-red-400 text-sm"
                  />
                  <button
                    type="button"
                    disabled={loadingField === "store_email"}
                    onClick={() => handleSaveField("store_email", "email", "Store Email")}
                    className="bg-[#61161A] hover:bg-[#4d1114] text-white p-2.5 rounded transition-colors flex items-center justify-center w-12 h-[38px] disabled:opacity-50"
                  >
                    {loadingField === "store_email" ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FiSave size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Store Address Card */}
              <div className="bg-[#FAF6F0] dark:bg-zinc-900 border border-gray-200/60 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-2 text-[#A71D24] dark:text-red-400 font-medium mb-3">
                  <IoLocationOutline size={19} />
                  <span className="text-sm font-semibold tracking-wide">Store Address</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.store_address}
                    onChange={(e) => handleChange("store_address", e.target.value)}
                    className="flex-1 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 rounded px-4 py-2 text-gray-800 dark:text-zinc-200 shadow-sm focus:outline-none focus:border-[#A71D24] dark:focus:border-red-400 text-sm"
                  />
                  <button
                    type="button"
                    disabled={loadingField === "store_address"}
                    onClick={() => handleSaveField("store_address", "address", "Store Address")}
                    className="bg-[#61161A] hover:bg-[#4d1114] text-white p-2.5 rounded transition-colors flex items-center justify-center w-12 h-[38px] disabled:opacity-50"
                  >
                    {loadingField === "store_address" ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FiSave size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Instagram Handle Card */}
              <div className="bg-[#FAF6F0] dark:bg-zinc-900 border border-gray-200/60 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-2 text-[#A71D24] dark:text-red-400 font-medium mb-3">
                  <IoLogoInstagram size={19} />
                  <span className="text-sm font-semibold tracking-wide">Instagram Handle</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.instagram_handle}
                    onChange={(e) => handleChange("instagram_handle", e.target.value)}
                    className="flex-1 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 rounded px-4 py-2 text-gray-800 dark:text-zinc-200 shadow-sm focus:outline-none focus:border-[#A71D24] dark:focus:border-red-400 text-sm"
                  />
                  <button
                    type="button"
                    disabled={loadingField === "instagram_handle"}
                    onClick={() => handleSaveField("instagram_handle", "instagram", "Instagram Handle")}
                    className="bg-[#61161A] hover:bg-[#4d1114] text-white p-2.5 rounded transition-colors flex items-center justify-center w-12 h-[38px] disabled:opacity-50"
                  >
                    {loadingField === "instagram_handle" ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FiSave size={18} />
                    )}
                  </button>
                </div>
              </div>

            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminSetting;