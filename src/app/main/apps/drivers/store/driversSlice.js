import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDrivers = createAsyncThunk(
    'drivers-list-app/drivers/getDrivers',
    // async (routeParams, { getState }) => {
    async () => {
      // routeParams = routeParams || getState().contactsApp.contacts.routeParams;
      // const response = await axios.get('/api/vehicle-list-app/vehicles', {
      const response = await axios.get('https://cargofleet-api.fly.dev/team1/api/drivers', {
        // params: routeParams
      });
      const data = await response.data.data;
      console.log(data);
  
      // return { data, routeParams };
      return { data };
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
        const { data, routeParams } = action.payload;
        driversAdapter.setAll(state, data);
        state.routeParams = routeParams;
        // state.searchText = '';
      }
  }
});

// export const {} = driversSlice.actions;

export default driversSlice.reducer;
