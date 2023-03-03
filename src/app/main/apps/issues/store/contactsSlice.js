import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { addNotification } from 'app/fuse-layouts/shared-components/notificationPanel/store/dataSlice';
import NotificationModel from 'app/fuse-layouts/shared-components/notificationPanel/model/NotificationModel';
import axios from 'axios';
import { getUserData } from './userSlice';

export const getVehicles = createAsyncThunk('vehicle-list-app/vehicles/getVehicles', async () => {
  const response = await axios.get('https://cargofleet-api.fly.dev/team1/api/issues?page=1&limit=100');
  const data = await response.data.data;
  console.log('data issues', data)
  return { data };
});

export const addVehicle = createAsyncThunk('vehicle-list-app/issues/addDriver', async (contact, { dispatch }) => {
  // console.log('contact in adding driver', contact)
  // console.log('contact in issue adding', contact)
  try {
    const response = await axios.post('https://cargofleet-api.fly.dev/team1/api/issues', {
      vehicle_id: contact.vehicle_id,
      title: contact.title,
      priority: contact.priority,
      due_date: contact.due_date
    });

    dispatch(
      addNotification(NotificationModel({ message: 'Driver has been added', options: { variant: 'success' } }))
    );
    dispatch(getVehicles());
    return response;
  } catch (error) {
    dispatch(
      addNotification(NotificationModel({ message: 'Data has not been added!!!', options: { variant: 'error' } }))
    );
    return error.message;
  }
});

export const updateContact = createAsyncThunk(
  'vehicle-list-app/issues/updateDriver',
  async (driver, { dispatch }) => {
    try {
      // console.log('vehicle id', driver)
      const response = await axios.put(`https://cargofleet-api.fly.dev/team1/api/issues/${driver.id}`, driver);
      const data = await response.data.data;
      dispatch(
        addNotification(NotificationModel({ message: 'Driver has been updated', options: { variant: 'success' } }))
      );
      dispatch(getVehicles());
      return { data };
    } catch (error) {
      dispatch(
        addNotification(NotificationModel({ message: 'Data has not been updated', options: { variant: 'error' } }))
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
        addNotification(NotificationModel({ message: 'Driver has been removed', options: { variant: 'success' } }))
      );
      dispatch(getVehicles());

      return { data };
    } catch (error) {
      dispatch(
        addNotification(NotificationModel({ message: 'Driver has not been removed', options: { variant: 'error' } }))
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

// export const toggleStarredContact = createAsyncThunk(
//   'contactsApp/contacts/toggleStarredContact',
//   async (contactId, { dispatch, getState }) => {
//     const response = await axios.post('/api/contacts-app/toggle-starred-contact', { contactId });
//     const data = await response.data;

//     dispatch(getUserData());

//     dispatch(getVehicles());

//     return data;
//   }
// );

// export const toggleStarredContacts = createAsyncThunk(
//   'contactsApp/contacts/toggleStarredContacts',
//   async (contactIds, { dispatch, getState }) => {
//     const response = await axios.post('/api/contacts-app/toggle-starred-contacts', { contactIds });
//     const data = await response.data;

//     dispatch(getUserData());

//     dispatch(getVehicles());

//     return data;
//   }
// );

// export const setContactsStarred = createAsyncThunk(
//   'contactsApp/contacts/setContactsStarred',
//   async (contactIds, { dispatch, getState }) => {
//     const response = await axios.post('/api/contacts-app/set-contacts-starred', { contactIds });
//     const data = await response.data;

//     dispatch(getUserData());

//     dispatch(getVehicles());

//     return data;
//   }
// );

// export const setContactsUnstarred = createAsyncThunk(
//   'contactsApp/contacts/setContactsUnstarred',
//   async (contactIds, { dispatch, getState }) => {
//     const response = await axios.post('/api/contacts-app/set-contacts-unstarred', { contactIds });
//     const data = await response.data;

//     dispatch(getUserData());

//     dispatch(getVehicles());

//     return data;
//   }
// );

const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactsById } = contactsAdapter.getSelectors(
  state => state.contactsApp.contacts
);

const contactsSlice = createSlice({
  name: 'contactsApp/contacts',
  initialState: contactsAdapter.getInitialState({
    searchText: '',
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
