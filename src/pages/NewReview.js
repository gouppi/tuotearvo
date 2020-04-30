import React from 'react'
import Navigation from '../components/Navigation';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {makeStyles} from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
const useStyles = makeStyles((theme) => ({
    maincontainer: {
        paddingTop:'10px',
    }
}));

export default function NewReview() {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Navigation></Navigation>
            <Container maxWidth="false" className={classes.maincontainer}>
                <Container maxWidth="lg">
                    <FormControl className={classes.margin}>
                        <InputLabel htmlFor="demo-customized-textbox">Age</InputLabel>
                        <Input type="text"></Input>
                    </FormControl>
                </Container>
            </Container>
        </React.Fragment>
    );
}