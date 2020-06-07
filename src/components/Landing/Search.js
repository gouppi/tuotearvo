import React from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Search from "@material-ui/icons/Search";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from '@material-ui/core/Button';
import "./styles.css";

const SearchComponent = () => {
  return (
    <Paper className="PaperComponent" square variant="outlined">
      <Typography style={{ fontWeight: 100 }} variant="h5">
        Etsi tuotearvosteluja
      </Typography>
      <OutlinedInput
        placeholder="Hae tuotteen nimellä, EAN-koodilla tai tuotenumerolla"
        id="content-area-search-input"
        style={{ margin: "1em 3em", backgroundColor: "white", flex: "1" }}
        onChange={(e) => {
          //handleSearch(e.target.value);
        }}
        startAdornment={
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        }
        endAdornment={
          <Button variant="contained" color="primary">
            Hae
          </Button>
        }
      />
    </Paper>
  );
};

export default SearchComponent;
