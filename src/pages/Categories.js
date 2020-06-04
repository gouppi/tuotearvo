import React, { useEffect } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import Grid from "@material-ui/core/Grid";

import RecentReviews from "../components/Apollo/RecentReviews";
import CategoryProducts from "../components/Apollo/CategoryProducts";
import CategoryProductCard from "../components/Category/CategoryProductCard";

import { useParams } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import LinkUI from "@material-ui/core/Link";
import { Link } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

export default function Categories(props) {
  const CATEGORY_PRODUCTS_QUERY = gql`
    query categoryProducts($categorySeoName: String!, $limit: Int, $page: Int) {
      productsForCategory(
        limit: $limit
        categorySeoName: $categorySeoName
        page: $page
      ) {
        limit
        page
        total_pages
        products {
          id
          product_family_id
          image
          reviews_count
          rating_avg
          name
          group_name
          category {
            id
            name
            seo_name
          }
          reviews {
            id
            text
            text_short
            title
            recommends
            rating
          }
        }
      }
      category(categorySeoName: $categorySeoName) {
        id
        seo_name
        name
      }
    }
  `;

  let { category } = useParams();
  let [foobar, setFoobar] = React.useState(false);

  useEffect(() => {
    document.title = "Tuotearvostelut - Kategoriat";
  });

  useEffect(() => {
    console.log("UseEffect, kategoria on nyt: " + category);
  }, [category]);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2} direction="row">
        <Query
          query={CATEGORY_PRODUCTS_QUERY}
          variables={{ limit: 10, page: 1, categorySeoName: category }}
        >
          {({ loading, error, data, fetchMore }) => {
            const doFetchMore = (e, page) => {
              setFoobar(true);
              console.log("Vaihdoin sivua, olen sivulla: ", page);

              /*
                    TODO BIG PERFORMANCE UPGRADE HERE:
                        - Not even one categoryProducts category doesn't cache data.

                */

              fetchMore({
                variables: {
                  page: page,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  console.log("Prev", prev);
                  console.log("FetchMoreResult", fetchMoreResult);
                  if (!fetchMoreResult) return prev;
                  setFoobar(false);
                  return fetchMoreResult;
                  // return Object.assign({}, prev, {
                  //     productsForCategory: [...prev.productsForCategory, ...fetchMoreResult.productsForCategory]
                  // });
                },
              });
            };

            if (loading) return <p>Loading...</p>;
            if (error) {
              console.log(error);
              return <p>Error :(</p>;
            }
            let { productsForCategory } = data;
            //console.log(productsForCategory);
            return (
              <>
                <Grid container item xs={12}>
                  <Grid item xs={3}>
                    <Breadcrumbs aria-label="breadcrumb">
                      <LinkUI component={Link} color="inherit" to="/">
                        Etusivu
                      </LinkUI>
                      <LinkUI
                        component={Link}
                        color="textPrimary"
                        to={"/" + data.category.seo_name}
                      >
                        {data.category.name}
                      </LinkUI>
                    </Breadcrumbs>
                  </Grid>
                  <Grid item xs={3}>
                    <Pagination
                      count={productsForCategory.total_pages}
                      page={productsForCategory.page}
                      variant="outlined"
                      shape="rounded"
                      onChange={doFetchMore}
                    />
                  </Grid>
                  <Grid item style={{display:'flex', justifyContent:'flex-end'}} xs={3}>
                    <FormControl style={{flex:'1'}} variant="outlined">
                      <InputLabel id="demo-simple-select-outlined-label">
                        Järjestä
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        label="Järjestä"
                      >
                        <MenuItem value={10}>Arvostelluimmat</MenuItem>
                        <MenuItem value={20}>Uusimmat</MenuItem>
                        <MenuItem value={30}>Katsotuimmat</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid item md={3}>
                  <Typography>Tähän tulee navigaatiopalkki</Typography>
                </Grid>
                <Grid item md={9}>
                  {foobar ? productsForCategory.products.map(p =>
                    <CategoryProductCard skeleton/>
                  ) : (
                    productsForCategory.products.map((product, i) => (
                      <CategoryProductCard key={product.id} data={product} />
                    ))
                  )}
                </Grid>
              </>
            );

            //console.log("CategoryProducts koko setti tässä", data.products);

            // return data.products.map((product, i) => (
            //   <CategoryProductCard key={product.id} data={product} />
            // ));
          }}
        </Query>
        {/* <Grid item md={3}>
          <Typography>Tähän tulee navigaatiopalkki</Typography>
        </Grid>
        <Grid container spacing={2} item md={9}>
          <Pagination count={10} variant="outlined" shape="rounded" />
          <CategoryProducts categoryName={category} />
        </Grid> */}
      </Grid>
    </Container>
  );
}
