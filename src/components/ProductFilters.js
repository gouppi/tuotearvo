import React from 'react'
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { Typography } from '@material-ui/core';

import Divider from '@material-ui/core/Divider';

const ProductFilters = () => {
    const [checked, setChecked] = React.useState(true);

    const handleChange = (event) => {
      setChecked(event.target.checked);
    };

    return (
        <React.Fragment>
            <FormControl component="fieldset">
                <FormLabel component="p">Tuotekategoriat</FormLabel>
                <FormGroup aria-label="position" row>
                    <FormControlLabel
                        value="puhelimet"
                        control={<Checkbox color="primary" />}
                        label={<Typography>Puhelimet (123)</Typography>}
                        checked={checked}
                        labelPlacement="right"
                        />
                        <FormControlLabel
                        value="puhelimet"
                        control={<Checkbox color="primary" />}
                        label="Telefoonit"
                        labelPlacement="right"
                        />
                        <FormControlLabel
                        value="puhelimet"
                        control={<Checkbox color="primary" />}
                        label="Kämmykät"
                        labelPlacement="right"
                        />
                </FormGroup>
            </FormControl>
            <FormControl component="fieldset">
                <FormLabel component="p">Valmistajat</FormLabel>
                <FormGroup aria-label="position" row>
                    <FormControlLabel
                        value="puhelimet"
                        control={<Checkbox color="primary" />}
                        label={<Typography>Apple (3)</Typography>}
                        checked={checked}
                        labelPlacement="right"
                        />
                        <FormControlLabel
                        value="puhelimet"
                        control={<Checkbox color="primary" />}
                        label="Sannisunni"
                        labelPlacement="right"
                        />
                        <FormControlLabel
                        value="puhelimet"
                        control={<Checkbox color="primary" />}
                        label="Nokia?"
                        labelPlacement="right"
                        />
                </FormGroup>
            </FormControl>
        </React.Fragment>
    )
};

export default ProductFilters;