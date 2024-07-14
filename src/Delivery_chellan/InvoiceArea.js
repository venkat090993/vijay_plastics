import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

const InvoiceArea = (props) => {
  return (
    <TableRow index={props.index} border={1}>
      <TableCell style={{ padding: 5, width: 100, textAlign: "center" }}>
        {props.ind}
      </TableCell>
      <TableCell
        style={{ padding: 5, width: 700, textAlign: "center" }}
        onClick={props.clicked}
      >
        {props.name}
      </TableCell>
      <TableCell style={{ padding: 5, textAlign: "center" }}>
        <input
          style={{ width: 50, border: 0, textAlign: "center" }}
          value={props.value}
          onChange={props.changed}
          type="number"
        />
      </TableCell>
    </TableRow>
  );
};

export default InvoiceArea;
