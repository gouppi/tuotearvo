import React, {useState} from 'react';
//import Grid from '@material-ui/core/Grid';
//import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Checkbox from '@material-ui/core/Checkbox';
//import Button from '@material-ui/core/Button';
//import SaveIcon from '@material-ui/icons/Save';
import {makeStyles} from '@material-ui/core/styles';
//import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
//import HeadsetIcon from '@material-ui/icons/Headset';
//import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
//import Autocomplete from '@material-ui/lab/Autocomplete';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Grid from '@material-ui/core/Grid';
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
    padding: '0 10px 10px 10px',
  }
}));

export default function ReviewStep1() {
  const classes = useStyles();

  const [review, setReview] = useState({});

  const handleChange = (newData) => {
    
    let newD = {...review, newData};
    console.log(newD);
    
    //setReview(newData);
  };


  return (
    <React.Fragment>
      <Grid container className={classes.gridContainer} spacing={3}>
        <Grid item md={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Merkki</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={review.manufacturer}
              onChange={handleChange}>
                <MenuItem key="manufacturer" value={'Apple'}>Apple</MenuItem>
                <MenuItem value={{manufacturer:'Samsung'}}>Samsung</MenuItem>
                <MenuItem value={{manufacturer:'Sony'}}>Sony</MenuItem>
                <MenuItem value={{manufacturer:'Motorola'}}>Motorola</MenuItem>
                <MenuItem value={{manufacturer:'Nokia'}}>Nokia lol</MenuItem>
                <MenuItem value={{manufacturer:'Huawei'}}>Huawei</MenuItem>
                <MenuItem value={{manufacturer:'LG'}}>LG</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={6}>
          <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Malli</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="model"
                value={review.model}
                onChange={handleChange}>
                  <MenuItem key="model" value={'Malli 1'}>Malli 1</MenuItem>
                  <MenuItem value={{model:'Malli 2'}}>Malli 2</MenuItem>
                  <MenuItem value={{model:'Malli 3'}}>Malli 3</MenuItem>
                  <MenuItem value={{model:'Malli 4'}}>Malli 4</MenuItem>
                  <MenuItem value={{model:'Malli 5'}}>Malli 5</MenuItem>
                  <MenuItem value={{model:'Malli 6'}}>Malli 6</MenuItem>
                  <MenuItem value={{model:'Malli 7'}}>Malli 7</MenuItem>
              </Select>
            </FormControl>
        </Grid>
        <Grid item md={6}>
          <TextField fullWidth id="standard-basic3" label="Tarkenne" placeholder="Esim. tuotekoodi" />
        </Grid>
        <Grid item md={6}>
          <TextField fullWidth id="standard-basic4" label="EAN-koodi" placeholder="0000000000000" />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}