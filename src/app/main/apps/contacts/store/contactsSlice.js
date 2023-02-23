import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { addNotification } from 'app/fuse-layouts/shared-components/notificationPanel/store/dataSlice';
import NotificationModel from 'app/fuse-layouts/shared-components/notificationPanel/model/NotificationModel';
import axios from 'axios';
import { getUserData } from './userSlice';

export const getVehicles = createAsyncThunk('vehicle-list-app/vehicles/getVehicles', async () => {
  const response = await axios.get('https://cargofleet-api.fly.dev/team1/api/vehicles?page=1&limit=100');
  const data = await response.data.data;
  return { data };
});

export const addVehicle = createAsyncThunk(
  'vehicle-list-app/vehicles/addVehicle',
  async (contact, { dispatch, getState }) => {
    // console.log(contact.id)
    const response = await axios.post(
      'https://cargofleet-api.fly.dev/team1/api/vehicles',
      // contact
      {
        brand: contact.brand,
        model: contact.model,
        manufacture_year: contact.manufacture_year,
        color: contact.color,
        plate_number: contact.plate_number,
        engine_number: contact.engine_number,
        fuel_type: contact.fuel_type.value,
        image_url: contact.image_url,
        active: false,
        // id: contact.id
        // id: function selectId(instance) {
        //   return instance.id;
        
      }
    );

    // const data = await response.data.data;
    // console.log("data in posting", data)
    dispatch(getVehicles());

    // console.log("object", data)
    // return data;
  }
);

export const updateContact = createAsyncThunk(
  'vehicle-list-app/vehicles/updateVehicle',
  async (vehicle, { dispatch, getState }) => {
    try {
      const response = await axios.put(`https://cargofleet-api.fly.dev/team1/api/vehicles/${vehicle.id}`, vehicle);
      const data = await response.data.data;
      dispatch(
        addNotification(NotificationModel({ message: 'Vehicle has been updated', options: { variant: 'success' } }))
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
  'vehicle-list-app/vehicles/removeVehicle',
  async (contactId, { dispatch }) => {
    console.log('delete:', contactId);
    const response = await axios.delete(`https://cargofleet-api.fly.dev/team1/api/vehicles/${contactId}`);
    const data = await response.data.data;
    dispatch(getVehicles());

    return { data };
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
  closeNewContactDialog,
  openEditContactDialog,
  closeEditContactDialog
} = contactsSlice.actions;

export default contactsSlice.reducer;
