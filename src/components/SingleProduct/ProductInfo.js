import React from 'react'
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';

function createData(key, value) {
    return { key,value};
}

const rows = [
    createData('Valmistaja', 'Apple'),
    createData('Tuotekoodi', 'MRXJ2ZM/A / MRXJ2'),
    createData('EAN', '0190198764829'),
    createData('UNSPSC-koodi', '43191609'),
    createData('PID', '539585')
  ];

export default function ProductInfo() {
    return (
        <TableContainer component={Paper}>
            <Table size="small"aria-label="simple table">
                <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.key}>
                    <TableCell  component="th" scope="row">
                        {row.key}
                    </TableCell>
                    <TableCell align="left">{row.value}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}