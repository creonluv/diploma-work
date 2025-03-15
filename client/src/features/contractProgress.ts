import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ContractProgressState {
  currentStep: number;
}

const initialState: ContractProgressState = {
  currentStep: Number(localStorage.getItem("currentStep")) || 1,
};

const contractProgressSlice = createSlice({
  name: "contractProgress",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
      localStorage.setItem("currentStep", action.payload.toString());
    },
  },
});

export const { setStep } = contractProgressSlice.actions;
export default contractProgressSlice.reducer;
