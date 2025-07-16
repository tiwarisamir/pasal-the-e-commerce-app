import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../redux/api/userAPI";
import {
  getUserDetail,
  responseToast,
  setAccessToken,
  setUserDetails,
} from "../utils/features";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [image, setImage] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const user = getUserDetail();
  const [register] = useRegisterMutation();

  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current!;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        setImage(blob);
        setPreviewUrl(URL.createObjectURL(blob));
        stopCamera();
      }
    });
  };

  const retakeImage = () => {
    setImage(null);
    setPreviewUrl(null);
    startCamera();
  };

  const submitHandler = async () => {
    try {
      if (!image) return toast.error("Please capture an image");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("photo", image);
      const res = await register(formData);
      if (res?.data?.success) {
        const { token, user } = res?.data?.data!;
        setAccessToken(token);
        setUserDetails(user);
        responseToast(res, navigate, "/");
        toast.success(res?.data?.message || "Account registered successfully!");
      } else {
        toast.error(res?.data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const validateStep1 = (data: typeof form) => {
    const { name, email, password, confirmPassword } = data;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);
  return (
    <div className="signup">
      <main>
        <h1 className="heading">Signup</h1>

        {step === 1 ? (
          <>
            <div className="row">
              <div>
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Jhon"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                placeholder="*********"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="*********"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
            </div>
            <button
              className="next-btn"
              onClick={() => {
                if (validateStep1(form)) setStep(2);
              }}
            >
              Next
            </button>
            <p className="login-link">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </>
        ) : (
          <>
            {!image ? (
              <>
                <video autoPlay ref={videoRef}></video>
                <div className="actions">
                  <button onClick={startCamera}>Start Camera</button>
                  <button onClick={captureImage}>Capture</button>
                </div>
              </>
            ) : (
              <>
                <img src={previewUrl!} alt="Captured" className="preview" />
                <div className="actions">
                  <button onClick={retakeImage}>Retake</button>
                  <button onClick={submitHandler}>Submit</button>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Signup;
