import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Rating from '@material-ui/lab/Rating';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';  

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import MoodIcon from '@material-ui/icons/Mood';
import UploadDropZone from '../UploadDropZone';

import SadIcon from '@material-ui/icons/SentimentDissatisfiedOutlined';
import HappyIcon from '@material-ui/icons/SentimentSatisfiedOutlined';


export default function ReviewModal(props) {
    const {open,handleClose} = props;

   

    return (
    <div>
      <Dialog maxWidth="md" fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        {/* <<DialogTitle id="form-dialog-title">Arvostele tuote</DialogTitle> */}
        <Alert severity="warning">Et ole kirjautuneena sisään. Kirjautuneena saat jokaisesta hyväksytystä tuotearvostelusta lisäpisteitä, joilla voit lunastaa palkintoja.</Alert>

        
        <DialogContent>
            <Grid container spacing={4}>
                <Grid item md={6}>
                <Typography variant="h6" style={{fontWeight:100}}>Kuinka monta tähteä annat tuotteelle?</Typography>                    
                <Rating
                    size="large"
                    precision={1}    
                    name="simple-controlled"
                    />
                </Grid>
                <Grid item md={6}>
                <Typography variant="h6" style={{fontWeight:100}}>Suositteletko tuotetta muille?</Typography>                    
                <FormControlLabel
        control={<Checkbox icon={<HappyIcon />} checkedIcon={<HappyIcon />} name="checkedH" />}
        label="Ehdottomasti!"
      />
                </Grid>
                <Grid item md={12}>
                <TextField
                    id="outlined-textarea"
                    label="Sanallinen arvostelu"
                    placeholder="Anna sanallinen arvostelusi"
                    multiline
                    fullWidth
                    rows={3}
                    variant="outlined"
                    />
                </Grid>
                <Grid item md={6}>
                <TextField
                    id="outlined-textarea"
                    label="Sähköpostiosoite"
                    placeholder="Anna sähköpostiosoitteesi"
                    required
                    fullWidth
                    variant="outlined"
                    type="email"
                    />
                </Grid>
                <Grid item md={6}>
                <TextField
                    id="outlined-textarea"
                    label="Nimimerkki"
                    placeholder="Syötä nimimerkkisi"
                    required
                    variant="outlined"
                    fullWidth
                    type="nickname"
                    />
                </Grid>
                
            </Grid>
            
            {/* <UploadDropZone dialogTitle="Lataa kuvia arvosteluusi liittyvään tuotteeseen"></UploadDropZone> */}

          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText> */}

          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
