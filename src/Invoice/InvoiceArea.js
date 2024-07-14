import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const InvoiceArea =(props)=>{
    return(
        <TableRow index={props.index} border={1} >
        <TableCell style={{padding:5, width:100, textAlign:"center" }}>{props.ind}</TableCell>
        <TableCell style={{padding:5, width:700, textAlign:"center" }} onClick={props.clicked}>{props.name}</TableCell>
        <TableCell style={{padding:5, width:200, textAlign:"center"}}>{props.HSNCode}</TableCell>
        <TableCell style={{padding:5, textAlign:"center"}}><input style={{width:50, border:0, textAlign:"center"}}value={props.value} onChange={props.changed} type="number" /></TableCell>
        <TableCell style={{padding:5, textAlign:"center", width:100}}>{props.rate.toFixed(2)}</TableCell>
        <TableCell style={{padding:5, width:300, textAlign:"center"}}>{props.itemTotal.toFixed(2)}</TableCell>
    </TableRow>

    )
}

export default InvoiceArea;