import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import DriversCard from './DriversCard';
import { selectDrivers } from './store/driversSlice';

function DriversList(props) {
  const drivers = useSelector(selectDrivers)
  
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}>
      <DriversCard drivers = {drivers} />
    </motion.div>
  );
}

export default DriversList;
