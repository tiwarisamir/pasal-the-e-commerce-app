import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux/api/userAPI";
import {
  getUserDetail,
  responseToast,
  setAccessToken,
  setUserDetails,
} from "../utils/features";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const user = getUserDetail();

  const [login] = useLoginMutation();
  const navigate = useNavigate();

  const loginHandler = async () => {
    const { email, password } = form;

    if (!email || !password) return toast.error("All fields are required");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return toast.error("Invalid email format");

    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");

    const res = await login(form);
    if ("data" in res) {
      const { token, user } = res?.data?.data!;
      setAccessToken(token);
      setUserDetails(user);
    }
    responseToast(res, navigate, "/");
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            placeholder="example@email.com"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="***********"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button onClick={loginHandler}>Login</button>

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </main>
    </div>
  );
};

export default Login;
