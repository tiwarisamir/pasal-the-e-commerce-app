import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const addtoCartHandler = () => {};

  return (
    <div className="home">
      <section></section>

      <h1>
        Latest Products
        <Link to="/search" className="findmore">
          More
        </Link>
      </h1>
      <main>
        <ProductCard
          productId="sdfwesads"
          name="laptop"
          price={999}
          stock={444}
          handler={addtoCartHandler}
          photo="https://static-01.daraz.com.np/p/12f269cac9ccb49bc9dee129eef85f25.jpg_300x0q75.webp"
        />
      </main>
    </div>
  );
};

export default Home;
