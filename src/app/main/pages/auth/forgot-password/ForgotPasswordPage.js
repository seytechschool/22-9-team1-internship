import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { resetWithFireBase } from 'app/auth/store/resetSlice';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { MailConfirmPage } from '../mail-confirm/MailConfirmPage';

const useStyles = makeStyles(theme => ({
  root: {}
}));

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter an email address')
});
const defaultValues = {
  email: ''
};

function ForgotPasswordPage() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema)
  });

  const { isValid, dirtyFields, errors } = formState;
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  function onSubmit(model) {
    dispatch(resetWithFireBase(model));
    setWasSubmitted(true);
    setEmail(model.email);
    reset(defaultValues);
  }

  return (
    <div>
      {!wasSubmitted ? (
        <div className={clsx(classes.root, 'flex flex-col flex-auto items-center justify-center p-16 sm:p-32')}>
          <div className="flex flex-col items-center justify-center w-full">
            <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="w-full max-w-384">
                <CardContent className="flex flex-col items-center justify-center p-16 sm:p-24 md:p-32">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
                    <div className="flex items-center mb-48">
                      <img
                        className="logo-icon w-60"
                        src="https://cargofleet.us/assets/img/logo.png"
                        alt="cargo-fleet-logo"
                      />
                      <div className="border-l-1 mr-4 w-1 h-40" />
                      <div>
                        <Typography className="text-24 font-semibold logo-text" color="inherit">
                          Cargo
                        </Typography>
                        <Typography className="text-16 tracking-widest -mt-8 font-700" color="textSecondary">
                          fleet
                        </Typography>
                      </div>
                    </div>
                  </motion.div>

                  <Typography variant="h6" className=" mb-24 font-semibold text-18 sm:text-24">
                    Recover your password
                  </Typography>

                  <form
                    name="recoverForm"
                    noValidate
                    className="flex flex-col justify-center w-full"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          className="mb-16"
                          label="Email"
                          autoFocus
                          type="email"
                          error={!!errors.email}
                          helperText={errors?.email?.message}
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />

                    <Button
                      variant="contained"
                      color="primary"
                      className="w-224 mx-auto mt-16"
                      aria-label="Reset"
                      disabled={_.isEmpty(dirtyFields) || !isValid}
                      type="submit"
                    >
                      Send reset link
                    </Button>
                  </form>

                  <div className="flex flex-col items-center justify-center pt-32 pb-24">
                    <Link className="font-normal" to="/pages/auth/login">
                      Go back to login
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      ) : (
        <MailConfirmPage email={email} />
      )}
    </div>
  );
}
export default ForgotPasswordPage;
