import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import { Skeleton } from "../../components/Loader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllOrderQuery } from "../../redux/api/orderAPI";
import { CustomError } from "../../types/api-types";
import { getUserDetail } from "../../utils/features";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Name",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Transaction = () => {
  const user = getUserDetail()!;

  const { isLoading, data, isError, error } = useAllOrderQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data)
      setRows(
        data.orders?.map((i) => ({
          user: i?.user?.name || "N/A",
          amount: i?.total,
          discount: i?.discount,
          quantity: i?.orderItems?.length,
          status: (
            <span
              className={
                i?.status === "Processing"
                  ? "red"
                  : i?.status === "Shipped"
                  ? "green"
                  : "purple"
              }
            >
              {i?.status}
            </span>
          ),
          action: <Link to={`/admin/transaction/${i?._id}`}>Manage</Link>,
        }))
      );
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={15} /> : Table}</main>
    </div>
  );
};

export default Transaction;
