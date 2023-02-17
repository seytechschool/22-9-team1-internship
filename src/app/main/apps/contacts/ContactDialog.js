import FuseUtils from '@fuse/utils/FuseUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
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
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import _ from '@lodash';
import * as yup from 'yup';

import {
  removeContact,
  updateContact,
  addContact,
  closeNewContactDialog,
  closeEditContactDialog
} from './store/contactsSlice';

const options = [
  { value: 'diesel', label: 'Diesel' },
  { value: 'gasoline', label: 'Gasoline' },
  { value: 'propane', label: 'Propane' },
  { value: 'natural_gas', label: 'Natural gas' }
];

// const defaultValues = {
//   id: '',
//   name: '',
//   lastName: '',
//   avatar: 'assets/images/avatars/profile.jpg',
//   nickname: '',
//   company: '',
//   jobTitle: '',
//   email: '',
//   phone: '',
//   address: '',
//   birthday: '',
//   notes: ''
// };
const defaultValues = {
  id: '',
  brand: '',
  model: '',
  manufacture_year: '',
  color: '',
  image_url: '',
  plate_number: '',
  engine_number: '',
  fuel_type: '',
  active: ''
};

// /**
//  * Form Validation Schema
//  */
const schema = yup.object().shape({
  name: yup.string().required('You must enter a name')
});

function ContactDialog(props) {
  const dispatch = useDispatch();
  const contactDialog = useSelector(({ contactsApp }) => contactsApp.contacts.contactDialog);

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema)
  });

  const { isValid, dirtyFields, errors } = formState;

  const id = watch('id');
  // const name = watch('name');
  const vehicleBrand = watch('Vehicle Brand');
  // const avatar = watch('avatar');

  //   /**
  //    * Initialize Dialog with Data
  //    */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (contactDialog.type === 'edit' && contactDialog.data) {
      reset({ ...contactDialog.data });
    }

    //     /**
    //      * Dialog type: 'new'
    //      */
    if (contactDialog.type === 'new') {
      reset({
        ...defaultValues,
        ...contactDialog.data,
        id: FuseUtils.generateGUID()
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
    return contactDialog.type === 'edit' ? dispatch(closeEditContactDialog()) : dispatch(closeNewContactDialog());
  }

  //   /**
  //    * Form Submit
  //    */
  function onSubmit(data) {
    if (contactDialog.type === 'new') {
      dispatch(addContact(data));
    } else {
      dispatch(updateContact({ ...contactDialog.data, ...data }));
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
      // onClose={closeComposeDialog}
      fullWidth
      minWidth="xs"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {contactDialog.type === 'new' ? 'New Vehicle' : 'Edit Vehicle'}
          </Typography>
        </Toolbar>
        <div className="flex flex-col items-center justify-center pb-24">
          {/* <Avatar className="w-96 h-96" alt="contact avatar" src={avatar} /> */}
          <LocalShippingIcon style={{ fontSize: 100 }} />
          {contactDialog.type === 'edit' && (
            <Typography variant="h6" color="inherit" className="pt-8">
              {vehicleBrand}
            </Typography>
          )}
        </div>
      </AppBar>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
        <DialogContent classes={{ root: 'p-24' }}>
          <div className="flex">
            {/* <div className="min-w-48 pt-20"> */}
            {/* <Icon color="action">account_circle</Icon> */}
            {/* </div> */}
            <Controller
              control={control}
              name="Vehicle Brand"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Brand"
                  id="brand"
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
            {/* <div className="min-w-48 pt-20" /> */}

            <Controller
              control={control}
              name="model"
              render={({ field }) => (
                <TextField {...field} className="mb-24" label="Model" id="model" variant="outlined" fullWidth />
              )}
            />
          </div>

          <div className="flex">
            {/* <div className="min-w-48 pt-20">
              <Icon color="action">star</Icon>
            </div> */}
            <Controller
              control={control}
              name="yearOfManufacture"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  id="yearOfManufacture"
                  variant="outlined"
                  type="number"
                  label="Year Of Manufacture"
                  InputLabelProps={{
                    shrink: true
                  }}
                  placeholder="2016"
                  fullWidth
                />
              )}
            />
          </div>

          <div className="flex">
            {/* <div className="min-w-48 pt-20"> */}
            {/* <Icon color="action">phone</Icon> */}
            {/* </div> */}
            <Controller
              control={control}
              name="color"
              render={({ field }) => (
                <TextField {...field} className="mb-24" label="Color" id="color" variant="outlined" fullWidth />
              )}
            />
          </div>

          <div className="flex">
            <Controller
              control={control}
              name="vehicleImage"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Vehicle Image"
                  id="vehicleImage"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>

          <div className="flex">
            <Controller
              control={control}
              name="engineNumber"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Engine Number"
                  id="engineNumber"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>

          <div
            style={{
              color: 'hsl(0, 0%, 40%)',
              display: 'inline-block',
              fontSize: 16,
              marginTop: '1em',
              width: '100%'
            }}
          >
            <Select menuPlacement="auto" menuPosition="fixed" options={options} className="basic-single" />
          </div>

          {/* 
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">email</Icon>
            </div>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <TextField {...field} className="mb-24" label="Email" id="email" variant="outlined" fullWidth />
              )}
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">domain</Icon>
            </div>
            <Controller
              control={control}
              name="company"
              render={({ field }) => (
                <TextField {...field} className="mb-24" label="Company" id="company" variant="outlined" fullWidth />
              )}
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">work</Icon>
            </div>
            <Controller
              control={control}
              name="jobTitle"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Job title"
                  id="jobTitle"
                  name="jobTitle"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">cake</Icon>
            </div>
            <Controller
              control={control}
              name="birthday"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  id="birthday"
                  label="Birthday"
                  type="date"
                  InputLabelProps={{
                    shrink: true
                  }}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">home</Icon>
            </div>
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <TextField {...field} className="mb-24" label="Address" id="address" variant="outlined" fullWidth />
              )}
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">note</Icon>
            </div>
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Notes"
                  id="notes"
                  variant="outlined"
                  multiline
                  rows={5}
                  fullWidth
                />
              )}
            />
          </div> */}
        </DialogContent>

        {contactDialog.type === 'new' ? (
          <DialogActions className="justify-between p-4 pb-16">
            <div className="px-16">
              <Button variant="contained" color="secondary" type="submit" disabled={_.isEmpty(dirtyFields) || !isValid}>
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
              <Button variant="contained" color="secondary" type="submit" disabled={_.isEmpty(dirtyFields) || !isValid}>
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
    </Dialog>
  );
}

export default ContactDialog;
