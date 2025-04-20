import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  OrderAction,
  OrderByContract,
  OrderByContractResponse,
  OrderByUser,
} from "../types/OrderByContract";
import {
  confirmOrCancelPayment,
  createOrder,
  getOrderByPaymentIntent,
  getOrdersByContract,
  getOrdersByUser,
} from "../api/orderByContact";

export type OrderState = {
  orders: OrderByContract[] | null;
  order: OrderByContract | null;
  ordersByUser: OrderByUser[] | null;
  loading: boolean;
  error: string;
};

const initialState: OrderState = {
  orders: null,
  order: null,
  ordersByUser: null,

  loading: false,
  error: "",
};

export const createOrderAsync = createAsyncThunk<
  OrderByContractResponse,
  string
>("orders/createOrder", async (contractId: string, { rejectWithValue }) => {
  try {
    const response = await createOrder(contractId);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to create order");
  }
});

export const confirmOrCancelPaymentAsync = createAsyncThunk<
  OrderByContract,
  OrderAction,
  { rejectValue: string }
>(
  "orders/confirmOrCancelPayment",
  async (data: OrderAction, { rejectWithValue }) => {
    try {
      const response = await confirmOrCancelPayment(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to process payment"
      );
    }
  }
);

export const fetchOrdersByContractAsync = createAsyncThunk<
  OrderByContract[],
  string
>("orders/fetchOrdersByContract", async (contractId: string) => {
  const data = await getOrdersByContract(contractId);

  return data;
});

export const fetchOrderByPaymentIntentAsync = createAsyncThunk<
  OrderByContract,
  string
>(
  "orders/fetchOrderByPaymentIntent",
  async (paymentIntentId: string, { rejectWithValue }) => {
    try {
      return await getOrderByPaymentIntent(paymentIntentId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Order not found");
    }
  }
);

export const fetchOrdersByUserAsync = createAsyncThunk<OrderByUser[], void>(
  "orders/fetchOrdersByUser",
  async () => {
    const data = await getOrdersByUser();
    return data;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        createOrderAsync.fulfilled,
        (state, action: PayloadAction<OrderByContractResponse>) => {
          state.order = action.payload.newOrder;
          state.loading = false;
        }
      )
      .addCase(createOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create order";
      })

      .addCase(confirmOrCancelPaymentAsync.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        confirmOrCancelPaymentAsync.fulfilled,
        (state, action: PayloadAction<OrderByContract>) => {
          state.order = action.payload;
          state.loading = false;
        }
      )
      .addCase(confirmOrCancelPaymentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Payment failed to process.";
      })

      .addCase(fetchOrdersByContractAsync.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        fetchOrdersByContractAsync.fulfilled,
        (state, action: PayloadAction<OrderByContract[]>) => {
          state.orders = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchOrdersByContractAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Unable to receive order";
      })

      .addCase(fetchOrderByPaymentIntentAsync.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        fetchOrderByPaymentIntentAsync.fulfilled,
        (state, action: PayloadAction<OrderByContract>) => {
          state.order = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchOrderByPaymentIntentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch order";
      })

      .addCase(fetchOrdersByUserAsync.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        fetchOrdersByUserAsync.fulfilled,
        (state, action: PayloadAction<OrderByUser[]>) => {
          state.ordersByUser = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchOrdersByUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Unable to receive order";
      });
  },
});

export const { reducer: ordersReducer } = ordersSlice;
