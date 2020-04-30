import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import {makeStyles} from '@material-ui/core/styles';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import HeadsetIcon from '@material-ui/icons/Headset';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import Autocomplete from '@material-ui/lab/Autocomplete';



const useStyles = makeStyles((theme) => ({
  typeButton: {
    display:'flex',
    flexDirection:'column',
    marginLeft:0,
    marginRight:0
  },
  wideButton: {
    fontSize: '48px'
  },
  gridContainer: {
    display:'flex',
    padding: '10px',
    justifyContent:'space-evenly',
    alignItems:'center'
  }
}));

export default function ReviewStep1() {
  const classes = useStyles();
  return (
    <React.Fragment>
         <TextField id="standard-basic" label="Merkki" />
         <TextField id="standard-basic" label="Malli" />
         <TextField id="standard-basic" label="Tarkenne" placeholder="Esim. tuotekoodi" />
         <TextField id="standard-basic" label="EAN-koodi" placeholder="0000000000000" />

    </React.Fragment>
  );
}