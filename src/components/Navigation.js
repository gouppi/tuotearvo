import React from "react";
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import LinkUI from "@material-ui/core/Link";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Search from "@material-ui/icons/Search";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import { useHistory } from "react-router-dom";
import Box from "@material-ui/core/box";
//import AuthModal from "./Auth/AuthModal";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import './Navigation.css';


const FILTERS_QRY = gql`
  query categories {
    categories {
      id
      name
      seo_name
      parentId
      children {
        id
        name
        seo_name
        parentId
        children {
          id
          name
          seo_name
          parentId
        }
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  appBar: {

      borderBottom: '3px solid orange'
  },
  subBar: {},
  kontti: {},
  toolbar: {

    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  toolbarTitle: {
    textDecoration: "none",
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
    flexBasis: "30%",
  },
}));

export default function Navigation(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [searchTimeout, setSearchTimeout] = React.useState(0);
  let history = useHistory();
  let timeout = 0;

  // Opens Pop-up dialog, changes state to login
  const loginClickOpen = () => {
    setOpen("login");
    setDialogOpen(true);
  };
  // Opens Pop-up dialog, changes state to register
  const registerClickOpen = () => {
    setOpen("register");
    setDialogOpen(true);
  };
  // Closes pop-up dialog
  const handleClose = () => {
    setOpen("");
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
    }, 800);
  };

  return (
    <React.Fragment>
      <AppBar

        position="sticky"
        color="transparent"
        elevation={0}
        className={classes.appBar}
      >
        <Container
          style={{ backgroundColor: "white", zIndex: "9999" }}
          maxWidth={false}
        >
          <ToolBar className={classes.toolbar} disableGutters={true}>
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LinkUI
                component={Link}
                to="/"
                variant="button"
                color="textPrimary"
                href="/asdasdasd"
                className={classes.navlink}
              >
                <Typography
                  variant="h6"
                  color="inherit"
                  noWrap
                  className={classes.toolbarTitle}
                >
                  TUOTEARVOSTELUT.NET
                </Typography>
                <Typography variant="caption">
                  2150280 arvostelua, 4123 tuotetta
                </Typography>
                {/*  */}
              </LinkUI>
            </Box>

            <OutlinedInput
              placeholder="Etsi arvosteluja tuotteille"
              id="input-with-icon-adornment"
              style={{ flex: "1" }}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
            />

            {/*<div>
                            <Button onClick={registerClickOpen} color="secondary" variant="contained" className={classes.link}>
                                Rekisteröidy
                            </Button>
                            <Button onClick={loginClickOpen} color="primary" variant="contained" className={classes.lastlink}>
                                Kirjaudu sisään
                            </Button>
                        </div>
                        */}
          </ToolBar>
          <Divider variant="fullWidth" />
          {/* <ToolBar variant="dense" className={classes.toolbar} disableGutters={true}>
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
                    </ToolBar>*/}

          <ToolBar variant="dense" className={classes.toolbar}>
            <Query query={FILTERS_QRY}>
              {({ loading, error, data, fetchMore }) => {
                if (loading) return <p></p>;
                if (error) {
                  console.log(error);
                  return <p>Error :(</p>;
                }
                console.log("query filters query", data);
                return (
                  <nav>
                      <ul className="categoryList">

                    {data.categories.map((category, i) => {
                      return (
                          <li className="categoryListChild">
                        <LinkUI
                          key={i}
                          component={Link}
                          to={"/tuotteet/"+category.seo_name}
                          variant="button"
                          color="textPrimary"
                          href="/asdasdasd"
                          className={classes.navlink}
                        >
                          {category.name}

                        </LinkUI>
                        {null !== category.children && (
                            <ul className="categoryListSubMenu">
                            {category.children.map((child, i) => {
                              return <li key={i}>{child.name}</li>;
                            })}
                            </ul>)
                        }
                        </li>
                      );
                    })}
                    </ul>
                  </nav>
                );
              }}
            </Query>
          </ToolBar>
        </Container>
      </AppBar>


      {/* <AuthModal
        dialogOpen={dialogOpen}
        open={open}
        reg={registerClickOpen}
        log={loginClickOpen}
        handleClose={handleClose}
      /> */}
    </React.Fragment>
  );
}
