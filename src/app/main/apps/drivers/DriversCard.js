import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import { openEditDriversDialog } from './store/driversSlice';

const DriversCard = ({drivers}) => {
    const dispatch = useDispatch()
  return drivers.map(driver=>(
    <Card sx={{ maxWidth: 200, margin: "10px" }} key = {driver.id} >
        <CardContent>
        <Typography gutterBottom variant="h5" component="div">
            {driver.first_name} {driver.last_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {driver.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {driver.phone_number}
        </Typography>
        </CardContent>
        <CardActions>
        <Button 
        size="small"
        onClick={()=>dispatch(openEditDriversDialog(driver))}
        >
            EDIT
        </Button>
        <Button size="small">DELETE</Button>
        </CardActions>
    </Card>

  ))
}

export default DriversCard