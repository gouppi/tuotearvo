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

import Pagination from "@material-ui/lab/Pagination";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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
  const [filters, setFilters] = React.useState([]);
  let [page,setPage] = React.useState(1);
  let [sort,setSort] = React.useState('review');
  let [foobar, setFoobar] = React.useState(false);

  const classes = useStyles();
  const q = props.searchTerm
    ? props.searchTerm
    : new URLSearchParams(window.location.search).get("q");
  console.log(q);
  return (
    <Query query={SEARCH_QUERY} variables={{ q: q,limit: 10, page: page, sort:sort,  }}>
      {({ loading, error, data, fetchMore }) => {

        const doFetchMore = (e, page) => {
          console.log("Do Fetch More");
          setFoobar(true);
          setPage(page);
          fetchMore({
            variables: {
              page: page,
              sort: sort
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              setFoobar(false);
              return fetchMoreResult;
            },
          });
        };

        const doFetchMoreChangeSort = (e, props) => {
          const {value} = props.props;
          setFoobar(true);
          setSort(value);
          fetchMore({
            variables: {
              sort: value,
              page: page
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (! fetchMoreResult) return prev;
              setFoobar(false);
              return fetchMoreResult;
            }
          });
        };

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

        const updateFilters = (checkbox) => {
          console.log("UpdateFilters, fiter:", checkbox);
          let newFilters = [...filters];
          if (!newFilters.includes(checkbox)) {
            newFilters.push(checkbox);
          } else {
            newFilters = newFilters.filter(newfilter => newfilter !== checkbox);
          }
          setFilters(newFilters);
          console.log("Uudet filtterit ", newFilters);
        }



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
                <ProductFilters updateFilters={updateFilters} filters={data.search.filters} />
              </Grid>
              <Grid item container md={9} spacing={4}>
              <Grid container item xs={12}>
                    <Grid item xs={6}>
                      <Pagination
                        count={data.search.total_pages}
                        page={data.search.page}
                        variant="outlined"
                        shape="rounded"
                        style={{ width: "100%" }}
                        onChange={doFetchMore}

                      />
                    </Grid>
                    <Grid
                      item
                      style={{ display: "flex", justifyContent: "flex-end" }}
                      xs={6}
                    >
                      <FormControl style={{ flex: "1" }} variant="outlined">
                        <InputLabel id="demo-simple-select-outlined-label">
                          Järjestä
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          label="Järjestä"
                           onChange={doFetchMoreChangeSort}
                           value={sort}
                        >
                          <MenuItem disabled value={"latest"}>Uusimmat</MenuItem>
                          <MenuItem value={"review"}>Arvostelluimmat</MenuItem>
                          <MenuItem value={"az"}>Nimi A-Z</MenuItem>
                          <MenuItem value={"za"}>Nimi Z-A</MenuItem>


                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

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
