import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import Dialog from '@material-ui/core/Dialog';
//import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function AuthModal(props) {
  const classes = useStyles();
  const {open, reg,log, handleClose} = props;

  //const [innerOpen, setInnerOpen] = React.useState(false);

  let form;
  if ('register' === open) {
    form = <RegisterForm flipCard={log} />
  } else if ('login' === open) {
    form = <LoginForm flipCard={reg}/>
  }

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogContent>
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      {form}
      
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
    </DialogContent>
    </Dialog>
  );
}