import React from 'react';
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
import { useHistory } from "react-router-dom";

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

export default function Navigation(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState('');
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [searchTimeout, setSearchTimeout] = React.useState(0);
    let history = useHistory();
    let timeout = 0;

    // Opens Pop-up dialog, changes state to login
    const loginClickOpen = () => {
        setOpen('login');
        setDialogOpen(true);
    }
    // Opens Pop-up dialog, changes state to register
    const registerClickOpen = () => {
        setOpen('register');
        setDialogOpen(true);
    }
    // Closes pop-up dialog
    const handleClose = () => {
      setOpen('');
      setDialogOpen(false);
    };
    
    // Handles top search input redirection
    const handleSearch = (e) => {
        if (!e) {
            return;
        }
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            history.push("/search?q=" + e);
            props.setSearchTerm(e);
        }, 800)
    };


    return (
        <React.Fragment>
            <Container style={{backgroundColor:'white', position:'fixed', zIndex:'9999'}} maxWidth={false} disableGutters>
            <Container maxWidth="lg" className={classes.kontti}>
                <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                    <ToolBar className={classes.toolbar} disableGutters={true}>
                        
                        <LinkUI component={Link} to="/" variant="button" color="textPrimary" href="/asdasdasd" className={classes.navlink}>
                            <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                                TUOTEARVOSTELUT.NET
                            </Typography>
                            {/* <Typography variant="caption">123 421 Arvostelua</Typography> */}
                        </LinkUI>
                        <FormControl className={classes.searchBox}>
                            <Input placeholder="Etsi arvosteluja tuotteille"
                            id="input-with-icon-adornment"
                            variant="outlined"
                            onChange={e => {handleSearch(e.target.value)}}
                            startAdornment={
                                <InputAdornment position="start">
                                <Search/> 
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
                            <LinkUI component={Link} to="/products" variant="button" color="textPrimary" className={classes.navlink}>
                                Tuotteet
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
        <AuthModal dialogOpen={dialogOpen} open={open} reg={registerClickOpen} log={loginClickOpen} handleClose={handleClose}/>
        </React.Fragment>
    );
}