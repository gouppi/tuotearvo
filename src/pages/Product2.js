import React, { useEffect } from "react";

import { useParams } from "react-router-dom";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import LinkUI from "@material-ui/core/Link";
import { Link } from "react-router-dom";

const PRODUCT_QUERY = gql`
  query productPage($product: Int!) {
    product(id: $product) {
      id
      name
      group_name
      category {
        id
        name
        seo_name
      }
      parent_categories {
        name
        seo_name
      }
    }
  }
`;

const Product2 = () => {
  const { category, product } = useParams();
  console.log(category, product);
  return (
    <Query query={PRODUCT_QUERY} variables={{ product: parseInt(product) }}>
      {({ loading, error, data }) => {
        if (loading) return <p>loading...</p>;
        if (error) {
          console.log(error);
          return <p>Error :(</p>;
        }



        console.log("productQuery Product2:", data);
        return (
          <React.Fragment>
            <h1>Moi</h1>
            <Breadcrumbs aria-label="breadcrumb">
              <LinkUI component={Link} color="inherit" to="/">
                Etusivu
              </LinkUI>
              {data.product.parent_categories.map((category, i) => {
                let last = ++i === data.product.parent_categories.length ? true : false
                return (
                  <LinkUI component={Link} color={last ? "textPrimary" : 'inherit'} aria-current={last ? "page" : ""} to={"/tuotteet/" + category.seo_name}>
                    {category.name}
                  </LinkUI>
                );
              })}

            </Breadcrumbs>
          </React.Fragment>
        );
      }}
    </Query>
  );
};

export default Product2;
