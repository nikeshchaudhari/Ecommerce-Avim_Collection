import axios from "axios";
import { useEffect, useState } from "react";
import { Riple } from "react-loading-indicators";
import { Link, useParams } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";

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
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get("http://localhost:3000/product/all-products");

      const found = res.data.products.find((p: any) => p.id == id);

      setProduct(found);
      console.log(found);
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

  return (
    <>
      <main className="bg-[#faf5ec] dark:bg-black min-h-screen pb-16">
        <UserNavbar />

        <div className="  flex justify-center">
          <div className="w-[80vw] ">
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
            <div className="flex gap-10">
              <div className="">
                <div className="mt-5 flex md:block  justify-center ">
                  <img
                    src={
                      photos[selectPhoto]?.url ||
                      "https://st4.depositphotos.com/14953852/22772/v/450/depositphotos_227725120-stock-illustration-image-available-icon-flat-vector.jpg"
                    }
                    className="w-50 h-75 md:w-125 md:h-150 rounded-lg"
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
                <h1 className="text-5xl font-cormorant mt-5">{product.name}</h1>
                <div className="flex gap-3">
                  <h1 className="text-4xl font-inter mt-5 text-red-700 font-bold">
                    $
                    {Number(product.price).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h1>
                  <h1 className="text-2xl font-cormorant mt-8 text-gray-500  line-through">
                    $
                    {Number(product.compare_price).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h1>
                </div>
                <p className="mt-5 font-inter text-gray-600">
                  {product.description}
                </p>
                <div className="mt-5">
                  <h2 className="uppercase font-inter">Size</h2>
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
