import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import CategoryProductCard from "../Category/CategoryProductCard";

const CATEGORY_PRODUCTS_QUERY = gql`
  query categoryProducts($categorySeoName: String, $limit: Int) {
    products(limit: $limit, categorySeoName: $categorySeoName) {
      id
      product_family_id
      image
      name
      group_name
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
`;

const CategoryProducts = (props) => (
  <Query query={CATEGORY_PRODUCTS_QUERY} variables={{ limit: 10, categorySeoName: props.categoryName  }}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) {
        console.log(error);
        return <p>Error :(</p>;
      }

      console.log("CategoryProducts koko setti tässä", data.products);
      return data.products.map((product, i) => (
        <CategoryProductCard key={product.id} data={product} />
      ));
    }}
  </Query>
);

export default CategoryProducts;
