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
  const [product, setProduct] = useState<Product | null>(null);
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
  return (
    <>
      <main className="bg-[#faf5ec] min-h-screen pb-16">
        <UserNavbar />

        <div className="  flex justify-center">
            
          <div className="w-[80vw] ">
           {/* breadcrum */}
            <div className="mt-10">
              <div className="text-sm text-gray-500 flex gap-2">
               
                <Link to="/shop" className="hover:text-black">
                  Shop
                </Link>
                <span>/</span>
                <span className="text-black">{product.name}</span>
              </div>
            </div>
            
            {/* products details */}
            <div>
                <div>
                    
                </div>
                <div></div>
            </div>
          </div>
          
        </div>
      </main>
    </>
  );
};

export default ProductDetails;
