import React from 'react'
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import ReviewStep0 from '../components/NewReview/ReviewStep0';
import ReviewStep1 from '../components/NewReview/ReviewStep1';
import ReviewStep2 from '../components/NewReview/ReviewStep2';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: '10px'
    },
    layout: {
        padding: '10px',
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
          width:'1184px',
          marginLeft: 'auto',
          marginRight: 'auto',
        },
    },
    paper: {
        padding: '20px'
    },
    paperTitle: {
        fontWeight: 200
    }
}));

const steps = ['Valitse tuotekategoria', 'Anna tuotetiedot', 'Kirjoita arvostelu'];


function getStepContent(step) {
    switch (step) {
      case 0:
        return <ReviewStep0/>;
      case 1:
        return <ReviewStep1/>;
      case 2:
        return <ReviewStep2/>;
      default:
        throw new Error('Unknown step');
    }
  }

export default function NewReview() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };
    
      const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <React.Fragment>
            <Typography variant="h4" align="center" className="paperTitle">
                Lisää arvostelu
            </Typography>
            <Stepper activeStep={activeStep} className={classes.stepper}>
                {steps.map((label) => (
                <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                </Step>
                ))}
            </Stepper>
                {getStepContent(activeStep)}
                <div className={classes.buttons}>
                    {activeStep !== 0 && (
                        <Button onClick={handleBack} className={classes.button}>
                        Back
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        className={classes.button}
                    >
                        {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                    </Button>
                </div>
        </React.Fragment>
                    
    );
}