import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ItineraryState {
  itinerary: any | null;
}

const initialState: ItineraryState = {
  itinerary: null,
};

const itinerarySlice = createSlice({
  name: "itinerary",
  initialState,
  reducers: {
    setItinerary: (state, action: PayloadAction<any>) => {
      state.itinerary = action.payload;
    },
    clearItinerary: (state) => {
      state.itinerary = null;
    },
  },
});

export const { setItinerary, clearItinerary } = itinerarySlice.actions;
export default itinerarySlice.reducer;
