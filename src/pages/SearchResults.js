import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import ReviewCard from "../components/Review/ReviewCard";
import { Query } from "react-apollo";
import gql from "graphql-tag";

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
  let searchTerm = props.searchTerm
    ? props.searchTerm
    : new URLSearchParams(window.location.search).get("q");
  console.log(searchTerm);
  return (
    <Query
      query={gql`
      {
          search(q:"${searchTerm}") {
              id
              model
              image
              reviews {
                  title
                  createdAt
                  text
                  score
                  origin
                  variation {
                      display_name
                  }
              }
          }
      }
      `}
    >
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

        return (
          <React.Fragment>
            <CssBaseline />
            <Container maxWidth="md" className={classes.rootContainer}>
              <Typography
                style={{
                  paddingBottom: "1em",
                  paddingTop: "10px",
                  fontWeight: 100,
                }}
                variant="h5"
              >
                Tulokset haullesi <i>{searchTerm}</i>:{" "}
              </Typography>
              <Grid container spacing={4}>
                {data.search.map((product) => (
                  <ReviewCard key={product.id} data={product} />
                ))}
              </Grid>
            </Container>
          </React.Fragment>
        );
      }}
    </Query>
  );
}
