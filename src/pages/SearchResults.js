import React, { useEffect, useRef } from "react";
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

export default function SearchResults(props) {
  const [filters, setFilters] = React.useState({
    brands: [],
    categories: [],
  });
  // const [categories,setCategories] = React.useState([]);
  // const [brands,setBrands] = React.useState([]);
  let [page, setPage] = React.useState(1);
  let [sort, setSort] = React.useState("review");

  const pageFirstRun = useRef(true);
  const sortFirstRun = useRef(true);
  let doRefetch;

  // When triggering fetchMore, render current view partially
  let [reloading, setReloading] = React.useState(false);
  let [hasLoadedOnce, setHasLoadedOnce] = React.useState(false);
  const q = new URLSearchParams(window.location.search).get("q");

  // This function is called once one of the filtering checkboxes are checked/unchecked.
  // Group -> does the sort belong to "brands" or "categories" - group?
  // Filter -> the value of the checkbox
  const updateFilters = (group, filter, productCount) => {
    console.log("UpdateFilters kutsuttu");
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
    // If we currently are on page number that isn't possible in new filter group, reset page to 1.
    // e.g. we're now on page 3 (products 21 - 30) and new filter group has only 11 products, we would be on empty page.
    if (productCount >= (page * 10) - 10) {
      doRefetch();
    } else {
      setPage(1);
    }
  };

  const loadingBox = (
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

  // Trigger doRefresh whenever page changes.
  useEffect(() => {
    if (pageFirstRun.current) {
      pageFirstRun.current = false;
      return;
    }
    doRefetch();
  }, [page, doRefetch]);

  // Trigger doRefresh whenever sort changes.
  useEffect(() => {
    if (sortFirstRun.current) {
      sortFirstRun.current = false;
      return;
    }
    doRefetch();
  }, [sort, doRefetch]);

  return (
    <Query
      query={SEARCH_QUERY}
      variables={{ q: q, limit: 10, page: page, sort: sort, filters: filters }}
    >
      {({ loading, error, data, fetchMore }) => {
        doRefetch = () => {
          setReloading(true);
          fetchMore({
            variables: {
              sort: sort,
              page: page,
              filters: filters,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              setReloading(false);
              if (!fetchMoreResult) return prev;
              return fetchMoreResult;
            },
          });
        };

        if (error) {
          console.log(error);
          return <p>Error :(</p>;
        }

        // Update first load to true once it's finished
        if (!loading && !hasLoadedOnce) {
          setHasLoadedOnce(true);
        }

        if (!hasLoadedOnce) {
          return loadingBox;
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
                        {data && (
                          <ListSorting
                            totalPages={data.search.total_pages}
                            page={data.search.page}
                            sort={sort}
                            doFetchMore={(e, page) => setPage(page)}
                            doFetchMoreChangeSort={(e, props) => setSort(props.props.value)}
                          />
                        )}
                      </Grid>
                    </Paper>


                    {data &&
                      data.search.products.map((product, i) => {
                        return (
                          <LazyLoad key={i}>
                            <SearchResultCard i={i} data={product} reloading={reloading} />
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
