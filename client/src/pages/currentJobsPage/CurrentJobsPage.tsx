import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { fetchOrdersByUserAsync } from "../../features/orderByContract";
import { Loader } from "../../components/loader";
import { format } from "date-fns";

import "../ordersPage/OrdersPage.scss";
import { Link } from "react-router-dom";

export const CurrentJobsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const isSeller = localStorage.getItem("isSeller");
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return 0;
  }

  let isSellerBool = false;

  if (isSeller !== null) {
    isSellerBool = isSeller === "true";
  }

  const { loading, ordersByUser } = useAppSelector(
    (state: RootState) => state.orderByContract
  );

  useEffect(() => {
    dispatch(fetchOrdersByUserAsync());
  }, [dispatch]);

  return (
    <section className="orders">
      <div className="orders__container">
        <div className="orders__top">
          <h2 className="orders__title">Jobs</h2>
        </div>

        <div className="orders__body">
          {loading ? (
            <Loader />
          ) : ordersByUser && ordersByUser.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>{isSellerBool ? "Freelancer" : "Seller"}</th>
                  <th>Step</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Deadline</th>
                </tr>
              </thead>
              <tbody>
                {ordersByUser.map((order) => {
                  return (
                    <tr key={order._id}>
                      <td>
                        <Link to={`/jobs/${order.jobId._id}`}>
                          {order.jobId?.title}
                        </Link>
                      </td>
                      <td>
                        {isSellerBool
                          ? order.freelancerId.username
                          : order.employerId.username}
                      </td>
                      <td>{order.jobId?.step}</td>
                      <td>{order.jobId?.status}</td>
                      <td>{order.totalAmount}</td>
                      <td>
                        {order.jobId?.deadline &&
                          format(new Date(order.jobId.deadline), "dd.MM.yyyy")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="no-orders">No orders found</p>
          )}
        </div>
      </div>
    </section>
  );
};
