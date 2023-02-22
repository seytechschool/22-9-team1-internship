import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { selectDrivers } from './store/driversSlice';

function DriversList(props) {
  // this line breaks the website, couldn't figure out whats wrong
  // const drivers = useSelector(selectDrivers)
  
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}>
      drivers list
    </motion.div>
  );
}

export default DriversList;
