import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectDrivers } from './store/driversSlice';
// import FuseUtils from '@fuse/utils';
// import Avatar from '@material-ui/core/Avatar';
// import Icon from '@material-ui/core/Icon';
// import IconButton from '@material-ui/core/IconButton';
// import Typography from '@material-ui/core/Typography';
// import { useMemo, useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Button } from '@material-ui/core';

function DriversList(props) {
    // const drivers = useSelector(selectDrivers)
    // useEffect(()=>{
        // console.log(useSelector(selectDrivers))
    // },[])
  
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}>
      {/* {drivers.map(ele=><p>{ele.email}</p>)} */}
      drivers list
    </motion.div>
  );
}

export default DriversList;
