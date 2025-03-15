import {
  ContractInput,
  ContractResponse,
  ContractsResponse,
  SignContractInput,
  SignedContract,
} from "../types/Contact";
import { client } from "../utils/fetchClient";

export const createContract = (
  data: ContractInput
): Promise<ContractResponse> => {
  return client.post(`/contract/create`, data);
};

export const signContract = (
  data: SignContractInput,
  contractId: string
): Promise<SignedContract> => {
  return client.post(`/contract/sign/${contractId}`, data);
};

export const getContracts = (): Promise<ContractsResponse> => {
  return client.get(`/contract/contracts`);
};

export const getContract = (id: string): Promise<ContractResponse> => {
  return client.get(`/contract/contracts/${id}`);
};
