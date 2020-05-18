import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

import ReviewCardAlt from './Review/ReviewCardAlt';
import ReviewCard from './Review/ReviewCard';


const ProductsApollo = (props) => (
    <Query
        query={gql`
        {
            products {
                id
                model
                image
                reviews {
                    title
                    text
                    score
                    variation {
                        display_name
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
        
        if (props.vertical) {
            return data.products.map((product) => (
                <ReviewCard key={product.id} data={product} />
            ));
        }
        return data.products.map((product) => (
            <ReviewCardAlt key={product.id} data={product} />
        ));
        }}
    </Query>
);

export default ProductsApollo;