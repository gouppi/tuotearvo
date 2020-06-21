import React, { useEffect, useRef } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CategoryProductCard from "../components/Category/CategoryProductCard";
import { useParams } from "react-router-dom";
import { Query } from "react-apollo";
import { CATEGORY_PRODUCTS_QUERY } from "../components/Apollo/Queries";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import LinkUI from "@material-ui/core/Link";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";

import ProductFilters from "../components/Product/ProductFilters";
import ListSorting from "../components/Product/ListSorting";

export default function Categories(props) {
  const [filters, setFilters] = React.useState({
    brands: [],
    categories: [],
  });
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState("review");

  const pageFirstRun = useRef(true);
  const sortFirstRun = useRef(true);
  let doRefetch;

  // When triggering fetchMore, render current view partially
  let [reloading, setReloading] = React.useState(false);
  let [hasLoadedOnce, setHasLoadedOnce] = React.useState(false);

  const { category } = useParams();

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
    if (productCount >= page * 10 - 10) {
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
      query={CATEGORY_PRODUCTS_QUERY}
      variables={{
        limit: 10,
        page: page,
        sort: sort,
        categorySeoName: category,
      }}
    >
      {({ loading, error, data, fetchMore }) => {
        // TODO BIG PERFORMANCE UPGRADE HERE: Not even one categoryProducts category doesn't cache data.
        doRefetch = () => {
          setReloading(true);
          fetchMore({
            variables: {
              page: page,
              sort: sort,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              setReloading(false);
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

        let { productsForCategory } = data;

        return (
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
                Foo
              </Typography>
              <Grid container spacing={2} direction="row">
                <Grid item xs={12}>

                <Breadcrumbs>
                  <LinkUI component={Link} color="inherit" to="/">
                    Etusivu
                    </LinkUI>
                    {data.category.parents.map(parent => (
                       <LinkUI
                       component={Link}
                       color="inherit"
                       to={"/tuotteet/" + parent.seo_name}
                     >{parent.name}</LinkUI>
                    ))}
                    <LinkUI
                      component={Link}
                      color="textPrimary"
                      to={"/tuotteet/" + data.category.seo_name}
                    >
                      {data.category.name}
                    </LinkUI>
                    </Breadcrumbs>
              </Grid>

                <Grid item md={3}>
                  <ProductFilters
                    updateFilters={updateFilters}
                    checked={filters}
                    filters={productsForCategory.filters}
                  />
                </Grid>
                <Grid item md={9}>
                  <Paper
                    square
                    style={{ padding: "8px", width: "100%" }}
                    variant="outlined"
                  >
                    <Grid container spacing={4}>
                      {data && (
                        <ListSorting
                          totalPages={productsForCategory.total_pages}
                          page={productsForCategory.page}
                          sort={sort}
                          doFetchMore={(e, page) => setPage(page)}
                          doFetchMoreChangeSort={(e, props) =>
                            setSort(props.props.value)
                          }
                        />
                      )}
                    </Grid>
                  </Paper>

                  <Grid item xs={12}>
                    {data &&
                      productsForCategory.products.map((product, i) => (
                        <CategoryProductCard
                          key={product.id}
                          data={product}
                          reloading={reloading}
                        />
                      ))}
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        );
      }}
    </Query>
  );
}
