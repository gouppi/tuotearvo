import React from 'react'
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { Typography } from '@material-ui/core';

import Divider from '@material-ui/core/Divider';

const FILTERS_QUERY = gql`
query ProductFilters($category_id: [Int], $brand_id: [Int]) {
  productFilters(category_id:$category_id , brand_id: $brand_id) {
        categories {
            id
            name
        }
        brands {
            id
            name
        }
      }
}
`;



const ProductFilters = () => {
    const [checked, setChecked] = React.useState(true);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    return (
        <Query query={FILTERS_QUERY}>
            {({ loading, error, data, fetchMore }) => {
                if (loading) return <p>Loading...</p>;
                if (error) {
                    console.log(error);
                    return <p>Error :(</p>;
                }
                console.log(data);
                return (
                    <React.Fragment>
                        <FormControl component="fieldset">
                            <FormLabel component="p">Tuotekategoriat</FormLabel>
                            <FormGroup aria-label="position" row>
                                {data.productFilters.categories.map((category) => (
                                    <FormControlLabel
                                        value={category.id}
                                        control={<Checkbox color="primary" />}
                                        label={<Typography>{category.name}</Typography>}
                                        labelPlacement="right"
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                        <FormControl component="fieldset">
                            <FormLabel component="p">Valmistajat</FormLabel>
                            <FormGroup aria-label="position" row>
                                {data.productFilters.brands.map((brand) => (
                                    <FormControlLabel
                                        value={brand.id}
                                        control={<Checkbox color="primary" />}
                                        label={<Typography>{brand.name}</Typography>}
                                        labelPlacement="right"
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                    </React.Fragment>
                )
            }}
        </Query>
    )
};

export default ProductFilters;