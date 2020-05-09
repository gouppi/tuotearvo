import React, {useState} from 'react'
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import ReviewStep0 from '../components/NewReview/ReviewStep0';
import ReviewStep1 from '../components/NewReview/ReviewStep1';
import ReviewStep2 from '../components/NewReview/ReviewStep2';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent'
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

 const useStyles = makeStyles((theme) => ({
    buttons: {
        paddingTop:'10px'
    }
}));

const steps = ['Valitse tuotekategoria', 'Anna tuotetiedot', 'Kirjoita arvostelu'];


function getStepContent(step, nextStep) {
    switch (step) {
      case 0:
        return <ReviewStep0 nextStep={nextStep}/>;
      case 1:
        return <ReviewStep1 nextStep={nextStep}/>;
      case 2:
        return <ReviewStep2 nextStep={nextStep}/>;
      default:
        throw new Error('Unknown step');
    }
  }

export default function NewReview() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [reviewData, setReviewData] = useState({});


    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };
    
      const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <Container maxWidth="md">
            <Typography style={{fontWeight:100}} variant="h5">Uusi arvostelu</Typography>
            <Stepper activeStep={activeStep} orientation="vertical" className={classes.stepper}>
                {steps.map((label, i) => (
                <Step key={label}>
                    <StepLabel onClick={() => {setActiveStep(i)}}>{label}</StepLabel>
                    <StepContent>
                        {getStepContent(activeStep, handleNext)}
                        <div className={classes.buttons}>
                        {activeStep !== 0 && (
                            <Button onClick={handleBack}
                                    color="secondary"
                                    variant="outlined" 
                                    className={classes.button}>
                                Takaisin
                            </Button>
                        )}
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleNext}
                                className={classes.button}>
                                {activeStep === steps.length - 1 ? 'Place order' : 'Seuraava'}
                            </Button>
                        </div>
                    </StepContent>
                </Step>
                /* <Grid item md={6}>
                
                </Grid> */
                
                ))}
            </Stepper>
            
                
        </Container>
                    
    );
}