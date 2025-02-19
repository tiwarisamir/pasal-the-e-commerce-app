import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { resetCart, saveShippingInfo } from "../redux/reducer/cartReducer";
import {
  CartReducerInitialState,
  UserReducerInitialState,
} from "../types/reducer-types";

const Shipping = () => {
  const { cartItems, subtotal, tax, shippingCharges, discount, total, user } =
    useSelector(
      (state: {
        cartReducer: CartReducerInitialState;
        userReducer: UserReducerInitialState;
      }) => ({
        ...state.cartReducer,
        user: state.userReducer.user,
      })
    );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [newOrder] = useNewOrderMutation();

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(saveShippingInfo(shippingInfo));

    const order = {
      orderItems: cartItems,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
      shippingInfo,
      user: user?._id!,
    };

    try {
      const res = await newOrder(order).unwrap();
      toast.success(res?.message);
      localStorage.setItem("order", JSON.stringify(res?.order));
      navigate("/pay");
      dispatch(resetCart());
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (cartItems.length <= 0) return navigate("/");
  }, [cartItems, navigate]);

  return (
    <div className="shipping">
      <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>

      <form onSubmit={submitHandler}>
        <h1>Shipping Address</h1>

        <input
          required
          type="text"
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
        />

        <input
          required
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
        />

        <input
          required
          type="text"
          placeholder="State"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
        />
        <select
          name="country"
          required
          value={shippingInfo.country}
          onChange={changeHandler}
        >
          <option value="">Choose Country</option>
          <option value="nepal">Nepal</option>
          <option value="india">India</option>
          <option value="china">China</option>
          <option value="bhutan">Bhutan</option>
        </select>

        <input
          required
          type="number"
          placeholder="Pin Code"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        />

        <button type="submit">Order</button>
      </form>
    </div>
  );
};

export default Shipping;
