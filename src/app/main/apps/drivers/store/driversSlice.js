import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDrivers = createAsyncThunk(
  'driversApp/drivers/getDrivers',
  async (routeParams, { getState }) => {
    routeParams = routeParams || getState().contactsApp.contacts.routeParams;
    const response = await axios.get('https://cargofleet-api.fly.dev/team1/api/drivers');
    const data = await response.data;
    console.log({ data, routeParams })
    return { data, routeParams };
  }
  );
  

const driversAdapter = createEntityAdapter({});

export const { selectAll: selectDrivers, selectById: selectDriversById } = driversAdapter.getSelectors(
  state => state.driversApp.drivers
);

const driversSlice = createSlice({
  name: 'driversApp/drivers',
  initialState: driversAdapter.getInitialState({
    routeParams: {},
  }),
  reducers: {},
  extraReducers: {
    [getDrivers.fulfilled]: (state, action) => {
      const { data } = action.payload;
      driversAdapter.setAll(state, data);
      // state.searchText = '';
    }
  }
});

// export const {} = driversSlice.actions;

export default driversSlice.reducer;
