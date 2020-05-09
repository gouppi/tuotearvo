import React, {useState} from 'react';
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
import ChildFriendlyIcon from '@material-ui/icons/ChildFriendly';

import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';


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

export default function ReviewStep0(props) {
  const classes = useStyles();

  const [active, setActive] = useState('');

  // Similar to componentDidMount and componentDidUpdate:
  /*useEffect(() => {
    // Update the document title using the browser API
    document.title = `Lisää Arvostelu - Tuotearvostelut.dev`;
  }, []);
*/

  const changeButtonActive = () => {

  }

  return (
    <React.Fragment>
      <Grid container spacing={1} className={classes.gridContainer}>
       <Grid item>
          <Button className=""
          style={{flex:1}}
          variant="outlined"
          
          color="primary"
          size="large"
          //onClick={props.nextStep}
          onClick={() => {setActive('clicked')}}
          startIcon={<PhoneIphoneIcon style={{ fontSize: 40 }} />}>
          
          Puhelimet
        </Button>
        </Grid>
        <Grid item>
          <Button
          style={{flex:1}}
          variant="outlined"
          
          color="primary"
          size="large"
          startIcon={<PhotoCameraIcon style={{ fontSize: 40 }} />}>
          Kamerat
        </Button>
        </Grid>
        <Grid item>
          <Button
          style={{flex:1}}
          variant="outlined"
          color="primary"
          size="large"
          startIcon={<DesktopWindowsIcon style={{ fontSize: 40 }} />}>
          Tietokoneet
        </Button>
        </Grid>
        <Grid item>
          <Button
          style={{flex:1}}
          variant="outlined"
          color="primary"
          size="large"
          startIcon={<HeadsetIcon style={{ fontSize: 40 }} />}>
          Audio
        </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}