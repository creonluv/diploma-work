import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "../success/Success.scss";
import { useAppDispatch } from "../../app/hooks";
import { updateJobStepAsync } from "../../features/job";

export const SuccessContactPage: React.FC = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const queryParams = new URLSearchParams(location.search);

  const contractId = queryParams.get("contractId");
  const jobId = queryParams.get("jobId") as string;

  const params = new URLSearchParams(search);
  const payment_intent = params.get("payment_intent");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const makeRequest = async () => {
      try {
        if (!payment_intent) return;

        await dispatch(updateJobStepAsync({ id: jobId, step: 4 })).unwrap();

        timeoutId = setTimeout(() => {
          navigate(`/contracts/${contractId}/work`);
        }, 2000);
      } catch (err) {
        console.log(err);
      }
    };

    makeRequest();

    return () => clearTimeout(timeoutId);
  }, [payment_intent]);

  return (
    <div className="success">
      <div className="success__container">
        <div className="success__body">
          <div className="success__top">
            <h2 className="success__title">Success!</h2>

            <p>
              Payment successful. You are being redirected to the orders page.
              Please do not close the page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
