import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import { Skeleton } from "../../../components/Loader";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import TableHOC from "../../../components/admin/TableHOC";
import {
  useAllCouponQuery,
  useDeleteCouponMutation,
} from "../../../redux/api/couponAPI";
import { CustomError } from "../../../types/api-types";
import { getUserDetail, responseToast } from "../../../utils/features";

interface DataType {
  code: string;
  amount: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Code",
    accessor: "code",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },

  {
    Header: "Action",
    accessor: "action",
  },
];

const AllCoupon = () => {
  const user = getUserDetail()!;

  const { isLoading, isError, error, data } = useAllCouponQuery(user?._id!);

  const [deleteCoupon] = useDeleteCouponMutation();

  const [rows, setRows] = useState<DataType[]>([]);

  const deleteHandler = async (couponId: string) => {
    const res = await deleteCoupon({ couponId, adminUserId: user?._id! });
    responseToast(res, null, "");
  };

  if (isError) toast.error((error as CustomError).data.message);

  useEffect(() => {
    if (data)
      setRows(
        data.coupon.map((i) => ({
          code: i.code,
          amount: i.amount,
          action: (
            <button onClick={() => deleteHandler(i._id)}>
              <FaTrash />
            </button>
          ),
        }))
      );
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "All Coupons",
    rows.length > 6
  )();
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={15} /> : Table}</main>
    </div>
  );
};

export default AllCoupon;
