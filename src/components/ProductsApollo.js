import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

import ReviewCardAlt from './Review/ReviewCardAlt';
import ReviewCard from './Review/ReviewCard';


const ProductsApollo = (props) => (
    <Query
        query={gql`
        {
            products(required:${props.required}) {
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
        
       
        return data.products.map((product) => (
            <ReviewCardAlt key={product.id} data={product} />
        ));
        }}
    </Query>
);

export default ProductsApollo;