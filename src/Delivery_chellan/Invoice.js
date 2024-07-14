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
                marginTop: 50,
              }}
              id="print"
            >
              
              <div
                style={{
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  paddingTop: "5px",
                  paddingBottom: "10px",
                  borderBottom: "1px solid black",
                }}
              >
                <p style={{ fontSize: 20 }}>Delivery Chellan</p>
                <span
                  style={{ fontWeight: "bold", fontSize: 40, color: "red" }}
                >
                  Vijay Plastics
                </span>
                <p>48/12 Ramasamy Raja street, Arumbakkam, Chennai - 600106</p>

                <div
                  style={{
                    width: "100%",
                    fontSize: 15,
                    display: "flex",
                    alignItems: "space-between",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    paddingLeft: "5px",
                    paddingRight: "5px",
                  }}
                >
                  <p style={{ marginLeft: "4px", paddingLeft:'6px' }}>
                    DC No: <input type="number" />
                  </p>
                  <p style={{ marginRight: "2px", paddingRight:'6px' }}>
                    Date: <input type="date" />
                  </p>
                </div>
                <div
                  style={{
                    width: "100%",
                    fontSize: 15,
                    display: "flex",
                    alignItems: "space-between",
                    justifyContent: "space-around",
                    flexDirection: "row",
                    paddingLeft: "5px",
                    paddingRight: "5px",
                  }}
                >
                  <p style={{ marginLeft: "2px" }}>GSTIN: 33BGPPR3963M1ZM</p>
                  <p style={{ marginLeft: "2px" }}>Phone number: 9841252944</p>
                  <p style={{ marginLeft: "2px" }}>
                    Email:vijayplastics2010@gmail.com
                  </p>
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <p style={{ fontWeight: "bold", width: "10%" }}>To :</p>
                <p>
                  Phoenix Medical Systems Pvt Ltd No. S-55, SIPCOT industrial
                  Estate Vengadu village Sriperumbadur Chennai - 602105 GSTIN:
                  33AAACP1905E1Z2
                </p>
              </div>
              <Table border={1}>
                <TableHead>
                  <TableRow border={4}>
                    <TableCell style={{ padding: 0, textAlign: "center" }}>
                      S No
                    </TableCell>
                    <TableCell style={{ padding: 0, textAlign: "center" }}>
                      Desc
                    </TableCell>
                    <TableCell style={{ padding: 0, textAlign: "center" }}>
                      Qty.
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
                </TableBody>
              </Table>
              <div style={{ width: "100%", borderBottom: "1px solid black" }}>
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
