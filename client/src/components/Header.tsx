import { useState } from "react";
import { FaSearch, FaShoppingBag, FaSignOutAlt, FaUser } from "react-icons/fa";
import { TbLogin } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { getUserDetail } from "../utils/features";
import { useLogoutMutation } from "../redux/api/userAPI";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [logout, { isLoading }] = useLogoutMutation();

  const navigate = useNavigate();

  const user = getUserDetail();
  const logoutHandler = async () => {
    try {
      await logout().unwrap();
      Cookies.remove("access-token");
      Cookies.remove("User");
      navigate("/");
      toast.success("Sign Out Successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Sign Out Fail");
    }
  };

  return (
    <nav className="header">
      <Link to={"/"} onClick={() => setIsOpen(false)}>
        HOME
      </Link>
      <Link to={"/search"} onClick={() => setIsOpen(false)}>
        <FaSearch />
      </Link>
      <Link to={"/cart"} onClick={() => setIsOpen(false)}>
        <FaShoppingBag />
      </Link>

      {user ? (
        <>
          <button onClick={() => setIsOpen((prev) => !prev)}>
            <FaUser />
          </button>

          <dialog open={isOpen}>
            <div>
              {user.role === "admin" && (
                <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>
                  Admin
                </Link>
              )}
              <Link to="/orders" onClick={() => setIsOpen(false)}>
                Orders
              </Link>
              <button disabled={isLoading} onClick={logoutHandler}>
                <FaSignOutAlt />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link to={"/login"}>
          <TbLogin />
        </Link>
      )}
    </nav>
  );
};

export default Header;
