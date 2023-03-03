import FuseUtils from '@fuse/utils/FuseUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Select from 'react-select';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useCallback, useEffect } from 'react';
import { MenuItem } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import _ from '@lodash';
import * as yup from 'yup';

import {
  removeContact,
  updateContact,
  addVehicle,
  closeNewContactDialog,
  closeEditContactDialog,
  closeDeleteContactDialog
} from './store/contactsSlice';

const options = [
  { value: 'diesel', label: 'Diesel' },
  { value: 'gasoline', label: 'Gasoline' },
  { value: 'propane', label: 'Propane' },
  { value: 'natural_gas', label: 'Natural gas' }
];

const defaultValues = {
  first_name: '',
  last_name: '',
  birth_date: '',
  email: '',
  phone_number: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  license_number: '',
  license_class: '',
  license_state: ''
};

/**
 * Form Validation Schema
 */
// const schema = yup.object({
//   brand: yup.string().required('You must enter a brand'),
//   model: yup.string().required('You must enter a model'),
//   manufacture_year: yup.string(),
//   color: yup.string().required('You must enter a color'),
//   image_url: yup.string().required('You must enter a image url'),
//   engine_number: yup.string().required('You must enter a engine number'),
//   plate_number: yup.string().required('You must enter a plate number'),
//   fuel_type: yup.string().required('You must enter a plate number')
//   // active: yup.string().required('You must enter a active')
// });

function ContactDialog(props) {
  const dispatch = useDispatch();
  const contactDialog = useSelector(({ contactsApp }) => contactsApp.contacts.contactDialog);

  const { control, watch, reset, handleSubmit, formState, getValues, setValue, setFieldValue } = useForm({
    mode: 'onChange',
    defaultValues
    // resolver: yupResolver(schema)
  });

  const { isValid, dirtyFields, errors } = formState;

  const id = watch('id');
  // const name = watch('name');
  // const vehicleBrand = watch('brand');
  // const avatar = watch('avatar');

  //   /**
  //    * Initialize Dialog with Data
  //    */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (contactDialog.type === 'edit' && contactDialog.data) {
      reset({
        ...contactDialog.data
      });
    }

    //     /**
    //      * Dialog type: 'new'
    //      */
    if (contactDialog.type === 'new') {
      reset({
        ...defaultValues
      });
    }
    if (contactDialog.type === 'delete') {
      reset({
        ...contactDialog.data
      });
    }
  }, [contactDialog.data, contactDialog.type, reset]);

  //   /**
  //    * On Dialog Open
  //    */
  useEffect(() => {
    if (contactDialog.props.open) {
      initDialog();
    }
  }, [contactDialog.props.open, initDialog]);

  //   /**
  //    * Close Dialog
  //    */
  function closeComposeDialog() {
    contactDialog.type === 'edit' ? dispatch(closeEditContactDialog()) : dispatch(closeNewContactDialog());
    contactDialog.type === 'delete' && dispatch(closeDeleteContactDialog());
  }

  //   /**
  //    * Form Submit
  //    */
  function onSubmit(data) {
    if (contactDialog.type === 'new') {
      dispatch(addVehicle(data));
    } else if (contactDialog.type === 'edit') {
      dispatch(updateContact(data));
    } else {
      dispatch(removeContact(data));
    }
    closeComposeDialog();
  }

  //   /**
  //    * Remove Event
  //    */
  function handleRemove() {
    dispatch(removeContact(id));
    closeComposeDialog();
  }
  function handleCancel() {
    closeComposeDialog();
  }

  return (
    <Dialog
      classes={{
        paper: 'm-24'
      }}
      {...contactDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      minwidth="xs"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {contactDialog.type === 'new' && 'New Driver'}
            {contactDialog.type === 'edit' && 'Edit Driver details'}
            {contactDialog.type === 'delete' && 'Remove Driver from the list'}
          </Typography>
        </Toolbar>
        <div className="flex flex-col items-center justify-center pb-24">
          {contactDialog.type === 'edit' && <EditIcon style={{ fontSize: 100 }} />}
          {contactDialog.type === 'new' && <AccountBoxIcon style={{ fontSize: 100 }} />}
          {contactDialog.type === 'delete' && <DeleteForeverIcon style={{ fontSize: 100 }} />}
        </div>
      </AppBar>
      {(contactDialog.type === 'edit' || contactDialog.type === 'new') && (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
          <DialogContent classes={{ root: 'p-24' }}>
            <div className="flex">
              <Controller
                name="first_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="First Name"
                    id="first_name"
                    error={!!errors.name}
                    helperText={errors?.name?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />
            </div>

            <div className="flex">
              <Controller
                control={control}
                name="last_name"
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Last Name"
                    id="last_name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>

            <div className="flex">
              <Controller
                control={control}
                name="birth_date"
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    id="birth_date"
                    variant="outlined"
                    type="date"
                    label="Date of birth"
                    InputLabelProps={{
                      shrink: true
                    }}
                    placeholder="1990"
                    fullWidth
                  />
                )}
              />
            </div>

            <div className="flex">
              <Controller
                control={control}
                name="email"
                type="email"
                render={({ field }) => (
                  <TextField {...field} className="mb-24" label="email" id="email" variant="outlined" fullWidth />
                )}
              />
            </div>

            <div className="flex">
              <Controller
                control={control}
                type="number"
                name="phone_number"
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Phone Number"
                    id="phone_number"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>

            <div className="flex">
              <Controller
                control={control}
                name="address1"
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="First Address"
                    id="address1"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="flex">
              <Controller
                control={control}
                name="address2"
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Secondary Address"
                    id="address2"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="flex">
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <TextField {...field} className="mb-24" label="City" id="city" variant="outlined" fullWidth />
                )}
              />
            </div>
            <div className="flex">
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <TextField {...field} className="mb-24" label="State" id="state" variant="outlined" fullWidth />
                )}
              />
            </div>
            <div className="flex">
              <Controller
                control={control}
                name="postal_code"
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Postal Code"
                    id="postal_code"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="flex">
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <TextField {...field} className="mb-24" label="Country" id="country" variant="outlined" fullWidth />
                )}
              />
            </div>
            <div className="flex">
              <Controller
                control={control}
                name="license_number"
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="License Number"
                    id="license_number"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="flex">
              <Controller
                control={control}
                name="license_class"
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="License Class"
                    id="license_class"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="flex">
              <Controller
                control={control}
                name="license_state"
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="License State"
                    id="license_state"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
          </DialogContent>

          {contactDialog.type === 'new' ? (
            <DialogActions className="justify-between p-4 pb-16">
              <div className="px-16">
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={_.isEmpty(dirtyFields) || !isValid}
                >
                  Submit
                </Button>
              </div>
              <div className="px-16">
                <Button variant="contained" color="secondary" type="button" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </DialogActions>
          ) : (
            <DialogActions className="justify-between p-4 pb-16">
              <div className="px-16">
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={_.isEmpty(dirtyFields) || !isValid}
                >
                  Save
                </Button>
              </div>
              <div className="px-16">
                <Button variant="contained" color="secondary" type="button" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </DialogActions>
          )}
        </form>
      )}
      {contactDialog.type === 'delete' && (
        <DialogActions className="justify-between p-4 pb-16">
          <div className="px-16">
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              onClick={ev => {
                ev.stopPropagation();
                dispatch(removeContact(contactDialog.data));
                closeComposeDialog();
              }}
            >
              Confirm
            </Button>
          </div>
          <div className="px-16">
            <Button variant="contained" color="secondary" type="button" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default ContactDialog;
