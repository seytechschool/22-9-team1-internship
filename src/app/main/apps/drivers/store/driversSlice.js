import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDrivers = createAsyncThunk(
  'driversApp/drivers/getDrivers',
  async () =>{
    const response = await axios.get('https://cargofleet-api.fly.dev/team1/api/drivers');
    const data = await response.data.data;
    return { data };
  }
  );
  

  const driversAdapter = createEntityAdapter({
    // selectId: (driver) => driver.id
  });

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
    }
  }
});

// export const {} = driversSlice.actions;

export default driversSlice.reducer;
