import React, {useRef} from "react";
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import LinkUI from "@material-ui/core/Link";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Search from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import { useHistory } from "react-router-dom";
import Box from "@material-ui/core/box";
import { Query } from "react-apollo";
import { FILTERS_QUERY, TITLE_INFO_QUERY } from "../components/Apollo/Queries";

import "./Navigation.css";

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderBottom: "3px solid #e8e8e8",
  },
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
  let history = useHistory();
  const timerRef = useRef(null);
  const [searchValue, setSearchValue] = React.useState("");

  // Handles top search input redirection
  const handleSearch = (value) => {
    setSearchValue(value);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!value) {
      return;
    }

    timerRef.current = setTimeout(() => {
      history.push("/search?q=" + value);
      props.setSearchTerm(value);
      setSearchValue("");
    }, 1000);

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
                <Query query={TITLE_INFO_QUERY}>
                  {({ loading, error, data }) => {
                    if (loading) return null;
                    if (!loading && !error) {
                      return (
                        <Typography variant="caption">
                          {data.titleInfo.review_count} arvostelua,{" "}
                          {data.titleInfo.product_count} tuotetta
                        </Typography>
                      );
                    }
                  }}
                </Query>
              </LinkUI>
            </Box>

            <OutlinedInput
              placeholder="Etsi arvosteluja tuotteille"
              id="input-with-icon-adornment"
              style={{ flex: "1" }}
              value={searchValue}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
            />
          </ToolBar>
          <Divider variant="fullWidth" />
          <ToolBar variant="dense" className={classes.toolbar}>
            <Query query={FILTERS_QUERY}>
              {({ loading, error, data }) => {
                if (loading) return null;
                if (error) {
                  console.log(error);
                  return <p>Error :(</p>;
                }
                return (
                  <nav>
                    <ul className="categoryList">
                      {data.categories.map((category, i) => {
                        return (
                          <li key={i} className="categoryListChild">
                            <LinkUI

                              component={Link}
                              to={"/tuotteet/" + category.seo_name}
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
                                  return (
                                    <li key={i}>
                                      <LinkUI
                                        to={"/tuotteet/" + child.seo_name}
                                        component={Link}
                                      >
                                        {child.name}
                                      </LinkUI>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
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
    </React.Fragment>
  );
}
