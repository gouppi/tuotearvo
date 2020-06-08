import React, { useEffect } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CategoryProductCard from "../components/Category/CategoryProductCard";
import { useParams } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Query } from "react-apollo";
import {CATEGORY_PRODUCTS_QUERY} from '../components/Apollo/Queries';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import LinkUI from "@material-ui/core/Link";
import { Link } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

export default function Categories(props) {

  let { category } = useParams();
  let [foobar, setFoobar] = React.useState(false);
  let [page,setPage] = React.useState(1);
  let [sort, setSort] = React.useState(null);

  useEffect(() => {
    document.title = "Tuotearvostelut - Kategoriat";
  });

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2} direction="row">
        <Query
          query={CATEGORY_PRODUCTS_QUERY}
          variables={{ limit: 10, page: 1, categorySeoName: category }}
        >
          {({ loading, error, data, fetchMore }) => {
            // TODO BIG PERFORMANCE UPGRADE HERE: Not even one categoryProducts category doesn't cache data.
            const doFetchMore = (e, page) => {
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

            if (loading) return <p>Loading...</p>;
            if (error) {
              console.log(error);
              return <p>Error :(</p>;
            }
            let { productsForCategory } = data;
            return (
              <>
                <Grid item xs={12}>
                  <Breadcrumbs aria-label="breadcrumb">
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
                  <Typography>Tähän tulee navigaatiopalkki</Typography>
                </Grid>
                <Grid item md={9}>
                  <Grid container item xs={12}>
                    <Grid item xs={6}>
                      <Pagination
                        count={productsForCategory.total_pages}
                        page={productsForCategory.page}
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
                        >
                          <MenuItem disabled value={"latest"}>Uusimmat</MenuItem>
                          <MenuItem value={"review"}>Arvostelluimmat</MenuItem>
                          <MenuItem value={"az"}>Nimi A-Z</MenuItem>
                          <MenuItem value={"za"}>Nimi Z-A</MenuItem>


                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    {foobar
                      ? productsForCategory.products.map((p, i) => (
                          <CategoryProductCard key={i} skeleton />
                        ))
                      : productsForCategory.products.map((product, i) => (
                          <CategoryProductCard
                            key={product.id}
                            data={product}
                          />
                        ))}
                  </Grid>
                </Grid>
              </>
            );
          }}
        </Query>
      </Grid>
    </Container>
  );
}
