import React, {useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LinkUI from '@material-ui/core/Link';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Search from '@material-ui/icons/Search';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';

import AuthModal from './Auth/AuthModal';

const useStyles = makeStyles((theme) => ({
    appBar: {
        },
    subBar: {

    },
    kontti: {
        
    },
      toolbar: {
        display:'flex',
        justifyContent:'space-between',
        flexWrap: 'wrap',
        
      },
      toolbarTitle: {
          textDecoration:'none'
      },
      link: {
        margin: theme.spacing(1, 1.5),
      },
      lastlink: {
        margin: theme.spacing(1, 0),
      },
      navlink: {
        marginRight: theme.spacing(5.5),
      },
      searchBox: {
          flexBasis: '30%'
      }
}));

export default function Navigation() {
    const classes = useStyles();
    const [open, setOpen] = React.useState('');
    
    const loginClickOpen = () => {
        setOpen('login');
    }
    const registerClickOpen = () => {
        setOpen('register');
    }
  
    const handleClose = () => {
      setOpen('');
      
    };



    return (
        <React.Fragment>
            <Container style={{backgroundColor:'white'}} maxWidth={false} disableGutters>
            <Container maxWidth="lg" className={classes.kontti}>
                <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                    <ToolBar className={classes.toolbar} disableGutters={true}>
                        
                        <LinkUI component={Link} to="/" variant="button" color="textPrimary" href="/asdasdasd" className={classes.navlink}>
                            <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                                TUOTEARVOSTELUT
                            </Typography>
                        </LinkUI>
                        <FormControl className={classes.searchBox}>
                            <Input placeholder="Etsi arvosteluja tuotteille"
                            id="input-with-icon-adornment"
                            variant="outlined"
                            startAdornment={
                                <InputAdornment position="start">
                                <Search />
                                </InputAdornment>
                            }
                            />
                        </FormControl>
                        <div>
                            <Button onClick={registerClickOpen} color="secondary" variant="contained" className={classes.link}>
                                Rekisteröidy
                            </Button>
                            <Button onClick={loginClickOpen} color="primary" variant="contained" className={classes.lastlink}>
                                Kirjaudu sisään
                            </Button>
                        </div>
                    </ToolBar>
                </AppBar>
            </Container>
        <Divider />
        <Container maxWidth="lg" className={classes.kontti}>
                <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                    <ToolBar variant="dense" className={classes.toolbar} disableGutters={true}>
                        <nav>
                            <LinkUI component={Link} to="/" variant="button" color="textPrimary" href="/asdasdasd" className={classes.navlink}>
                                Koti
                            </LinkUI>
                            <LinkUI component={Link} to="/reviews" variant="button" color="textPrimary" className={classes.navlink}>
                                Arvostelut
                            </LinkUI>
                            <LinkUI component={Link} variant="button" to="/create" color="secondary" className={classes.navlink}>
                                Uusi arvostelu
                            
                            </LinkUI>                    
                        </nav>                     
                    </ToolBar>
                </AppBar>
            </Container>
        <Divider />
        </Container>
        <AuthModal open={open} reg={registerClickOpen} log={loginClickOpen} handleClose={handleClose}/>
        </React.Fragment>
    );
}