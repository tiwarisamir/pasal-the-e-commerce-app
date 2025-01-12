import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userAPI";
import { isAdult, responseToast } from "../utils/features";

const Login = () => {
  const [date, setDate] = useState("");

  const [login] = useLoginMutation();
  const navigate = useNavigate();

  const loginHandler = async () => {
    try {
      if (date) {
        if (!isAdult(new Date(date))) {
          toast.error("Minor are Not allowed to access this site!");
        } else {
          const provider = new GoogleAuthProvider();

          const { user } = await signInWithPopup(auth, provider);

          const res = await login({
            name: user.displayName!,
            email: user.email!,
            photo: user.photoURL!,
            role: "admin",
            dob: date,
            _id: user.uid,
          });

          responseToast(res, navigate, "/");
        }
      } else {
        toast.error("Please Provide Your Age");
      }
    } catch (error) {
      toast.error("Sign In Fail");
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>

        <div>
          <label>Date of birth</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <p>Already Signed In Once </p>
          <button onClick={loginHandler}>
            <FcGoogle /> <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
