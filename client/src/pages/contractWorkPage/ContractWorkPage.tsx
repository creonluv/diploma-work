import { useEffect, useState } from "react";
import { RootState } from "../../app/store";
import { createConversation, getMessages } from "../../api/messages";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getContractAsync } from "../../features/contract";
import { Chat } from "../../components/chat/Chat";
import { Conversation } from "../../types/Messages";

import "./ContractWorkPage.scss";
import {
  confirmOrCancelPaymentAsync,
  fetchOrdersByContractAsync,
} from "../../features/orderByContract";
import { OrderAction } from "../../types/OrderByContract";
import { updateJobStepAsync } from "../../features/job";
import { Loader } from "../../components/loader";

export const ContractWorkPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<Conversation[] | undefined>();

  const { contractId } = useParams();
  const { contract } = useAppSelector((state: RootState) => state.contract);
  const { orders } = useAppSelector(
    (state: RootState) => state.orderByContract
  );

  const userId = localStorage.getItem("userId");
  const isSeller = localStorage.getItem("isSeller");

  if (!contractId) {
    return <p>Contract not found</p>;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(getContractAsync(contractId)).unwrap();

        if (result.contract && userId) {
          const to =
            result.contract.freelancerId._id === userId
              ? result.contract.employerId._id
              : result.contract.freelancerId._id;

          await createConversation({ to });
        }
      } catch (error) {
        console.log("Error fetching contract or creating conversation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contractId, userId]);

  useEffect(() => {
    if (!contract) {
      return;
    }

    const chatManagement = async () => {
      try {
        const conversations = await getMessages();
        setMessages(conversations);

        const chatId = idOfChat(
          contract.contract.freelancerId._id,
          contract.contract.employerId._id
        );

        if (!chatId) {
          const to =
            contract.contract.freelancerId._id === userId
              ? contract.contract.employerId._id
              : contract.contract.freelancerId._id;

          await createConversation({
            to,
          });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    chatManagement();
  }, [contract]);

  useEffect(() => {
    dispatch(fetchOrdersByContractAsync(contractId));
  }, []);

  const idOfChat = (
    userId1: string | undefined,
    userId2: string | undefined
  ): string | null => {
    if (!messages) {
      return null;
    }

    const res = messages.find(
      (message) =>
        (message.sellerId?._id === userId1 &&
          message.buyerId?._id === userId2) ||
        (message.sellerId?._id === userId2 && message.buyerId?._id === userId1)
    );

    return res ? res._id : null;
  };

  const chatId = idOfChat(
    contract?.contract.freelancerId._id,
    contract?.contract.employerId._id
  );

  const confirmPayment = () => {
    if (!orders || orders.length === 0) {
      return;
    }

    if (!contract?.contract.jobId) {
      console.error("jobId._id is undefined");
      return;
    }

    const data: OrderAction = {
      orderId: orders[0]._id,
      action: "confirm",
    };

    dispatch(confirmOrCancelPaymentAsync(data));
    dispatch(updateJobStepAsync({ id: contract?.contract.jobId._id, step: 5 }));

    navigate(`/contracts/${contractId}/reviews`);
  };

  if (loading) {
    return <Loader />;
  }

  console.log(isSeller);

  return (
    <section className="contractWorkPage">
      <div className="contractWorkPage__body">
        <div className="contractWorkPage__chat">
          <Chat chatId={chatId} />
        </div>

        <div className="contractWorkPage__information">
          <div className="contractWorkPage__background">
            <h4 className="text-bold">Contract details</h4>

            <div className="contractDetailsPage__group">
              <label htmlFor="jobDescription">
                <strong>Total</strong>
              </label>
              <input
                type="text"
                id="jobDescription"
                className="form__input input"
                name="jobDescription"
                value={`$${contract?.contract.totalAmount}`}
                readOnly
              />
            </div>

            <div className="contractDetailsPage__group">
              <label htmlFor="jobDescription">
                <strong>Deadline</strong>
              </label>
              <input
                type="text"
                id="jobDescription"
                className="form__input input"
                name="jobDescription"
                value={`${
                  contract?.contract.agreedDeadline
                    ? new Date(
                        contract.contract.agreedDeadline
                      ).toLocaleDateString()
                    : "N/A"
                }`}
                readOnly
              />
            </div>

            <div className="contractDetailsPage__group">
              <label htmlFor="jobDescription">
                <strong>Status</strong>
              </label>
              <input
                type="text"
                id="jobDescription"
                className="form__input input"
                name="jobDescription"
                value={`${contract?.contract.status}`}
                readOnly
              />
            </div>
          </div>

          {isSeller === "true" ? (
            <div className="contractWorkPage__background">
              <h4 className="text-bold">Confirm payment</h4>
              <button
                className="button button_lg button_default button_full-size"
                onClick={confirmPayment}
                type="submit"
              >
                <span>Confirm</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
