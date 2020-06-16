/** THIS COMPONENT SHOWS PAGINATION BAR AND SORTING FOR PRODUCT LISTS */

import React from "react";
import Grid from "@material-ui/core/Grid";
import Pagination from "@material-ui/lab/Pagination";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

const ListSorting = ({
  totalPages,
  page,
  doFetchMore,
  doFetchMoreChangeSort,
  sort,
}) => {
  return (
    <>
      <Grid item style={{ display: "flex" }} xs={7}>
        <Pagination
          color="primary"
          count={totalPages}
          page={page}
          variant="outlined"
          shape="round"
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
          onChange={doFetchMore}
        />
      </Grid>
      <Grid item style={{ display: "flex", width: "100%" }} xs={5}>
        <FormControl style={{ flex: "1" }} variant="outlined">
          <InputLabel id="demo-simple-select-outlined-label">
            Järjestä
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            label="Järjestä"
            onChange={doFetchMoreChangeSort}
            value={sort}
          >
            <MenuItem disabled value={"latest"}>
              Uusimmat
            </MenuItem>
            <MenuItem value={"review"}>Arvostelluimmat</MenuItem>
            <MenuItem value={"az"}>Nimi A-Z</MenuItem>
            <MenuItem value={"za"}>Nimi Z-A</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </>
  );
};

export default ListSorting;
