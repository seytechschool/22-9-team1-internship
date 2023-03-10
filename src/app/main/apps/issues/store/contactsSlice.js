import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { addNotification } from 'app/fuse-layouts/shared-components/notificationPanel/store/dataSlice';
import NotificationModel from 'app/fuse-layouts/shared-components/notificationPanel/model/NotificationModel';
import axios from 'axios';
import { getUserData } from './userSlice';

export const getVehicles = createAsyncThunk('vehicle-list-app/vehicles/getVehicles', async () => {
  const response = await axios.get('https://cargofleet-api.fly.dev/team1/api/issues?page=1&limit=100');
  const data = await response.data.data;
  return { data };
});

// -----------------------------------------Get Vehicles For Issue------------------------------------------

export const getVehiclesForIssue = createAsyncThunk('vehicle-list-app/vehicles/getVehiclesForIssue', async () => {
  const response = await axios.get('https://cargofleet-api.fly.dev/team1/api/vehicles?page=1&limit=100');
  const data = await response.data.data;
  return { data };
});
// ----------------------------------------------------------------------------------------------------------------------
export const addVehicle = createAsyncThunk('vehicle-list-app/issues/addDriver', async (contact, { dispatch, getState }) => {

  try {
    const response = await axios.post('https://cargofleet-api.fly.dev/team1/api/issues', {
      vehicle_id: contact.issue_vehicle_id,
      title: contact.title,
      priority: contact.priority,
      due_date: contact.due_date,
    });

    dispatch(
      addNotification(NotificationModel({ message: 'Issue has been added', options: { variant: 'success' } }))
    );
    dispatch(getVehicles());
    return response;
  } catch (error) {
    dispatch(
      addNotification(NotificationModel({ message: 'Issue has not been added!!!', options: { variant: 'error' } }))
    );
    return error.message;
  }
});

export const updateContact = createAsyncThunk(
  'vehicle-list-app/issues/updateIssue',
  async (driver, { dispatch }) => {
    try {
      const response = await axios.put(`https://cargofleet-api.fly.dev/team1/api/issues/${driver.id}`, {
        ...driver,
        due_date: driver.date
      });
      const data = await response.data.data;
      dispatch(
        addNotification(NotificationModel({ message: 'Issue has been updated', options: { variant: 'success' } }))
      );
      dispatch(getVehicles());
      return { data };
    } catch (error) {
      dispatch(
        addNotification(NotificationModel({ message: 'Issue has not been updated', options: { variant: 'error' } }))
      );
      return error.message;
    }
  }
);

export const removeContact = createAsyncThunk(
  'vehicle-list-app/issues/removeIssue',
  async (contactId, { dispatch }) => {
    try {
      const response = await axios.delete(`https://cargofleet-api.fly.dev/team1/api/issues/${contactId}`);
      const data = await response.data.data;
      dispatch(
        addNotification(NotificationModel({ message: 'Issue has been removed', options: { variant: 'success' } }))
      );
      dispatch(getVehicles());

      return { data };
    } catch (error) {
      dispatch(
        addNotification(NotificationModel({ message: 'Issue has not been removed', options: { variant: 'error' } }))
      );
      return error.message;
    }
  }
);

export const removeContacts = createAsyncThunk(
  'contactsApp/contacts/removeContacts',
  async (contactIds, { dispatch, getState }) => {
    await axios.post('/api/contacts-app/remove-contacts', { contactIds });

    return contactIds;
  }
);

