import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePayMutation } from "../redux/api/orderAPI";
import { TPayment } from "../types/api-types";
import { UserReducerInitialState } from "../types/reducer-types";
import { IOrder } from "../types/types";

const Payment = () => {
  const navigate = useNavigate();

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => ({
      user: state.userReducer.user,
    })
  );

  const [pay] = usePayMutation();

  const ord = localStorage.getItem("order");

  const order: IOrder = JSON.parse(ord!);

  const handlePay = async () => {
    const dataToSend: TPayment = {
      user: user?._id || "",
      orderId: order._id,
      total: order.total,
    };
    try {
      const res = await pay(dataToSend).unwrap();
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
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="payment-container">
      {order ? (
        <div className="payment">
          <h2>Payment</h2>
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="order-summary-item">
              <span>Subtotal</span>
              <span>${order.subtotal}</span>
            </div>
            <div className="order-summary-item">
              <span>Tax</span>
              <span>${order.tax}</span>
            </div>
            <div className="order-summary-item">
              <span>Shipping Charges</span>
              <span>${order.shippingCharges}</span>
            </div>
            <div className="order-summary-item">
              <span>Discount</span>
              <span>${order.discount}</span>
            </div>
            <div className="order-summary-item total">
              <span>Total</span>
              <span>${order.total}</span>
            </div>
          </div>
          <div className="payment-options-container">
            <button className={`payment-option `} onClick={handlePay}>
              Pay Now With eSewa
            </button>
            <span>or</span>
            <button
              className={`payment-option`}
              onClick={() => {
                localStorage.removeItem("order");
                navigate("/");
              }}
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      ) : (
        <h1>No Order Found</h1>
      )}
    </div>
  );
};

export default Payment;
