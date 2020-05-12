import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

import ReviewCardAlt from './Review/ReviewCardAlt';

const ProductsApollo = () => (
    <Query
        query={gql`
        {
            products {
                id
                name
                image
                reviews {
                    text
                    created_at
                    user {
                        username
                        avatar
                    }
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
        //console.log(data);
        return data.products.map((product) => (
            <ReviewCardAlt key={product.id} data={product} />
        ));
        }}
    </Query>
);

export default ProductsApollo;