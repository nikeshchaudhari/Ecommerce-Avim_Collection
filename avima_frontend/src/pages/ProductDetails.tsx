import axios from "axios";
import { useEffect, useState } from "react";
import { Riple } from "react-loading-indicators";
import { Link, useParams } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import { MdAdd } from "react-icons/md";
import { RiSubtractFill } from "react-icons/ri";
import { BiMinus, BiPlus } from "react-icons/bi";
import { LuShoppingBag } from "react-icons/lu";
import { FaHeart } from "react-icons/fa";
import { IoIosHeartEmpty } from "react-icons/io";

interface Product {
  name: string;
  id: number;
  title: string;
  category: string;
  photos: string;
  price: number;
}
const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [selectPhoto, setSelectPhoto] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get("http://localhost:3000/product/all-products");

      const found = res.data.products.find((p: any) => p.id == id);

      setProduct(found);
      // console.log(found);
    };

    fetchProduct();
  }, [id]);
  if (!product) {
    return (
      <div className="flex justify-center h-screen items-center">
        <Riple color="#32cd32" size="medium" text="" textColor="" />
      </div>
    );
  }
  const photos = JSON.parse(product?.photos || "[]");

  const size = product.sizes.replace(/"/g, "").split(",");
  const color = product.colors.replace(/"/g, "").split(",");
  // console.log(typeof color);

  const handleCart = () => {
    const cartItems = {
      id: product.id,
      name: product.name,
      price: product.price,
      photo: photos[0]?.url,
      size: selectedSize,
      color: selectedColor,
      quantity,
    };
  };

  return (
    <>
      <main className="bg-[#faf5ec] dark:bg-black min-h-screen pb-16">
        <UserNavbar />

        <div className="  flex justify-center">
          <div className="px-5 w-full md:w-[80vw] xxl:w-full ">
            {/* breadcrum */}
            <div className="mt-10">
              <div className="text-sm text-gray-500 flex gap-2">
                <Link
                  to="/shop"
                  className="dark:text-white text-black hover:text-gray-600"
                >
                  Shop
                </Link>
                <span>/</span>
                <span className="text-black dark:text-white">
                  {product.name}
                </span>
              </div>
            </div>

            {/* products details */}
            <div className="md:flex gap-10">
              <div className="">
                <div className="mt-5 flex md:block  justify-center ">
                  <img
                    src={
                      photos[selectPhoto]?.url ||
                      "https://st4.depositphotos.com/14953852/22772/v/450/depositphotos_227725120-stock-illustration-image-available-icon-flat-vector.jpg"
                    }
                    className="w-50 h-75 md:w-[80vw] md:h-[90vh]  rounded-lg"
                  />
                </div>
                <div className="flex gap-5 mt-5">
                  <div className="flex gap-3 mt-4">
                    {photos.map((photo: any, index: number) => (
                      <img
                        key={index}
                        src={photo.url}
                        onClick={() => setSelectPhoto(index)}
                        className={`w-20 h-20 object-cover rounded-md cursor-pointer border ${
                          selectPhoto === index
                            ? "border-red-900 border-2"
                            : "border-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="uppercase text-[#f7b828] font-inter ">
                  {" "}
                  {product.category}
                </h2>
                <h1 className="text-[20px] md:text-5xl font-cormorant md:mt-5">
                  {product.name}
                </h1>
                <div className="flex gap-3">
                  {/* PRICE  SHOW */}
                  <h1 className="text-[25px] md:text-4xl font-inter mt-3 md:mt-5 text-red-700 font-bold">
                    $
                    {Number(product.price).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h1>

                  {product.compare_price != null && (
                    <h1 className="text-2xl font-cormorant mt-8 text-gray-500 line-through">
                      $
                      {Number(product.compare_price).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </h1>
                  )}
                </div>
                <p className="mt-5 font-inter text-gray-600">
                  {product.description}
                </p>
                <div className="mt-5">
                  <h2 className="uppercase font-inter">Size</h2>
                  <div className="flex gap-3 mt-3">
                    {size.map((size: string, index: number) => (
                      <div
                        key={index}
                        onClick={() => setSelectedSize(size)}
                        className={`border border-gray-500/20 px-4 py-2  cursor-pointer transition ${
                          selectedSize === size
                            ? "bg-red-800  text-white"
                            : "hover:border-gray-600 "
                        }`}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>
                <h2 className="uppercase mt-5 font-inter">Colour</h2>
                <div className="flex gap-3 mt-3">
                  {color.map((color: any, index: any) => (
                    <div
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`border border-gray-500/20 px-4 py-1 rounded-full cursor-pointer transition ${
                        selectedColor === color
                          ? "border-red-800  text-red-800"
                          : "hover:border-gray-600 "
                      }`}
                    >
                      {color}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 font-sans select-none mt-5">
                  <div className="flex items-center justify-between border border-gray-300 bg-white/40 h-11 w-36 px-4">
                    <div className="text-gray-600 hover:text-black font-light text-xl transition-colors cursor-pointer pb-0.5">
                      <BiMinus />
                    </div>

                    <div className="text-gray-900 font-normal text-base">{quantity}</div>

                    <div className="text-gray-600 hover:text-black font-light text-lg transition-colors cursor-pointer">
                      <BiPlus />
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 font-normal tracking-wide">
                    {product.stock} in stock
                  </div>
                </div>
                <div className="w-full max-w-xl font-sans select-none flex flex-col items-center gap-4 mt-5">
                  {/* Top Button Row Container */}
                  <div className="w-full flex justify-center gap-3 ">
                    <div className="w-[50vw] bg-[#F5B333] hover:bg-[#E2A222] text-[#4A0E17] text-sm font-semibold tracking-wide h-12 flex items-center justify-center gap-2 rounded-xs cursor-pointer transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.06)] active:scale-[0.99]">
                      <LuShoppingBag size={20} className="stroke-[2.5]" />
                      <div className="md:text-[20px]">Add to Cart</div>
                    </div>

                    {/* Wishlisted Button (Pure Div) */}
                    <div className="w-50 bg-[#FAF6F0] border border-gray-200/80 text-[#1C1C1C] text-sm font-normal tracking-wide h-12 flex items-center justify-center gap-2 rounded-xs cursor-pointer hover:border-gray-300 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.02)] active:scale-[0.99]  py-2 px-4">
                      <IoIosHeartEmpty size={20} />
                      <div className="md:text-[20px]">Wishlisted</div>
                    </div>
                  </div>

                  {/* View Cart Text Link (Pure Div) */}
                  <div className="text-[10px] text-[#4A0E17] hover:text-black tracking-[0.2em] font-bold uppercase transition-colors cursor-pointer mt-1 flex items-center gap-1">
                    <div>View Cart</div>
                    <div className="text-xs font-light translate-y-[-0.5px]">
                      →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductDetails;
