import React from 'react';
import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
// import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
// import SaveIcon from '@material-ui/icons/Save';
import {makeStyles} from '@material-ui/core/styles';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import HeadsetIcon from '@material-ui/icons/Headset';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import InputLabel from '@material-ui/core/InputLabel';

import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import HappyIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import Rating from '@material-ui/lab/Rating';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

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
  paper: {
    padding: '10px',
  }
}));

export default function ReviewStep3() {
  const classes = useStyles();
  return (  
    <React.Fragment>
      <Grid container spacing={4}>
        <Grid item>
          <Typography variant="h5" style={{fontWeight:100}}>Kiitos arvostelustasi!</Typography>                    
        </Grid>
      </Grid>
    </React.Fragment>
  );
}