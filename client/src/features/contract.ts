import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  Contract,
  ContractInput,
  ContractResponse,
  ContractsResponse,
  SignContractInput,
  SignedContract,
} from "../types/Contact";
import {
  createContract,
  signContract,
  getContracts,
  getContract,
} from "../api/contract";

export type ContractState = {
  contracts: Contract[] | null;
  contract: ContractResponse | null;
  signedContract: SignedContract | null;
  loading: boolean;
  error: string;
};

const initialState: ContractState = {
  contracts: null,
  contract: null,
  signedContract: null,
  loading: false,
  error: "",
};

export const getContractsAsync = createAsyncThunk(
  "contract/getContractsAsync",
  async (): Promise<ContractsResponse> => {
    const response = await getContracts();
    return response;
  }
);

export const getContractAsync = createAsyncThunk(
  "contract/getContractAsync",
  async (id: string): Promise<ContractResponse> => {
    const response = await getContract(id);
    return response;
  }
);

export const createContractAsync = createAsyncThunk(
  "contract/createContractAsync",
  async (data: ContractInput) => {
    const response = await createContract(data);
    return response;
  }
);

export const signContractAsync = createAsyncThunk(
  "contract/signContractAsync",
  async ({
    data,
    contractId,
  }: {
    data: SignContractInput;
    contractId: string;
  }) => {
    const response = await signContract(data, contractId);
    return response;
  }
);

export const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getContractsAsync.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        getContractsAsync.fulfilled,
        (state, action: PayloadAction<ContractsResponse>) => {
          state.contracts = action.payload.contracts;
          state.loading = false;
        }
      )
      .addCase(getContractsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch contracts";
      })
      .addCase(getContractAsync.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        getContractAsync.fulfilled,
        (state, action: PayloadAction<ContractResponse>) => {
          state.contract = action.payload;
          state.loading = false;
        }
      )
      .addCase(getContractAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch contract";
      })
      .addCase(createContractAsync.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        createContractAsync.fulfilled,
        (state, action: PayloadAction<ContractResponse>) => {
          state.contract = action.payload;
          state.loading = false;
        }
      )
      .addCase(createContractAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create contract";
      })
      .addCase(signContractAsync.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        signContractAsync.fulfilled,
        (state, action: PayloadAction<SignedContract>) => {
          state.signedContract = action.payload;
          state.loading = false;
        }
      )
      .addCase(signContractAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to sign contract";
      });
  },
});

export const { reducer: contractReducer } = contractSlice;
