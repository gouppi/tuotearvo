import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from '@material-ui/core/Paper';

const ProductFilters = ({ filters }) => {
  console.log(filters);
  return (
    <Paper square variant="outlined">
        <FormControl component="fieldset">
        {filters.map((filter) => {
            let checkboxes = [];
            checkboxes.push(<FormLabel component="legend">{filter.filter}</FormLabel>)
            filter.values.map(f => {
                checkboxes.push(
                <FormGroup aria-label="position" column>
                <FormControlLabel
                    value={f.name}
                    control={<Checkbox color="primary" />}
                    label={f.name + ' (' + f.count + ')'}
                    labelPlacement="end"
                />
                </FormGroup>
                );
            });
            return checkboxes;
            })}
        </FormControl>
    </Paper>
  );
};

export default ProductFilters;
