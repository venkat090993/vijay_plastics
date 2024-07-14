import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import data from "../Invoice/data.json";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import InvoiceArea from "./InvoiceArea";
import { toWords } from "number-to-words";
import "./invoice.css";
import Navbar from "./Navbar";
import axios from "axios";
import fire from "../fire";

class Invoice extends Component {
  state = {
    itemList: [],
    total: 0,
    SGST: 0,
    CGST: 0,
    grandTotal: 0,
    count: 1,
    invoiceNo: 0,
  };

  componentDidMount() {
    axios
      .get("https://invoicebuilder-28adf.firebaseio.com/invnum/invnum.json")
      .then((res) => {
        console.log(res.data);
        let invoiceNo = res.data;
        this.setState({ invoiceNo: invoiceNo });
      });
  }

  addItem = (itemObject, index) => {
    const items = [...this.state.itemList];
    let item = itemObject;
    let count = this.state.count;
    items.push(item);
    const itemJi = items.map((item, index) => {
      return { ...item, ind: index + 1 };
    });
    this.setState({ itemList: itemJi, count: count });
  };
  deleteItem = (index) => {
    const itemList = [...this.state.itemList];
    itemList.splice(index, 1);
    const itemji = itemList.map((item, index) => {
      return { ...item, ind: index + 1 };
    });
    const total = [];
    itemList.map((item) => {
      total.push(item.itemTotal);
    });
    let totalVal = total.reduce((total, el) => {
      return total + el;
    }, 0);
    console.log(totalVal);
    const GST = (totalVal * 9) / 100;
    const grandTotal = totalVal + GST * 2;
    this.setState({
      itemList: itemji,
      total: totalVal,
      CGST: GST,
      SGST: GST,
      grandTotal: grandTotal,
    });
  };