export const assignDriver = createAsyncThunk(
  'vehicle-list-app/vehicles/assignDriver',
  async (assignId, { dispatch }) => {
    try {
      const response = await axios.post(`https://cargofleet-api.fly.dev/team1/api/vehicles/${assignId.id}/assign`, {
        driver_id: assignId.drivers
      });
      dispatch(
        addNotification(NotificationModel({ message: 'Vehicle has been assigned', options: { variant: 'success' } }))
      );
      dispatch(getVehicles());
      return response;
    } catch (error) {
      dispatch(
        addNotification(NotificationModel({ message: 'Data has not been assigned', options: { variant: 'error' } }))
      );
      return error.message;
    }
  }
);
export const unAssignDriver = createAsyncThunk(
  'vehicle-list-app/vehicles/unAssignDriver',
  async (assignId, { dispatch }) => {
    try {
      const response = await axios.post(`https://cargofleet-api.fly.dev/team1/api/vehicles/${assignId.id}/unassign`, {
        assignment_id: assignId.active_assignment.id
        // end_odometer: 200,
        // end_date: '2023-02-05',
        // start_comment: 'Finish it!'
      });
      // const data = await response.data.data;
      dispatch(
        addNotification(NotificationModel({ message: 'Vehicle has been unassigned', options: { variant: 'success' } }))
      );
      dispatch(getVehicles());
      return response;
    } catch (error) {
      dispatch(
        addNotification(NotificationModel({ message: 'Data has not been unassigned', options: { variant: 'error' } }))
      );
      return error.message;
    }
  }
);

export const getDrivers = createAsyncThunk('vehicle-list-app/vehicles/getDrivers', async () => {
  const response = await axios.get('https://cargofleet-api.fly.dev/team1/api/drivers?page=1&limit=100');
  const data = await response.data.data;
  return { data };
});


const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactsById } = contactsAdapter.getSelectors(
  state => state.contactsApp.contacts
);

const contactsSlice = createSlice({
  name: 'contactsApp/contacts',
  initialState: contactsAdapter.getInitialState({
    searchText: '',
    drivers: [],
    vehicles: [],
    routeParams: {},
    contactDialog: {
      type: 'new',
      props: {
        open: false
      },
      data: null
    }
  }),
  reducers: {
    setContactsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: event => ({ payload: event.target.value || '' })
    },
    openNewContactDialog: (state, action) => {
      state.contactDialog = {
        type: 'new',
        props: {
          open: true
        },
        data: null
      };
    },
    closeNewContactDialog: (state, action) => {
      state.contactDialog = {
        type: 'new',
        props: {
          open: false
        },
        data: null
      };
    },
    openEditContactDialog: (state, action) => {
      state.contactDialog = {
        type: 'edit',
        props: {
          open: true
        },
        data: action.payload
      };
    },
    openAssignContactDialog: (state, action) => {
      state.contactDialog = {
        type: 'assign',
        props: {
          open: true
        },
        data: action.payload
      };
    },
    openUnAssignContactDialog: (state, action) => {
      state.contactDialog = {
        type: 'unassign',
        props: {
          open: true
        },
        data: action.payload
      };
    },
    closeEditContactDialog: (state, action) => {
      state.contactDialog = {
        type: 'edit',
        props: {
          open: false
        },
        data: null
      };
    },
    openDeleteContactDialog: (state, action) => {
      state.contactDialog = {
        type: 'delete',
        props: {
          open: true
        },
        data: action.payload
      };
    },
    closeDeleteContactDialog: (state, action) => {
      state.contactDialog = {
        type: 'delete',
        props: {
          open: false
        },
        data: null
      };
    }
  },
  extraReducers: {
    [updateContact.fulfilled]: contactsAdapter.upsertOne,
    [addVehicle.fulfilled]: contactsAdapter.addOne,
    [removeContacts.fulfilled]: (state, action) => contactsAdapter.removeMany(state, action.payload),
    [removeContact.fulfilled]: (state, action) => contactsAdapter.removeOne(state, action.payload),
    [getVehicles.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      contactsAdapter.setAll(state, data);
      state.routeParams = routeParams;
      state.searchText = '';
    },
    [getVehiclesForIssue.fulfilled]: (state, action) => {
      const vehiclesForIssue = action.payload;
      state.vehicles = vehiclesForIssue.data;
    },
    [getDrivers.fulfilled]: (state, action) => {
      const drivers = action.payload;
      state.drivers = drivers.data;
    }
  }
});

export const {
  setContactsSearchText,
  openNewContactDialog,
  openDeleteContactDialog,
  closeDeleteContactDialog,
  closeNewContactDialog,
  openEditContactDialog,
  closeEditContactDialog
} = contactsSlice.actions;

export default contactsSlice.reducer;
