import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectProjects } from '../store/projectsSlice';

function Widget1(props) {
  const issueData = useSelector(selectProjects);
  const mappedIssue = issueData.map(item => item.issues);
  return (
    <Paper className="w-full rounded-20 shadow flex flex-col justify-between">
      <div className="flex items-center justify-between px-4 pt-8">
        <Typography className="text-16 px-16 font-medium" color="textSecondary">
          Issues
        </Typography>
        <IconButton aria-label="more">
          <Icon>more_vert</Icon>
        </IconButton>
      </div>
      <div className="text-center py-12" style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <div>
          <Typography className="text-48 font-semibold leading-none text-orange tracking-tighter my-11">
            {mappedIssue.map(item => item.open)}
          </Typography>
          <Typography className="text-18 font-normal text-orange-400">Open</Typography>
        </div>
        <div>
          <Typography className="text-48 font-semibold leading-none text-blue tracking-tighter my-11">
            {mappedIssue.map(item => item.overdue)}
          </Typography>
          <Typography className="text-18 font-normal text-blue-400">Overdue</Typography>
        </div>
      </div>
    </Paper>
  );
}

export default memo(Widget1);
