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

export default function ReviewStep2() {
  const classes = useStyles();
  return (  
    <React.Fragment>
      <Grid container spacing={4}>
                <Grid container item md={6}>
                  <Grid item>
                    <Typography variant="p" style={{fontWeight:100}}>Kuinka monta tähteä annat tuotteelle?</Typography>                    
                    <Rating
                      size="medium"
                      precision={1}    
                      name="simple-controlled"
                      />
                  </Grid>
                  <Grid item>
                  <Typography variant="p" style={{fontWeight:100}}>Suositteletko tuotetta muille?</Typography>                    
                <FormControlLabel
        control={<Checkbox icon={<HappyIcon />} checkedIcon={<HappyIcon />} name="checkedH" />}
        label="Ehdottomasti!"
      />
                  </Grid>
                
                </Grid>
                <Grid container item md={6}>
                  <Grid item xs={12}>
                    
                    <Typography variant="p" style={{fontWeight:100}}>Anna arviosi myös näihin</Typography>                    
                  </Grid>
                  <Grid item xs={12}>
                  <Typography component="legend">Tuotteen laatu</Typography>
                    <Rating
                        size="small"
                        precision={1}    
                        name="simple-controlled2"
                        />
                  </Grid>
                  <Grid item xs={12}>
                  <Typography component="legend">Vastinetta rahalle</Typography>
                    <Rating
                        size="small"
                        precision={1}    
                        name="simple-controlled3"
                        />
                  </Grid>
                </Grid>
                <Grid item md={12}>
                <TextField
                    id="outlined-textarea"
                    label="Sanallinen arvostelu"
                    placeholder="Anna sanallinen arvostelusi"
                    multiline
                    fullWidth
                    rows={5}
                    variant="outlined"
                    />
                </Grid>
            
      </Grid>
    </React.Fragment>
  );
}