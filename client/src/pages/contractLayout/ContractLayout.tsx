import { Outlet, useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import ProgressBar from "../../components/progressBar/ProgressBar";
import ProgressBarMini from "../../components/progressBar/ProgressBarMini";
import { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import "./ContractLayout.scss";
import { useEffect } from "react";
import { getContractAsync } from "../../features/contract";
import { fetchJobAsync } from "../../features/job";

const ContractLayout = () => {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ maxWidth: 1024 });

  const { contractId, jobId } = useParams();

  const { contract } = useAppSelector((state: RootState) => state.contract);
  const { job } = useAppSelector((state: RootState) => state.jobs);

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobAsync(jobId));
    }
    if (contractId) {
      dispatch(getContractAsync(contractId));
    }
  }, [jobId, contractId, dispatch]);

  if (!jobId && !contractId) {
    return <p>Job or contract not found</p>;
  }

  const contractJob = contract?.contract?.jobId;

  return (
    <div className="contractLayout">
      <div className="contractLayout__container">
        <div className="contractLayout__background contractLayout__top">
          <div className="contractLayout__background--top">
            <h3 className="contractLayout__title">
              {contractJob?.title || job?.title || "Untitled"}
            </h3>
            <p className="contractLayout__price text-price">
              {contractJob?.budget || job?.budget || "Not specified"} USD
            </p>
          </div>

          {contractJob ? (
            !isMobile ? (
              <ProgressBar step={contractJob.step ?? 0} />
            ) : (
              <ProgressBarMini step={contractJob.step ?? 0} />
            )
          ) : job ? (
            !isMobile ? (
              <ProgressBar step={job.step ?? 0} />
            ) : (
              <ProgressBarMini step={job.step ?? 0} />
            )
          ) : null}
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default ContractLayout;
