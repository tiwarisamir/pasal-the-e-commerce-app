import { FaPlus } from "react-icons/fa";
import { SERVER } from "../redux/store";

type ProductProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: () => void;
};

const server = "dsafd";

const ProductCard = ({
  productId,
  photo,
  name,
  price,
  stock,
  handler,
}: ProductProps) => {
  return (
    <div className="productcard">
      <img src={`${SERVER}/${photo}`} alt={name} />
      <p>{name}</p>
      <span>रु {price}</span>
      <div>
        <button onClick={() => handler()}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
