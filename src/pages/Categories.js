import React, { useEffect } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CategoryProductCard from "../components/Category/CategoryProductCard";
import { useParams } from "react-router-dom";
import { Query } from "react-apollo";
import {CATEGORY_PRODUCTS_QUERY} from '../components/Apollo/Queries';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import LinkUI from "@material-ui/core/Link";
import { Link } from "react-router-dom";

import ListSorting from '../components/Product/ListSorting';

export default function Categories(props) {

  let { category } = useParams();
  let [foobar, setFoobar] = React.useState(false);
  let [page,setPage] = React.useState(1);
  let [sort, setSort] = React.useState('review');

  useEffect(() => {
    document.title = "Tuotearvostelut - Kategoriat";
  });

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2} direction="row">
        <Query
          query={CATEGORY_PRODUCTS_QUERY}
          variables={{ limit: 10, page: page, sort:sort, categorySeoName: category }}
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
                  <ListSorting
                          totalPages={productsForCategory.total_pages}
                          page={productsForCategory.page}
                          sort={sort}
                          doFetchMore={doFetchMore}
                          doFetchMoreChangeSort={doFetchMoreChangeSort}
                        />
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
