import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

import ReviewCardAlt from './Review/ReviewCardAlt';
import ReviewCard from './Review/ReviewCard';


const ProductInfoApollo = (props) => (
    <Query
        query={gql`
        {
            productInfo {
                id
                model
                image
                reviews_count
                average_score
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
        
        
        return data.productInfo.map((product) => (
            
            <ReviewCard key={product.id} data={product} />
        ));
        
        }}
    </Query>
);

export default ProductInfoApollo;