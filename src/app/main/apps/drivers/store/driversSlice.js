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
    driversDialog: {
      type: 'new',
      props: {
        open: false
      },
      data: null
    }
  }),
  reducers: {
    openNewDriversDialog: (state, action) => {
      state.driversDialog = {
        type: "new",
        props: {
          open: true
        },
        data: null
      }
    },
    closeNewDriversDialog: (state, action) => {
      state.driversDialog = {
        type: "new",
        props: {
          open: false
        },
        data: null
      }
    },
    openEditDriversDialog: (state, action) => {
      state.driversDialog = {
        type: "edit",
        props: {
          open: true
        },
        data: action.payload
      }
    },
    closeEditDriversDialog: (state, action) => {
      state.driversDialog = {
        type: "edit",
        props: {
          open: false
        },
        data: null
      }
    }
  },
  extraReducers: {
    [getDrivers.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      driversAdapter.setAll(state, data);
      state.routeParams = routeParams;
    }
  }
});

export const {
  openEditDriversDialog,
  closeEditDriversDialog,
  openNewDriversDialog,
  closeNewDriversDialog
} = driversSlice.actions;

export default driversSlice.reducer;
