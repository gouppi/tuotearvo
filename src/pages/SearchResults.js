import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchResultCard from "../components/SearchResultCard";
import { Query } from "react-apollo";
import { SEARCH_QUERY } from "../components/Apollo/Queries";
import LazyLoad from "react-lazyload";

import Paper from '@material-ui/core/Paper';

import ProductFilters from '../components/Product/ProductFilters';

const useStyles = makeStyles((theme) => ({
  layout: {
    padding: "10px",
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: "1184px",
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    padding: "20px",
  },
  paperTitle: {
    fontWeight: 200,
  },
  rootContainer: {
    marginTop: "10px",
  },
}));

export default function SearchResults(props) {
  const classes = useStyles();
  const q = props.searchTerm
    ? props.searchTerm
    : new URLSearchParams(window.location.search).get("q");
  console.log(q);
  return (
    <Query query={SEARCH_QUERY} variables={{ q: q }}>
      {({ loading, error, data }) => {
        if (loading)
          return (
            <Box
              style={{
                display: "flex",
                paddingTop: "2em",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={60} />
            </Box>
          );
        if (error) {
          console.log(error);
          return <p>Error :(</p>;
        }

        console.log("Raw data", data);

        return (
          <React.Fragment>
            <CssBaseline />
            <Container maxWidth="xl">
            <Paper className="PaperComponent" square variant="outlined">
              <Typography
                style={{
                  paddingBottom: "1em",
                  paddingTop: "10px",
                  fontWeight: 100,
                }}
                variant="h5"
              >
                Tulokset haullesi <i>{q}</i>:{" "}
              </Typography>
              <Grid container spacing={4}>
                <Grid item md={3}>
                  <ProductFilters filters={data.search.filters}/>
                </Grid>
                <Grid item container md={9} spacing={4}>

                  {data.search.products.map((product, i) => {
                    return (
                      <LazyLoad key={i}>
                        <SearchResultCard i={i} data={product} />
                      </LazyLoad>
                    );
                  })}

                </Grid>
              </Grid>
              </Paper>
            </Container>
          </React.Fragment>
        );
      }}
    </Query>
  );
}
