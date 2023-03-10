import FuseUtils from '@fuse/utils/FuseUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import BugReportIcon from '@material-ui/icons/BugReport';
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
  getVehiclesForIssue,
  closeNewContactDialog,
  closeEditContactDialog,
  closeDeleteContactDialog
} from './store/contactsSlice';

const options = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

const defaultValues = {
  vehicle_id: '',
  title: '',
  // description: '',
  priority: '',
  due_date: ''
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
  const vehiclesForIssue = useSelector(({ contactsApp }) => contactsApp.contacts.vehicles);
  const issueVehicle = vehiclesForIssue === undefined ? [] : vehiclesForIssue;
  const { control, watch, reset, handleSubmit, formState, getValues, setValue, setFieldValue } = useForm({
    mode: 'onChange',
    defaultValues
    // resolver: yupResolver(schema)
  });

  const { isValid, dirtyFields, errors } = formState;

  const id = watch('id');


  //   /**
  //    * Initialize Dialog with Data
  //    */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (contactDialog.type === 'edit') {
      reset({
        ...contactDialog.data,
        date: new Date(contactDialog.data.due_date).toISOString().slice(0, 10)
      });
    }

    //     /**
    //      * Dialog type: 'new'
    //      */
    if (contactDialog.type === 'new') {
      reset({
        ...contactDialog.data
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
            {contactDialog.type === 'new' && 'Add New Issue'}
            {contactDialog.type === 'edit' && 'Edit Issue details'}
            {contactDialog.type === 'delete' && 'Remove Issue from the list'}
          </Typography>
        </Toolbar>
        <div className="flex flex-col items-center justify-center pb-24">
          {contactDialog.type === 'edit' && <EditIcon style={{ fontSize: 100 }} />}
          {contactDialog.type === 'new' && <BugReportIcon style={{ fontSize: 100 }} />}
          {contactDialog.type === 'delete' && <DeleteForeverIcon style={{ fontSize: 100 }} />}
        </div>
      </AppBar>
      {contactDialog.type === 'edit' && (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
          <DialogContent classes={{ root: 'p-24' }}>
            <div className="flex">
              <Controller
                name="vehicle.brand"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Brand"
                    id="brand"
                    error={!!errors.name}
                    helperText={errors?.name?.message}
                    variant="outlined"
                    disabled
                    fullWidth
                  />
                )}
              />
            </div>
            <br />
            <div className="flex">
              <Controller
                control={control}
                name="title"
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} className="mb-24" label="Title" id="title" variant="outlined" fullWidth />
                )}
              />
            </div>

            <div className="flex">
              <Controller
                control={control}
                name="priority"
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    // {...addErrorIntoField(errors[name])}
                    required
                    select
                    variant="filled"
                    fullWidth
                    label="Priority"
                  >
                    <MenuItem value="">-Select-</MenuItem>
                    {options.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </div>
            <br />
            <div className="flex">
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    id="due_date"
                    variant="outlined"
                    type="date"
                    label="Due Date"
                    InputLabelProps={{
                      shrink: true
                    }}
                    placeholder="2023"
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

      {contactDialog.type === 'new' && (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
          <DialogContent classes={{ root: 'p-24' }}>
            <div className="flex">
              <Controller
                control={control}
                name="issue_vehicle_id"
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    // {...addErrorIntoField(errors[name])}
                    required
                    select
                    variant="filled"
                    fullWidth
                    label="Select a vehicle to create an issue"
                  >
                    <MenuItem value="">-None-</MenuItem>
                    {issueVehicle.length > 0
                      ? issueVehicle.map(option => (
                          <MenuItem key={option.id} value={option.id}>
                            {`${option.brand.toUpperCase()} ${option.model.toUpperCase()} || color: ${
                              option.color
                            } || year: ${new Date(option.manufacture_year).getFullYear()} `}
                          </MenuItem>
                        ))
                      : ''}
                  </TextField>
                )}
              />
            </div>
            <br />
            <div className="flex">
              <Controller
                control={control}
                name="title"
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} className="mb-24" label="Title" id="title" variant="outlined" fullWidth />
                )}
              />
            </div>

            <div className="flex">
              <Controller
                control={control}
                name="priority"
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    // {...addErrorIntoField(errors[name])}
                    required
                    select
                    variant="filled"
                    fullWidth
                    label="Priority"
                  >
                    <MenuItem value="">-Select-</MenuItem>
                    {options.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </div>
            <br />
            <div className="flex">
              <Controller
                control={control}
                name="due_date"
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    id="due_date"
                    variant="outlined"
                    type="date"
                    label="Due Date"
                    InputLabelProps={{
                      shrink: true
                    }}
                    placeholder="2023"
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
