import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";

// TODO unique key properties here.

const ProductFilters = ({ updateFilters, checked, filters }) => {
  
  return (
    <Paper square variant="outlined">
      <FormControl component="fieldset">
        {filters.map((filter, i) => {
          let checkboxes = [];
          checkboxes.push(
            <FormLabel key={i} component="legend">
              {filter.filter}
            </FormLabel>
          );
          filter.values.map((f, j) => {
            checkboxes.push(
              <FormGroup key={i + "_" + j} aria-label="position">
                <FormControlLabel
                  value={f.id}
                  control={
                    <Checkbox
                      checked={(checked[f.group] || []).includes(f.id)}
                      onClick={() => {
                        updateFilters(f.group, f.id);
                      }}
                      color="primary"
                    />
                  }
                  label={f.name + " (" + f.count + ")"}
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