  changeRate = (event, index) => {
    const itemList = [...this.state.itemList];
    const item = { ...itemList[index] };
    item.value = event.target.value;
    item.itemTotal = item.value * item.rate;
    itemList[index] = item;
    const total = [];
    itemList.map((item) => {
      total.push(item.itemTotal);
    });
    let totalVal = total.reduce((total, el) => {
      return total + el;
    }, 0);
    const GST = (totalVal * 9) / 100;
    const grandTotal = totalVal + GST * 2;
    this.setState({
      itemList: itemList,
      total: totalVal,
      CGST: GST,
      SGST: GST,
      grandTotal: grandTotal,
    });
  };
  generate = () => {
    const input = document.getElementById("print");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "JPEG", 10, 1);
      pdf.save("download.pdf");
    });
  };

  saveData = () => {
    const db = fire.database().ref();
    const invval = +this.state.invoiceNo + 1;
    const inv = { invnum: invval };
    db.child("invnum/").update(inv);
    const invoices = {
      invoiceData: this.state.itemList,
      total: this.state.total,
      CGST: this.state.CGST,
      SGST: this.state.SGST,
      invoiceNo: this.state.invoiceNo,
    };
    axios
      .post(
        "https://invoicebuilder-28adf.firebaseio.com/invoices.json",
        invoices
      )
      .then((res) => {
        console.log(res);
      });
  };

  logOut = () => {
    fire
      .auth()
      .signOut()
      .then((u) => console.log("successfully signed out"))
      .catch((error) => console.log(error));
  };

  render() {
    return (
      <div>
        <Grid container>
          <Grid item md={12}>
            <Navbar
              logOut={this.logOut}
              generate={this.generate}
              saveData={this.saveData}
            />
          </Grid>
          <Grid item xs={12} style={{ border: "1px black solid" }}>
            <div
              style={{
                border: "1px solid black",
                margin: "60px",
                width: 700,
                float: "left",
              }}
              id="print"
            >
              <div
                style={{
                  textAlign: "center",
                  border: "1px solid black",
                  fontSize: 25,
                }}
              >
                TAX INVOICE
              </div>
              <Table border={1}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      style={{ padding: "2px", lineHeight: "1" }}
                    >
                      <div>
                        <span style={{ fontWeight: "bold", fontSize: 19 }}>
                          Vijay Plastics
                        </span>
                        <br />
                        48/12 Ramasamy Raja street
                        <br />
                        Arumbakkam
                        <br />
                        Chennai - 600106
                        <br />
                        GSTIN: 33BGPPR3963M1ZM
                        <br />
                        Phone number: 9841252944
                        <br />
                        Email:vijayplastics2010@gmail.com
                      </div>
                      <br />

                      <div>
                        <span style={{ fontWeight: "bold" }}>Buyer :</span>{" "}
                        <br />
                        <span style={{ fontWeight: "bold" }}>
                          Phoenix Medical Systems Pvt Ltd
                        </span>
                        <br />
                        No. S-55, SIPCOT industrial Estate
                        <br />
                        Vengadu village
                        <br />
                        Sriperumbadur <br />
                        Chennai - 602105
                        <br />
                        GSTIN: 33AAACP1905E1Z2
                      </div>
                    </TableCell>

                    <TableCell colSpan={4}>
                      <div>
                        <div
                          style={{
                            margin: 30,
                            border: 0,
                            marginTop: 0,
                            marginBottom: 0,
                            fontWeight: "bold",
                          }}
                        >
                          Invoice Number :{" "}
                          <input
                            type="number"
                            value={this.state.invoiceNo}
                            onChange={(e) => {
                              this.setState({ invoiceNo: +e.target.value });
                            }}
                            style={{ border: 0, width: 100 }}
                          />
                        </div>{" "}
                        <br />
                        <div style={{ margin: 30, border: 0, marginTop: 0 }}>
                          <span style={{ marginRight: 5, fontWeight: "bold" }}>
                            Date:
                          </span>
                          <input type="date" style={{ border: 0 }} />
                        </div>
                        <div
                          style={{
                            margin: 30,
                            border: 0,
                            marginTop: 0,
                            marginBottom: 0,
                            fontWeight: "bold",
                          }}
                        >
                          {" "}
                          Order number:{" "}
                          <input
                            type="text"
                            style={{ border: 0, width: 200 }}
                          />
                        </div>
                        <br />
                        <div style={{ margin: 30, border: 0, marginTop: 0 }}>
                          <span style={{ marginRight: 10, fontWeight: "bold" }}>
                            Date:
                          </span>
                          <input type="date" style={{ border: 0 }} />
                        </div>
                        <div
                          style={{
                            margin: 30,
                            border: 0,
                            marginTop: 0,
                            marginBottom: 0,
                            fontWeight: "bold",
                          }}
                        >
                          {" "}
                          DC number:{" "}
                          <input
                            type="text"
                            style={{ border: 0, width: 100 }}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  <div></div>
                  <TableRow border={4}>
                    <TableCell style={{ padding: 0, textAlign: "center" }}>
                      S No
                    </TableCell>
                    <TableCell style={{ padding: 0, textAlign: "center" }}>
                      Desc
                    </TableCell>
                    <TableCell style={{ padding: 0, textAlign: "center" }}>
                      HSN Code
                    </TableCell>
                    <TableCell style={{ padding: 0, textAlign: "center" }}>
                      Qty.
                    </TableCell>
                    <TableCell style={{ padding: 0, textAlign: "center" }}>
                      Rate
                    </TableCell>
                    <TableCell style={{ padding: 0, textAlign: "center" }}>
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {this.state.itemList.map((item, index) => {
                    return (
                      <InvoiceArea
                        clicked={() => this.deleteItem(index)}
                        changed={(event) => {
                          this.changeRate(event, index);
                        }}
                        name={item.name}
                        HSNCode={item.HSNCode}
                        value={item.value}
                        itemTotal={item.itemTotal}
                        rate={item.rate}
                        ind={item.ind}
                      />
                    );
                  })}
                  <div></div>
                  <TableRow>
                    <TableCell style={{ padding: 0 }} rowSpan={4} />
                    <TableCell
                      style={{ padding: 0, border: "1px solid black" }}
                      colSpan={4}
                    >
                      Sub total
                    </TableCell>
                    <TableCell
                      style={{
                        padding: 0,
                        border: "1px solid black",
                        textAlign: "center",
                      }}
                    >
                      {this.state.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ padding: 0, textAlign: "center" }}>
                      Tax
                    </TableCell>
                    <TableCell style={{ padding: 0, textAlign: "center" }}>
                      9%
                    </TableCell>
                    <TableCell style={{ padding: 0 }}></TableCell>
                    <TableCell style={{ padding: 0 }}></TableCell>
                    <TableCell style={{ padding: 0, textAlign: "center" }}>
                      {this.state.CGST.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ padding: 0, textAlign: "center" }}>
                      Tax
                    </TableCell>
                    <TableCell style={{ padding: 0, textAlign: "center" }}>
                      9%
                    </TableCell>
                    <TableCell style={{ padding: 0 }}></TableCell>
                    <TableCell style={{ padding: 0 }}></TableCell>
                    <TableCell style={{ padding: 0, textAlign: "center" }}>
                      {this.state.SGST.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ padding: 0, textAlign: "center" }}>
                      Total
                    </TableCell>
                    <TableCell
                      style={{ padding: 0, textAlign: "center" }}
                    ></TableCell>
                    <TableCell style={{ padding: 0 }}></TableCell>

                    <TableCell
                      style={{ padding: 0, textAlign: "center" }}
                    ></TableCell>
                    <TableCell style={{ padding: 0, textAlign: "center" }}>
                      {this.state.grandTotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ padding: 0, textAlign: "center" }}
                    ></TableCell>
                    <TableCell style={{ padding: 0, textAlign: "center" }}>
                      Rounded Off
                    </TableCell>
                    <TableCell
                      style={{ padding: 0, textAlign: "center" }}
                    ></TableCell>
                    <TableCell style={{ padding: 0 }}></TableCell>

                    <TableCell
                      style={{ padding: 0, textAlign: "center" }}
                    ></TableCell>
                    <TableCell style={{ padding: 0, textAlign: "center" }}>
                      {Math.round(this.state.grandTotal).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div
                style={{
                  textAlign: "left",
                  padding: 3,
                  margin: 0,
                  boxSizing: "border-box",
                  border: "1px solid black",
                }}
              >
                Total in words:
                <span style={{ marginLeft: 10 }}>
                  {" "}
                  {toWords(
                    Math.round(this.state.grandTotal)
                  ).toUpperCase()}{" "}
                  ONLY
                </span>
              </div>

              <Table border={1}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        padding: 0,
                        textAlign: "center",
                        border: "1px solid black",
                      }}
                    >
                      Taxable Value
                    </TableCell>
                    <TableCell
                      style={{ padding: 0, width: 90, textAlign: "center" }}
                    >
                      <div>Central Tax</div>
                      <br />
                      <div
                        style={{
                          float: "left",
                          width: 60,
                          textAlign: "center",
                        }}
                      >
                        Rate
                      </div>
                      <div style={{ textAlign: "center" }}>Amount</div>
                    </TableCell>
                    <TableCell
                      style={{ padding: 0, width: 90, textAlign: "center" }}
                    >
                      <div>State Tax</div>
                      <br />
                      <div style={{ float: "left", width: 60 }}>Rate</div>
                      <div style={{ textAlign: "center" }}>Amount</div>
                    </TableCell>
                    <TableCell
                      style={{
                        padding: 0,
                        width: 90,
                        height: 50,
                        textAlign: "center",
                        border: "1px solid black",
                      }}
                    >
                      Total Tax Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell
                      style={{
                        width: 500,
                        textAlign: "center",
                        border: "1px solid black",
                      }}
                    >
                      {this.state.total}
                    </TableCell>
                    <TableCell
                      style={{
                        width: 200,
                        padding: 0,
                        border: "1px solid black",
                      }}
                    >
                      <TableCell
                        style={{
                          height: 50,
                          width: 100,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        9%
                      </TableCell>
                      <TableCell
                        style={{
                          height: 50,
                          width: 100,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        {this.state.CGST.toFixed(2)}
                      </TableCell>
                    </TableCell>
                    <TableCell
                      style={{
                        width: 200,
                        padding: 0,
                        border: "1px solid black",
                      }}
                    >
                      <TableCell
                        style={{
                          height: 50,
                          width: 100,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        9%
                      </TableCell>
                      <TableCell
                        style={{
                          height: 50,
                          width: 100,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        {this.state.SGST.toFixed(2)}
                      </TableCell>
                    </TableCell>
                    <TableCell
                      style={{
                        width: 500,
                        padding: 0,
                        width: 90,
                        textAlign: "center",
                        border: "1px solid black",
                      }}
                    >
                      {Math.round(this.state.grandTotal)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div style={{ float: "left" }}>
                <p
                  style={{
                    textAlign: "left",
                    marginLeft: "40px",
                    fontWeight: "bold",
                  }}
                >
                  Bank Details
                </p>
                <ul style={{ listStyle: "none", textAlign: "left" }}>
                  <li>Account Number: 067811000407</li>
                  <li>Bank: Dena Bank</li>
                  <li>Branch : Aminjikarai</li>
                  <li>IFS Code : BKDN0620678</li>
                </ul>
              </div>
              <div
                style={{
                  float: "right",
                  border: "1px solid black",
                  margin: "10px",
                  padding: "0px 60px",
                }}
              >
                <p>For Vijay Plastics</p>
                <br />
                <p>Authorized Signatory</p>
              </div>
            </div>
            <div style={{ margin: 50 }}>
              {data.map((i, index) => {
                return (
                  <div style={{ float: "left", margin: 5 }}>
                    <Button
                      variant="contained"
                      outlined
                      color="primary"
                      onClick={() => {
                        this.addItem(i, index);
                      }}
                      id={i.id}
                    >
                      {i.id}
                    </Button>
                  </div>
                );
              })}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Invoice;
