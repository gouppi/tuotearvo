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
import ListSorting from "../components/Product/ListSorting";

import Paper from "@material-ui/core/Paper";

import ProductFilters from "../components/Product/ProductFilters";

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


// Something is totally wrong here. When using refetch, we should use previous fetch data until new data is provided.
// SearchFilters is having a meltdown because of this and I tried to fix it but now pagination "lags" one action behind (prolly because of state change)

export default function SearchResults(props) {
  const [filters, setFilters] = React.useState({
    brands: [],
    categories: [],
  });
  // const [categories,setCategories] = React.useState([]);
  // const [brands,setBrands] = React.useState([]);
  let [page, setPage] = React.useState(1);
  let [sort, setSort] = React.useState("review");
  // When triggering fetchMore, render current view partially
  let [reloading, setReloading] = React.useState(false);

  //const classes = useStyles();
  const q = new URLSearchParams(window.location.search).get("q");
  console.log(q);
  return (
    <Query
      query={SEARCH_QUERY}
      variables={{ q: q, limit: 10, page: page, sort: sort, filters: filters }}
    >
      {({ loading, error, data, fetchMore }) => {
        const updateFilters = (group, filter) => {
          console.log("UpdateFilters, group: " + group + " filter: " + filter);
          let newFilters = filters;
          if (!newFilters.hasOwnProperty(group)) {
            newFilters[group] = [];
          }
          if (newFilters[group].includes(filter)) {
            newFilters[group] = newFilters[group].filter((e) => e !== filter);
          } else {
            newFilters[group].push(filter);
          }
          setFilters(newFilters);
          doRefetch();
        };

        const doFetchMore = (e, page) => {
          console.log("Do Fetch More");
          setPage(page);
          doRefetch();
        };

        const doFetchMoreChangeSort = (e, props) => {
          const { value } = props.props;
          setSort(value);
          doRefetch();
        };

        const doRefetch = () => {
          setReloading(true);
          fetchMore({
            variables: {
              sort: sort,
              page: page,
              filters: filters,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              setReloading(false);
              return fetchMoreResult;
            },
          });
        };

        if (loading || reloading)
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
                <Grid container spacing={3}>
                  <Grid item md={3}>
                    <ProductFilters
                      updateFilters={updateFilters}
                      checked={filters}
                      filters={data ? data.search.filters : []}
                    />
                  </Grid>
                  <Grid container item md={9}>
                    <Paper
                      square
                      style={{ padding: "8px", width: "100%" }}
                      variant="outlined"
                    >
                      <Grid container spacing={4}>
                        {reloading && <CircularProgress size={60} />}
                        {!reloading && !loading && data && (
                          <ListSorting
                            totalPages={data.search.total_pages}
                            page={data.search.page}
                            sort={sort}
                            doFetchMore={doFetchMore}
                            doFetchMoreChangeSort={doFetchMoreChangeSort}
                          />
                        )}
                      </Grid>
                    </Paper>

                    {reloading && <CircularProgress size={60} />}
                    {!reloading &&
                      !loading &&
                      data &&
                      data.search.products.map((product, i) => {
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
