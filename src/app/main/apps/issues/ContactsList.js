import { motion } from 'framer-motion';
import moment from 'moment';
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
  openDeleteContactDialog,
  openEditContactDialog,
  openNewContactDialog,
  // toggleStarredContact,
  selectContacts,
} from './store/contactsSlice';

const formatDataIssue = vehicles =>
  vehicles.map(issue => {
    return {
      ...issue,
      due_date_format: `${moment.utc(issue.due_date).format('YYYY-MM-DD')}`,
    };
  });

function ContactsList(props) {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);
  const searchText = useSelector(({ contactsApp }) => contactsApp.contacts.searchText);
  const data = useSelector(({ contactsApp }) => contactsApp.contacts.data);

  const [filteredData, setFilteredData] = useState(null);

  const columns = useMemo(
    () => [
      {
        Header: 'Issue Title',
        accessor: 'title',
        sortable: true
      },

      {
        Header: 'Priority',
        accessor: 'priority',
        sortable: true
      },
      {
        Header: 'Due Date',
        accessor: 'due_date_format',
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
          There are no issues!
        </Typography>
      </div>
    );
  }

  const formattedData = formatDataIssue(filteredData);

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
