import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { openModal } from '../modal/modalSlice';
// import cartItems from '../../cartItems';

// const url = 'https://course-api.com/react-useReducer-cart-project';
const url = 'https://6819ef861ac115563507152d.mockapi.io/cartSlice/items/item';

const initialState = {
    cartItems: [],
    amount: 4,
    total: 0,
    isLoading: true,
};

export const getCartItems = createAsyncThunk(
    'cart/getCartItems',
    async (name, thunkAPI) => {
        try {
            const resp = await axios(url);
            return resp.data;
        } catch (error) {
            console.error(error);
            return thunkAPI.rejectWithValue('Something went wrong');
        }
        // return fetch(url)
        //     .then((resp) => resp.json())
        //     .catch((err) => console.log(err));
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cartItems = [];
        },
        removeItem: (state, action) => {
            const itemId = action.payload;
            state.cartItems = state.cartItems.filter(
                (item) => item.id !== itemId
            );
        },
        increase: (state, { payload }) => {
            const cartItem = state.cartItems.find(
                (item) => item.id === payload.id
            );
            cartItem.amount += 1;
        },
        decrease: (state, { payload }) => {
            const cartItem = state.cartItems.find(
                (item) => item.id === payload.id
            );
            cartItem.amount -= 1;
        },
        calculateTotals: (state) => {
            let amount = 0;
            let total = 0;
            state.cartItems.forEach((item) => {
                amount += item.amount;
                total += item.amount * item.price;
            });
            state.amount = amount;
            state.total = total;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCartItems.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(getCartItems.fulfilled, (state, action) => {
                // console.log(action);
                state.isLoading = false;
                state.cartItems = action.payload || [];
            })
            .addCase(getCartItems.rejected, (state, action) => {
                state.isLoading = false;
                console.error('Error fetching cart items:', action.payload);
            });
    },
});

// console.log(cartSlice);
export const { clearCart, removeItem, increase, decrease, calculateTotals } =
    cartSlice.actions;

export default cartSlice.reducer;
