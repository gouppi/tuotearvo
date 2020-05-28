import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import ReviewCardAlt from "../Review/ReviewCardAlt";

const RecentReviews = (props) => (
  <Query
    query={gql`
      {
        recentReviews {
          text
          text_short
          title
          rating
          origin
          reviewedAt
          product {
            name
            group_name
            image
          }
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) {
        console.log(error);
        return <p>Error :(</p>;
      }

      console.log(data.recentReviews);
      return data.recentReviews.map((review) => (
        <ReviewCardAlt key={review.id} data={review} />
      ));
    }}
  </Query>
);

export default RecentReviews;
