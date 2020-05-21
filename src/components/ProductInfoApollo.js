import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import ReviewCardAlt from "./Review/ReviewCardAlt";
import ReviewCard from "./Review/ReviewCard";
import { Waypoint } from "react-waypoint";
import Grid from '@material-ui/core/Grid';

const INFO_QUERY = gql`
  query ProductInfo($limit: Int, $offset:Int) {
    productInfo(limit: $limit, offset:$offset) {
          id
          model
          image
          reviews_count
          average_score
        }
  }
`;

const ProductInfoApollo = (props) => (
    <Query query={INFO_QUERY} variables={{limit:10, offset:0}}>
        {({ loading, error, data, fetchMore }) => {
            if (loading) return <p>Loading...</p>;
            if (error) {
                console.log(error);
                return <p>Error :(</p>;
            }

            return data.productInfo.map((product, i) => (
                <React.Fragment key={i}>
                    <ReviewCard key={product.id} data={product} />
                    {i % 5 == 0 && (
                        <Grid item xs={12}>
                        <h4>TÄSSÄ VÄLIMAINOS</h4>
                        </Grid>
                    )}
                    {i === data.productInfo.length - 2 && (
                    <React.Fragment>
                        <Waypoint onEnter={() => fetchMore({
                            variables: {
                                limit: 10,
                                offset: data.productInfo.length
                            },
                            updateQuery: (prev, {fetchMoreResult}) => {
                                if (!fetchMoreResult) {
                                    return prev;
                                }
                                return {
                                    ...prev,
                                    productInfo: [...prev.productInfo, ...fetchMoreResult.productInfo]
                                }
                            }
                        })}/>
                    </React.Fragment>
                    )}
                </React.Fragment>
            ));
        }}
    </Query>
);

export default ProductInfoApollo;
