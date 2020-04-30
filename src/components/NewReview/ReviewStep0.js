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

export default function ReviewStep0() {
  const classes = useStyles();
  return (
    <React.Fragment>

      <Grid container spacing={1} className={classes.gridContainer}>
          <Button
          variant="outlined"
          color="primary"
          size="large"
          startIcon={<PhoneIphoneIcon style={{ fontSize: 40 }} />}>
          Puhelimet
        </Button>
          <Button
          variant="outlined"
          color="primary"
          size="large"
          startIcon={<HeadsetIcon style={{ fontSize: 40 }} />}>
          Audio
        </Button>
          <Button
          variant="outlined"
          color="primary"
          size="large"
          startIcon={<PhotoCameraIcon style={{ fontSize: 40 }} />}>
          Kamerat
        </Button>
        
       
      </Grid>
    </React.Fragment>
  );
}