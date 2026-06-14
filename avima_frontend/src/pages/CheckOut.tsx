import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { LuTag, LuMessageCircle } from "react-icons/lu";
import UserNavbar from "../components/UserNavbar";

const Checkout = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isOpen = useSelector((state: RootState) => state.cartOpen.isOpen);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const cart = JSON.parse(localStorage.getItem(`cart_${user.id}`) || "[]");
  console.log(cart);



  return (
    <>
      <div className="bg-[#FAF5EC] dark:bg-black min-h-screen text-[#1C1C1C] font-sans antialiased selection:bg-transparent">
        <div>
          <UserNavbar />
        </div>

        {isOpen && (
          <div className="px-4 sm:px-6 lg:px-12 py-16">
            <div className="max-w-6xl mx-auto">
              {/* PAGE MAIN TITLE & SUBTITLE */}
              <div className="mb-12">
                <div className="font-serif text-[38px] text-[#1C1C1C] tracking-wide mb-1">
                  Checkout
                </div>
                <div className="text-[15px] text-gray-500 font-normal">
                  Review and send your order to our atelier on WhatsApp.
                </div>
              </div>

              {/* TWO COLUMN GRID CONTAINER */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                {/* LEFT PANEL: INPUT FIELDS FORM */}
                <div className="lg:col-span-7 space-y-6">
                  {/* FULL NAME */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-gray-800">
                      Full name <span className="text-[#80162B]">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      
                      className="w-full bg-[#FAF8F5] border border-gray-300 h-11 px-4 text-[14px] focus:outline-none focus:border-gray-500 transition-colors disabled:opacity-60"
                      placeholder="Your name"
                    />
                  </div>

                  {/* PHONE & CITY GRID ROW */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[14px] font-medium text-gray-800">
                        Phone <span className="text-[#80162B]">*</span>
                      </label>
                      <input
                        type="text"
                        name="phone"
                      
                        className="w-full bg-[#FAF8F5] border border-gray-300 h-11 px-4 text-[14px] focus:outline-none focus:border-gray-500 transition-colors disabled:opacity-60"
                        placeholder="Mobile number"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[14px] font-medium text-gray-800">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                       
                        className="w-full bg-[#FAF8F5] border border-gray-300 h-11 px-4 text-[14px] focus:outline-none focus:border-gray-500 transition-colors disabled:opacity-60"
                        placeholder="e.g. Kathmandu"
                      />
                    </div>
                  </div>

                  {/* SHIPPING ADDRESS */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-gray-800">
                      Shipping address
                    </label>
                    <textarea
                      name="shippingAddress"
                    
                      rows={4}
                      className="w-full bg-[#FAF8F5] border border-gray-300 p-4 text-[14px] focus:outline-none focus:border-gray-500 transition-colors resize-none disabled:opacity-60"
                      placeholder="Area, Street name, House No..."
                    />
                  </div>

                  {/* ORDER NOTES */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-gray-800">
                      Order notes
                    </label>
                    <textarea
                      name="orderNotes"
                     
                      rows={4}
                      className="w-full bg-[#FAF8F5] border border-gray-300 p-4 text-[14px] focus:outline-none focus:border-gray-500 transition-colors resize-none disabled:opacity-60"
                      placeholder="Tailoring, fabric preferences..."
                    />
                  </div>

                  {/* SUBMISSION BUTTON MIXED WITH LOADING SPINNER ARCHITECTURE */}
                  <button
                    type="button"
                    
                    className="w-full bg-[#1BD741] text-white font-sans text-[15px] font-semibold tracking-wide h-13 flex items-center justify-center gap-2 rounded cursor-pointer hover:bg-[#18c33a] transition-colors select-none mt-8 shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {/* {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <div>Processing Order...</div>
                      </div>
                    ) : (
                      <>
                        <LuMessageCircle
                          size={19}
                          className="fill-white stroke-none"
                        />
                        <div>Confirm via WhatsApp</div>
                      </>
                    )} */}

                    Confirm via WhatsApp
                  </button>
                </div>

                {/* RIGHT PANEL: ORDER SUMMARY */}
                <div className="lg:col-span-5 bg-white border border-gray-200/60 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
                  <div className="font-serif text-[22px] text-gray-900 tracking-wide mb-8">
                    Your Order
                  </div>

                  {/* ITEMS BRIEF SPECIFICATIONS LAYER */}
                  <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1 mb-6">
                    {cartItems.length === 0 ? (
                      <div className="text-gray-400 font-serif text-sm">
                        No items in cart
                      </div>
                    ) : (
                      cartItems.map((item: any, idx: number) => (
                        <div
                          key={item.id || idx}
                          className="flex justify-between items-start text-[14px] text-gray-800 py-1"
                        >
                          <div className="max-w-[70%]">
                            <span className="font-medium">
                              {item.name || "Product"}
                            </span>
                            <div className="text-[11px] text-gray-400 mt-0.5">
                              {item.size ? `${item.size} ` : ""}
                              {item.color ? `· ${item.color} ` : ""}×{" "}
                              {item.quantity || 1}
                            </div>
                          </div>
                          <div className="font-medium whitespace-nowrap text-right">
                            NPR{" "}
                            {(
                              (item.price || 0) * (item.quantity || 1)
                            ).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* BILLING PRICINGS BREAKDOWN */}
                  <div className="space-y-5 pb-6 border-b border-gray-200 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-[14px]">
                      <div className="text-gray-500">Subtotal</div>
                      <div className="font-medium text-gray-900">
                        NPR 500
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[14px]">
                      <div className="text-gray-500">VAT (13%)</div>
                      <div className="font-medium text-gray-900">
                        NPR 5000
                      </div>
                    </div>
                  </div>

                  {/* COUPON INPUT LAYER */}
                  <div className="py-6 border-b border-gray-200">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.12em] text-gray-500 uppercase mb-3">
                      <LuTag size={12} className="rotate-90 text-gray-400" />
                      <div>Have a coupon?</div>
                    </div>

                    <div className="flex gap-2 h-10 w-full">
                      <div className="flex-1 bg-[#FAF8F5] border border-gray-300 px-3 text-[12px] tracking-wider text-gray-400 uppercase flex items-center select-none">
                        ENTER CODE
                      </div>
                      <div className="bg-[#5C1321] text-white text-[12px] font-semibold tracking-wide px-6 h-full flex items-center justify-center cursor-pointer hover:bg-[#4a0f1a] transition-colors select-none">
                        Apply
                      </div>
                    </div>
                  </div>

                  {/* GRAND COMPOSITE TOTAL ROW */}
                  <div className="py-6 flex justify-between items-baseline">
                    <div className="font-serif text-[16px] text-gray-800">
                      Total
                    </div>
                    <div className="font-sans font-medium text-[22px] text-[#80162B]">
                      NPR fgfg
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Checkout;
