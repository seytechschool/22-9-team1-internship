import { motion } from 'framer-motion';
import FuseUtils from '@fuse/utils';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import NotificationPanel from 'app/fuse-layouts/shared-components/notificationPanel/NotificationPanel';
import ContactsMultiSelectMenu from './ContactsMultiSelectMenu';
import ContactsTable from './ContactsTable';
import {
  getDrivers,
  openAssignContactDialog,
  openDeleteContactDialog,
  openEditContactDialog,
  openNewContactDialog,
  openUnAssignContactDialog,
  removeContact,
  // toggleStarredContact,
  selectContacts,
  updateContact
} from './store/contactsSlice';

const formatData = vehicles =>
  vehicles.map(vehicle => {
    return {
      ...vehicle,
      fullName: vehicle.driver ? `${vehicle.driver.first_name} ${vehicle.driver.last_name}` : '',
      assigned: vehicle.driver ? 'vehicle.driver' : '',
      vehicle_brand_model: `${vehicle.brand} ${vehicle.model}` || ''
    };
  });

  
  function ContactsList(props) {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);
  const assignedDrivers = contacts.map(vehicle => vehicle.driver);
  const searchText = useSelector(({ contactsApp }) => contactsApp.contacts.searchText);
  const data = useSelector(({ contactsApp }) => contactsApp.contacts.data);
  // const user = useSelector(({ contactsApp }) => contactsApp.user);

  const [filteredData, setFilteredData] = useState(null);

  const columns = useMemo(
    () => [
      {
        id: 'assign',
        Header: 'Assign/Unassign ',
        accessor: 'assigned',
        width: 128,
        sortable: false,
        Cell: ({ row }) => (
          <div>
            {row.original.assigned ? (
              <Button
                onClick={ev => {
                  ev.stopPropagation();
                  dispatch(openUnAssignContactDialog(row.original));
                  dispatch(getDrivers());
                  // Unassign contact here
                }}
                variant="outlined"
                color="secondary"
              >
                Unassign
              </Button>
            ) : (
              <Button
                onClick={ev => {
                  ev.stopPropagation();
                  dispatch(openAssignContactDialog(row.original));
                  dispatch(getDrivers());
                }}
                variant="outlined"
                color="primary"
              >
                Assign
              </Button>
            )}
          </div>
        )
      },

      {
        Header: 'Vehicle Brand & Model',
        accessor: 'vehicle_brand_model',
        className: 'font-medium',
        sortable: true
      },

      {
        Header: 'Plate Number',
        accessor: 'plate_number',
        sortable: true
      },
      {
        Header: 'Assigned Driver',
        accessor: `fullName`,
        sortable: true
      },
      {
        Header: 'Edit & Remove',
        id: 'action',
        width: 128,
        sortable: false,
        Cell: ({ row }) => (
          <div className="flex items-center">
            <IconButton
              onClick={ev => {
                if (row) {
                  ev.stopPropagation();
                  dispatch(openEditContactDialog(row.original));
                }
              }}
            >
              <Icon>edit</Icon>
            </IconButton>

            <IconButton
              onClick={ev => {
                ev.stopPropagation();
                dispatch(openDeleteContactDialog(row.original.id));
                // dispatch(removeContact(row.original.id));
              }}
            >
              <Icon>delete</Icon>
            </IconButton>
          </div>
        )
      }
    ],
    // eslint-disable-next-line
    [dispatch, contacts]
  );

  useEffect(() => {
    function getFilteredArray(entities, _searchText) {
      if (_searchText.length === 0) {
        return contacts;
      }
      return FuseUtils.filterArrayByString(contacts, _searchText);
    }

    if (contacts) {
      setFilteredData(getFilteredArray(contacts, searchText));
    }
  }, [contacts, searchText]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          There are no vehicles!
        </Typography>
      </div>
    );
  }

  const formattedData = formatData(filteredData);

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}>

      <ContactsTable
        columns={columns}
        data={formattedData}
        onRowClick={(ev, row) => {
          // if (row) {
          //   dispatch(openEditContactDialog(row.original));
          // }
        }}
      />
      <NotificationPanel />
    </motion.div>
  );
}

export default ContactsList;
