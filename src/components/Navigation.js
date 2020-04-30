import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Search from '@material-ui/icons/Search';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';


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
          
      },
      link: {
        margin: theme.spacing(1, 1.5),
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
    return (
        <React.Fragment>
            <Container maxWidth="lg" className={classes.kontti}>
                <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                    <ToolBar className={classes.toolbar}>
                        <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                        TUOTEARVOSTELUT
                        </Typography>
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
                            <Button href="#" color="secondary" variant="contained" className={classes.link}>
                                Rekisteröidy
                            </Button>
                            <Button href="#" color="primary" variant="contained" className={classes.link}>
                                Kirjaudu sisään
                            </Button>
                        </div>
                    </ToolBar>
                </AppBar>
            </Container>
        <Divider />
        <Container maxWidth="lg" className={classes.kontti}>
                <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                    <ToolBar variant="dense" className={classes.toolbar}>
                        <nav>
                            <Link variant="button" color="textPrimary" href="#" className={classes.navlink}>
                            Koti
                            </Link>
                            <Link variant="button" color="textPrimary" href="#" className={classes.navlink}>
                            Arvostelut
                            </Link>
                            <Link variant="button" color="secondary" href="#" className={classes.navlink}>
                            Lisää Arvostelu
                            </Link>                    
                        </nav>                     
                    </ToolBar>
                </AppBar>
            </Container>
        <Divider />
        </React.Fragment>
    );
}