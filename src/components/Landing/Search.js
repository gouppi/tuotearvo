import React from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Search from "@material-ui/icons/Search";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import "./styles.css";
import { useHistory } from "react-router-dom";

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  let history = useHistory();

  const startSearch = (e) => {
    history.push("/search?q=" + searchTerm);
  };

  return (
    <Paper className="PaperComponent" square variant="outlined">
      <Typography style={{ fontWeight: 100 }} variant="h5">
        Etsi tuotearvosteluja
      </Typography>
      <OutlinedInput
        placeholder="Hae tuotteen nimellä, EAN-koodilla tai tuotenumerolla"
        id="content-area-search-input"
        style={{ margin: "1em 3em", backgroundColor: "white", flex: "1" }}
        value={searchTerm}
        onKeyPress={(ev) => {
          if (ev.key === "Enter") {
            startSearch();
          }
        }}
        onChange={(event) => setSearchTerm(event.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        }
        endAdornment={
          <Button onClick={startSearch} variant="contained" color="primary">
            Hae
          </Button>
        }
      />
    </Paper>
  );
};

export default SearchComponent;
