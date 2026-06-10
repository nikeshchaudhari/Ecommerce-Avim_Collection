import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();

  console.log(id);

  return (
    <div>
      Product ID: {id}
    </div>
  );
};

export default ProductDetails;