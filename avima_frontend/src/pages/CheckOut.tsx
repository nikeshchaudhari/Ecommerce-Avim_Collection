import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { LuTag, LuMessageCircle } from "react-icons/lu";
import UserNavbar from "../components/UserNavbar";
import { useFormik } from "formik";
import { CheckOut } from "../Schemas/CheckOut";
import axios from "axios";
import { toast } from "react-toastify";
import { clearCart } from "../features/cartSlice";

const Checkout = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isOpen = useSelector((state: RootState) => state.cartOpen.isOpen);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const cart = JSON.parse(localStorage.getItem(`cart_${user.id}`) || "[]");
  const dispatch: AppDispatch = useDispatch();
  const itemsSubtotal = cartItems.reduce(
    (sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1),
    0,
  );
  const vatAmount = itemsSubtotal * 0.13; // 13% VAT
  const orderTotal = itemsSubtotal + vatAmount;

  const {
    errors,
    values,
    handleChange,
    handleSubmit,
    handleBlur,
    touched,
    isSubmitting,
    resetForm,
  } = useFormik({
    initialValues: {
      customerName: user.fullName || "",
      customerPhone: user.phone || "",
      shippingAddress: user.address || "",
      orderNotes: "",
    },
    validationSchema: CheckOut,
    onSubmit: async (formValues: any) => {
      try {
        const items = cartItems.map((item: any) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price,
        }));
        console.log(items);
        const order = {
          userId: user.id,
          customerName: formValues.customerName,
          customerPhone: formValues.customerPhone,
          shippingAddress: formValues.shippingAddress,
          status: "pending",
          items: items || [],
          total: orderTotal,
          notes: formValues.orderNotes || "",
          whatsapp_message: "",
        };

        const res = await axios.post(
          "http://localhost:3000/order/add-order",
          order,
        );

        const whatAppsMessage = `
        ✦ AVIMA — Order / Bill ✦
        CustomerName: ${values.customerName}
        PhoneNumber: ${values.customerPhone}
        ShippingAddress: ${values.shippingAddress}
        Total: $ ${orderTotal}
        Order ID: ${res.data.orderId}
        `;

        window.open()

        dispatch(clearCart());
        console.log(res.data);
        toast.success("Order Placed Successfully!");
        localStorage.removeItem(`cart_${user.id}`);
        resetForm();
      } catch (error) {
        console.error(error);
        toast.error("Failed to register order request. Please try again.");
      }
    },
  });

  return (
    <>
      <div className="bg-[#FAF5EC] dark:bg-black min-h-screen text-[#1C1C1C] dark:text-white font-sans antialiased selection:bg-transparent">
        <div>
          <UserNavbar />
        </div>

        {isOpen && (
          <div className="px-4 sm:px-6 lg:px-12 py-10 lg:py-16">
            <div className="max-w-6xl mx-auto">
              {/* PAGE MAIN TITLE & SUBTITLE */}
              <div className="mb-8 lg:mb-12 text-center lg:text-left">
                <div className="font-serif text-[32px] sm:text-[38px] text-[#1C1C1C] dark:text-white tracking-wide mb-1">
                  Checkout
                </div>
                <div className="text-[14px] sm:text-[15px] text-gray-500 dark:text-gray-400 font-normal">
                  Review and send your order to our atelier on WhatsApp.
                </div>
              </div>

              {/* FORM WRAPPER GRID - STACKS RESPONSIVELY WITH ORDER ON TOP ON MOBILE */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-10 lg:gap-16 items-start"
              >
                {/* LEFT PANEL: INPUT FIELDS FORM */}
                <div className="w-full lg:col-span-7 space-y-6">
                  {/* FULL NAME INPUT ROW */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-gray-800 dark:text-gray-200">
                      Full name <span className="text-[#80162B]">*</span>
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={values.customerName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full dark:text-white bg-[#FAF8F5] dark:bg-zinc-900 border ${
                        touched.customerName && errors.customerName
                          ? "border-red-500"
                          : "border-gray-300 dark:border-zinc-700"
                      } h-11 px-4 text-[14px] focus:outline-none focus:border-gray-500 transition-colors`}
                      placeholder="Your name"
                    />
                    {touched.customerName && errors.customerName && (
                      <span className="text-xs text-red-500 font-medium">
                        {String(errors.customerName)}
                      </span>
                    )}
                  </div>

                  {/* PHONE NUMBER INPUT ROW */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-gray-800 dark:text-gray-200">
                      Phone <span className="text-[#80162B]">*</span>
                    </label>
                    <input
                      type="text"
                      name="customerPhone"
                      value={values.customerPhone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full dark:text-white bg-[#FAF8F5] dark:bg-zinc-900 border ${
                        touched.customerPhone && errors.customerPhone
                          ? "border-red-500"
                          : "border-gray-300 dark:border-zinc-700"
                      } h-11 px-4 text-[14px] focus:outline-none focus:border-gray-500 transition-colors`}
                      placeholder="Mobile number"
                    />
                    {touched.customerPhone && errors.customerPhone && (
                      <span className="text-xs text-red-500 font-medium">
                        {String(errors.customerPhone)}
                      </span>
                    )}
                  </div>

                  {/* SHIPPING ADDRESS TEXTAREA */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-gray-800 dark:text-gray-200">
                      Shipping address <span className="text-[#80162B]">*</span>
                    </label>
                    <textarea
                      name="shippingAddress"
                      value={values.shippingAddress}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={4}
                      className={`w-full dark:text-white bg-[#FAF8F5] dark:bg-zinc-900 border ${
                        touched.shippingAddress && errors.shippingAddress
                          ? "border-red-500"
                          : "border-gray-300 dark:border-zinc-700"
                      } p-4 text-[14px] focus:outline-none focus:border-gray-500 transition-colors resize-none`}
                      placeholder="City, Area, Street name, House No..."
                    />
                    {touched.shippingAddress && errors.shippingAddress && (
                      <span className="text-xs text-red-500 font-medium">
                        {String(errors.shippingAddress)}
                      </span>
                    )}
                  </div>

                  {/* ORDER NOTES TEXTAREA */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-gray-800 dark:text-gray-200">
                      Order notes
                    </label>
                    <textarea
                      name="orderNotes"
                      value={values.orderNotes}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={4}
                      className="w-full dark:text-white bg-[#FAF8F5] dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 p-4 text-[14px] focus:outline-none focus:border-gray-500 transition-colors resize-none"
                      placeholder="Tailoring, fabric preferences..."
                    />
                  </div>

                  {/* SUBMISSION BUTTON */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1BD741] text-white font-sans text-[15px] font-semibold tracking-wide h-13 flex items-center justify-center gap-2 rounded cursor-pointer hover:bg-[#18c33a] transition-colors select-none mt-8 shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
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
                    )}
                  </button>
                </div>

                {/* RIGHT PANEL: ORDER SUMMARY */}
                <div className="w-full lg:col-span-5 bg-white dark:bg-zinc-900 border border-gray-200/60 dark:border-zinc-800 p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
                  <div className="font-serif text-[22px] text-gray-900 dark:text-white tracking-wide mb-6">
                    Your Order
                  </div>

                  {/* ITEMS SPECIFICATIONS VIEWPORTS */}
                  <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1 mb-6">
                    {cartItems.length === 0 ? (
                      <div className="text-gray-400 font-serif text-sm">
                        No items in cart
                      </div>
                    ) : (
                      cartItems.map((item: any, idx: number) => (
                        <div
                          key={item.id || idx}
                          className="flex justify-between items-start text-[14px] text-gray-800 dark:text-gray-200 py-1"
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

                  {/* CALCULATIONS SUMMARIES ROW */}
                  <div className="space-y-4 pb-6 border-b border-gray-200 dark:border-zinc-800 pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <div className="flex justify-between items-center text-[14px]">
                      <div className="text-gray-500 dark:text-gray-400">
                        Subtotal
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        NPR {itemsSubtotal.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[14px]">
                      <div className="text-gray-500 dark:text-gray-400">
                        VAT (13%)
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        NPR {vatAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* COUPE CODE SUBMITS VIEW */}
                  <div className="py-6 border-b border-gray-200 dark:border-zinc-800">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.12em] text-gray-500 uppercase mb-3">
                      <LuTag size={12} className="rotate-90 text-gray-400" />
                      <div>Have a coupon?</div>
                    </div>

                    <div className="flex gap-2 h-10 w-full">
                      <div className="flex-1 bg-[#FAF8F5] dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 px-3 text-[12px] tracking-wider text-gray-400 uppercase flex items-center select-none">
                        ENTER CODE
                      </div>
                      <button
                        type="button"
                        className="bg-[#5C1321] text-white text-[12px] font-semibold tracking-wide px-6 h-full flex items-center justify-center cursor-pointer hover:bg-[#4a0f1a] transition-colors select-none"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* GRAND COMPOSITE ROW */}
                  <div className="py-6 flex justify-between items-baseline">
                    <div className="font-serif text-[16px] text-gray-800 dark:text-gray-200">
                      Total
                    </div>
                    <div className="font-sans font-medium text-[22px] text-[#80162B] dark:text-red-500">
                      NPR {orderTotal.toLocaleString()}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Checkout;
