import { Suspense, lazy } from "react";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import Payment from "./pages/Payment";

const Signup = lazy(() => import("./pages/Signup"));
const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const Cart = lazy(() => import("./pages/Cart"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Login = lazy(() => import("./pages/Login"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin Routes
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const AllCoupon = lazy(() => import("./pages/admin/apps/AllCoupon"));
// const allCoupon = lazy(() => import("./pages/admin/apps/allCoupon"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Helmet>
        <title>Premium Liquor & Spirits | Your Liquor Shop</title>
        <meta
          name="description"
          content="Discover a curated collection of premium liquor, wines, and spirits at Your Liquor Shop. Shop online for fast delivery and exceptional service."
        />
        <meta
          name="keywords"
          content="liquor, spirits, wine, beer, online liquor store, alcohol delivery, premium liquor, buy alcohol online"
        />
      </Helmet>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Logged in user routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/pay-fail" element={<Payment />} />
            <Route path="/order/:id" element={<OrderDetails />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />
            {/* Charts */}
            <Route path="/admin/chart/bar" element={<Barcharts />} />
            <Route path="/admin/chart/pie" element={<Piecharts />} />
            <Route path="/admin/chart/line" element={<Linecharts />} />
            {/* Apps */}
            <Route path="/admin/app/coupon" element={<Coupon />} />
            <Route path="/admin/app/allcoupon" element={<AllCoupon />} />

            {/* Management */}
            <Route path="/admin/product/new" element={<NewProduct />} />

            <Route path="/admin/product/:id" element={<ProductManagement />} />

            <Route
              path="/admin/transaction/:id"
              element={<TransactionManagement />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
};

export default App;
