import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useNewOrderMutation, usePayMutation } from "../redux/api/orderAPI";
import { resetCart, saveShippingInfo } from "../redux/reducer/cartReducer";
import { CartReducerInitialState } from "../types/reducer-types";
import { getUserDetail } from "../utils/features";

const Shipping = () => {
  const user = getUserDetail()!;
  const { cartItems, subtotal, tax, shippingCharges, discount, total } =
    useSelector((state: { cartReducer: CartReducerInitialState }) => ({
      ...state.cartReducer,
    }));

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [newOrder] = useNewOrderMutation();
  const [pay] = usePayMutation();

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

  const submitHandler = async () => {
    if (
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.country ||
      !shippingInfo.pinCode
    ) {
      toast.error("Please fill all data");
      return;
    }
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
      navigate("/");
      dispatch(resetCart());
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handlePay = async () => {
    if (
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.country ||
      !shippingInfo.pinCode
    ) {
      toast.error("Please fill all data");
      return;
    }
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
      const res = await pay(order).unwrap();
      toast.success(res?.message);
      if (res && res.formData) {
        var path = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        var form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", path);

        for (var key in res.formData) {
          var hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", res.formData[key]);
          form.appendChild(hiddenField);
        }

        document.body.appendChild(form);
        form.submit();
      }
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

      <form>
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

        <button type="button" onClick={handlePay}>
          Order & Pay
        </button>
        <button type="button" onClick={submitHandler}>
          Cash On Delivery
        </button>
      </form>
    </div>
  );
};

export default Shipping;
