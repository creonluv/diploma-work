import { useEffect, useState } from "react";
import { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { getContractAsync, signContractAsync } from "../../features/contract";

import "./ContractDetailsPage.scss";
import { User } from "../../types/User";
import { getUser } from "../../api/user";
import { updateJobStepAsync } from "../../features/job";

export const ContractDetailsPage: React.FC = () => {
  const [user, setUser] = useState<User | undefined>();

  const { contract, signedContract } = useAppSelector(
    (state: RootState) => state.contract
  );

  const { contractId } = useParams();
  const navigate = useNavigate();

  const storedUserId = localStorage.getItem("userId");

  if (!contractId) {
    return <p>Contract not found</p>;
  }

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getContractAsync(contractId));
  }, [signedContract]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser(storedUserId);

        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const signContractEffect = async () => {
      if (contract?.contract.status === "signed") {
        try {
          await dispatch(
            updateJobStepAsync({ id: contract.contract.jobId._id, step: 3 })
          );
          navigate(`/contracts/${contractId}/payments`);
        } catch (error) {
          console.error("Error updating job step:", error);
        }
      }
    };

    signContractEffect();
  }, [contract, contractId, dispatch, navigate]);

  const signContract = async () => {
    try {
      const contractText = JSON.stringify(contract);

      const data = {
        contractText,
        role: user?.isSeller ? "employer" : "freelancer",
        userId: storedUserId,
      };

      await dispatch(signContractAsync({ data, contractId }));

      // await dispatch(getContractAsync(contractId));

      // if (!contract?.contract.jobId) {
      //   console.error("jobId._id is undefined");
      //   return;
      // }

      // console.log(contract.contract.status);

      // if (contract.contract.status === "signed") {
      //   await dispatch(
      //     updateJobStepAsync({ id: contract?.contract.jobId._id, step: 3 })
      //   );

      //   navigate(`/contracts/${contractId}/payments`);
      // }
    } catch (error) {
      console.error("Error signing contract:", error);
    }
  };

  return (
    <section className="contractDetailsPage">
      <div className="contractDetailsPage__body">
        <div className="contractDetailsPage__first">
          <div className="contractDetailsPage__background">
            <h4 className="text-bold">Contract title</h4>

            <div className="contractDetailsPage__form">
              <div className="contractDetailsPage__group">
                <label htmlFor="jobTitle">
                  <strong>Job Title</strong>
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  className="form__input input"
                  name="jobTitle"
                  value={contract?.contract.jobId.title}
                  readOnly
                />
              </div>

              <div className="contractDetailsPage__group">
                <label htmlFor="jobDescription">
                  <strong>Job Description</strong>
                </label>
                <input
                  type="text"
                  id="jobDescription"
                  className="form__input input"
                  name="jobDescription"
                  value={contract?.contract.jobId.description}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="contractDetailsPage__background">
            <h4 className="text-bold">Contract status</h4>

            <div className="contractDetailsPage__form">
              <div className="contractDetailsPage__group">
                <label htmlFor="jobTitle">
                  <strong>Employer Signature</strong>
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  className="form__input input"
                  name="jobTitle"
                  value={
                    contract?.contract.employerSignature ? "Signed" : "Unsigned"
                  }
                  readOnly
                />
              </div>

              <div className="contractDetailsPage__group">
                <label htmlFor="jobTitle">
                  <strong>Freelancer Signature</strong>
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  className="form__input input"
                  name="jobTitle"
                  value={
                    contract?.contract.freelancerSignature
                      ? "Signed"
                      : "Unsigned"
                  }
                  readOnly
                />
              </div>
            </div>

            {contract?.contract.status === "signed" ? (
              <p>✅ The contract is signed by both parties</p>
            ) : (
              <button
                onClick={signContract}
                className="button button_lg button_default button_full-size"
              >
                Sign a contract
              </button>
            )}
          </div>
        </div>

        <div className="contractDetailsPage__background contractDetailsPage__second">
          <h4 className="text-bold">Contract details</h4>

          <div className="contractDetailsPage__form">
            <div className="contractDetailsPage__groupRow">
              <div className="contractDetailsPage__group">
                <label htmlFor="jobTitle">
                  <strong>Freelancer</strong>
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  className="form__input input"
                  name="jobTitle"
                  value={contract?.contract.freelancerId.username}
                  readOnly
                />
              </div>

              <div className="contractDetailsPage__group">
                <label htmlFor="jobDescription">
                  <strong>Customer</strong>
                </label>
                <input
                  type="text"
                  id="jobDescription"
                  className="form__input input"
                  name="jobDescription"
                  value={contract?.contract.employerId.username}
                  readOnly
                />
              </div>
            </div>

            <div className="contractDetailsPage__groupRow">
              <div className="contractDetailsPage__group">
                <label htmlFor="jobTitle">
                  <strong>Freelancer e-mail</strong>
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  className="form__input input"
                  name="jobTitle"
                  value={contract?.contract.freelancerId.email}
                  readOnly
                />
              </div>

              <div className="contractDetailsPage__group">
                <label htmlFor="jobDescription">
                  <strong>Customer e-mail</strong>
                </label>
                <input
                  type="text"
                  id="jobDescription"
                  className="form__input input"
                  name="jobDescription"
                  value={contract?.contract.employerId.email}
                  readOnly
                />
              </div>
            </div>

            <div className="contractDetailsPage__groupRow">
              <div className="contractDetailsPage__group">
                <label htmlFor="jobTitle">
                  <strong>Freelancer phone</strong>
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  className="form__input input"
                  name="jobTitle"
                  value={contract?.contract.freelancerId.phone}
                  readOnly
                />
              </div>

              <div className="contractDetailsPage__group">
                <label htmlFor="jobDescription">
                  <strong>Customer phone</strong>
                </label>
                <input
                  type="text"
                  id="jobDescription"
                  className="form__input input"
                  name="jobDescription"
                  value={contract?.contract.employerId.phone}
                  readOnly
                />
              </div>
            </div>

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
          </div>
        </div>
      </div>
    </section>
  );
};
