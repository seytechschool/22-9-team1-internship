import FuseUtils from '@fuse/utils/FuseUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import { AppBar, Button, Dialog, DialogActions, DialogContent, TextField, Toolbar, Typography } from '@material-ui/core';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import _ from '@lodash';
import * as yup from 'yup';

import { closeEditDriversDialog, closeNewDriversDialog } from './store/driversSlice';

const defaultValues = {
  id: '',
  address1: '',
  address2: '',
  birth_date: '',
  city: '',
  country: '',
  email: '',
  first_name: '',
  last_name: '',
  license_class: '',
  license_number: '',
  license_state: '',
  phone_number: '',
  postal_code: '',
  state: '',

};

const schema = yup.object().shape({
  first_name: yup.string().required('You must enter a name'),
});

function DriversDialog(props) {
  const dispatch = useDispatch();
  const driversDialog = useSelector(({ driversApp }) => driversApp.drivers.driversDialog);

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema)
  });

  const { isValid, dirtyFields, errors } = formState;

  const id = watch('id');
  const name = watch('first_name');

  const initDialog = useCallback(() => {
    if (driversDialog.type === 'edit' && driversDialog.data) {
      reset({ ...driversDialog.data });
    }
    if (driversDialog.type === 'new') {
      reset({
        ...defaultValues,
        ...driversDialog.data,
        id: FuseUtils.generateGUID()
      });
    }
  }, [driversDialog.data, driversDialog.type, reset]);

  useEffect(() => {
    if (driversDialog.props.open) {
      initDialog();
    }
  }, [driversDialog.props.open, initDialog]);

  function closeComposeDialog() {
    return driversDialog.type === 'edit' ? dispatch(closeEditDriversDialog()) : dispatch(closeNewDriversDialog());
  }

  function onSubmit(data) {
    if (driversDialog.type === 'new') {
    //   add new driver 
    } else {
    //   update new driver
    }
    closeComposeDialog();
  }

  function handleRemove() {
    // remove driver
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
      {...driversDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      minwidth="xs"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {driversDialog.type === 'new' ? 'New Driver' : 'Edit Driver'}
          </Typography>
        </Toolbar>
        <div className="flex flex-col items-center justify-center pb-24">
          {/* <Avatar className="w-96 h-96" alt="contact avatar" src={avatar} /> */}
          <LocalShippingIcon style={{ fontSize: 100 }} />
          {driversDialog.type === 'edit' && (
            <Typography variant="h6" color="inherit" className="pt-8">
              {name}
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
              name="first_name"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="First name"
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
            {/* <div className="min-w-48 pt-20" /> */}

            <Controller
              control={control}
              name="last_name"
              render={({ field }) => (
                <TextField {...field} className="mb-24" label="Last name" id="last_name" variant="outlined" fullWidth />
              )}
            />
          </div>

          <div className="flex">
            {/* <div className="min-w-48 pt-20">
              <Icon color="action">star</Icon>
            </div> */}
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
                  label="Birthday"
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
              name="email"
              render={({ field }) => (
                <TextField {...field} className="mb-24" label="Email" id="email" variant="outlined" fullWidth />
              )}
            />
          </div>

          <div className="flex">
            <Controller
              control={control}
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
                  label="address1"
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
              name="city"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="City"
                  id="city"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
          <div className="flex">
            <Controller
              control={control}
              name="state"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="State"
                  id="state"
                  variant="outlined"
                  fullWidth
                />
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
                  label="Postal code"
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
              name="license_number"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="License number"
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
              name="country"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Country"
                  id="country"
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
                  label="License class"
                  id="license_class"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
        </DialogContent>

        {driversDialog.type === 'new' ? (
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

export default DriversDialog;
