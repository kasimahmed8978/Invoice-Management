
import { useNavigate, useParams } from 'react-router-dom';

import React, { useState, useEffect, useRef } from "react";
import {

  Box,
  Button,
  
} from "@mui/material";

import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import base_url from "../utils/API";

import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import sign_logo from "../assets/sign_logo.jpeg";
import dummy_logo from "../assets/dummy_logo.jpeg";
import digital_signature from "../assets/digital_signature.jpeg";




export default function Pdf() {

  const [CompanyDetails, setCompanyDetails] = useState([]);
  const [client, setclient] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const params = useParams()
  const invoiceRef = useRef();

  useEffect(() => {
    getclient();
    getCompanyDetails();
    
    if (params.formData) {
      const objectData = decodeURIComponent(params.formData);
      const obj = JSON.parse(decodeURIComponent(objectData));
      calculateInvoice(obj);
    }
  
    const downloadTimeout = setTimeout(() => {
      handleDownloadPDF();
    }, 1000);
  
    return () => clearTimeout(downloadTimeout);
  }, [params.formData]);
 
  const getCompanyDetails = async () => {
    try {
      axios.defaults.headers.common["ngrok-skip-browser-warning"] = "any value";

      const response = await axios.get(`${base_url}/api/company_details/`);
      setCompanyDetails(response.data);
      console.log(response.data, "company details")
      const format = response.data.map((item) => item.inv_num_format)
    } catch (err) {
      console.log(err);
      console.error("Error fetching data:", err);
    }
  };

  const getclient = async () => {
    try {
      const response = await axios.get(`${base_url}/api/customer/`);
      setclient(response.data);
      console.log("client", response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };



  const objectData = params.formData
  console.log(objectData)

  const obj = JSON.parse(decodeURIComponent(objectData))
  console.log(obj);

  const calculateInvoice = (obj) => {
    let taxable_value_array = [];
    let total_tax = 0;

    obj.invoice_item.forEach((item_data) => {
      taxable_value_array.push(parseInt(item_data.taxable_value, 10));
    });

    total_tax = taxable_value_array.reduce((a, b) => a + b, 0);

    let rate_percent = obj.tax_details.map((e) => parseFloat(e.rate))[0] || 0;

    let tax_rate_array = taxable_value_array.map((e) => (e * rate_percent) / 100);
    console.log(tax_rate_array);
    
    let total_tax_rate_amount = tax_rate_array.reduce((a, b) => a + b, 0);
    var converter = require("number-to-words");
  let words = converter.toWords(obj.total_amount);

  let str = ''
  for (let i = 0; i < words.length; i++) {
    if (words[i] == ',' || words[i] == '-') {
      str += " "
    }
    else {
      str += words[i]
    }
  }

  
    setInvoice({
      ...obj, 
      total_tax_calculated: total_tax,
      total_tax_calculated_final: 0, 
      total_tax_calculated_tax1: total_tax_rate_amount,
      tax_name1: obj.tax_details[0]?.name || "", 
      tax_name2: obj.tax_details[1]?.name || "", 
      amountowords: str,
    });

    console.log("Calculated Invoice:", invoice);
  };

  const handlePrintPDF = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: "invoice",
    onAfterPrint: () => alert("Print successful"),
  });

  const handleDownloadPDF = () => {
    const input = invoiceRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg");
      const pdf = new jsPDF();
      
      pdf.addImage(imgData, "JPEG", 15, 10, 185, 250);
      
      const pdfBlob = pdf.output('blob');
  
      const formData = new FormData();

      console.log(obj,"584894894");
      
      const jsonData = JSON.stringify(obj);


      formData.append('pdf', pdfBlob, 'invoice.pdf');
      
      delete obj.customer_name;
      // delete obj.customer;
delete obj.address;
delete obj.phone;
console.log(obj,"obj new data");

      formData.append('obj', JSON.stringify(obj));
    
      axios.post(`${base_url}/api/invoice/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log('customer submitted successfully', response.data);
      })
      .catch(error => {
        console.error('Error submitting invoice', error);
        if (error.response) {
          console.log(typeof(pdf),"Type of pdf");
          console.log(typeof(formData),"type of formdata");
          console.log(typeof(obj),"Type of Obj");
          
          
        } else if (error.request) {
          console.log('Error request:', error.request);
        } else {
          console.log('Error message:', error.message);
        }
        console.log('Error config:', error.config);
      });
    });
   
  };


 

  console.log(invoice, "invoiceeeeeeeee");
  
  const styles = {
    invoice_table: {
      fontFamily: "Arial, sans-serif",
      
      margin: "20px auto",
      border: "6px double black",
      width: "80%",
      // display: "grid",
      gridTemplateAreas: `
      "header header"
      "logo company-address"
      "tax-invoice tax-invoice"
      "buyer-details buyer-details"
      "items-table items-table"
      "total-words amount-summary"
      "bank-details amount-summary"
      "declaration signature"
      `,
      gridGap: "10px",
      padding: "4px",
      marginBottom: 20,
    },
    head: {
      gridArea: "header",
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: "#123270",
      color: "aliceblue",
      padding: "10px",
    },
    headH1: {
      fontFamily: "'Times New Roman', Times, serif",
      margin: 0,
      fontSize: "23px",
      fontWeight: "bold",
    },
    invoiceLogo: {
      gridArea: "logo",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      position: "absolute",
    },
    invoiceLogoImg: {
      maxWidth: "100px",
    },
    invoiceAddress: {
      gridArea: "company-address",
      // display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-end",
      // textAlign: "right",
      bottom: "12px",
      right: "1px",
      position: "absolute",
    },
    invoiceHeader: {
      gridArea: "tax-invoice",
      border: "1px solid black",
      margin: 0,
      fontWeight: "bolder",
      padding: "10px",
    },
    invoiceHeaderH2: {
      fontSize: "21px",
      margin: "5px 0",
      fontWeight: "bolder",
      textDecoration: "underline",
      textAlign: "center",
    },
    invoiceDetails: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
      lineHeight: "33px",
    },
    invoiceBuyer: {
      gridArea: "buyer-details",
      border: "1px solid black",
      margin: 0,
      fontWeight: "bolder",
      padding: "10px",
      lineHeight: "33px",
    },
    buyerdetails: {
      display: "flex",
      // justifyContent: "space-between",
    },
    invoiceTable: {
      gridArea: "items-table",
      width: "100%",
      // borderCollapse: "collapse",
      marginTop: "20px",
    },
    invoiceTableTh: {
      border: "1px solid black",
      padding: "8px",
      textAlign: "center",
    },
    invoiceTableTd: {
      border: "1px solid black",
      padding: "8px",
      textAlign: "left",
    },
    totalWords: {
      // gridArea: "total-words",
      fontWeight: "bold",
      display: "inline-block",
      width: "57%",
      position: "absolute",
      top: "8px",
      left: "0px",
      padding: "10px",
      // width: "100%",
    },
    amountSummary: {
      // gridArea: "amount-summary",
      display: "flex",
      justifyContent: "flex-end",
      position: "relative",
      marginTop: "6px",
      fontWeight: "bold",
    },
    bankDetails: {
      // gridArea: "bank-details",
      fontWeight: "bold",
      position: "absolute",
      bottom: "10px",
      left: "0px",
      border: "1px solid black",
      padding: "10px",
      width: "50%",
    },
    declaration: {
      gridArea: "declaration",
      padding: "10px",
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      width: "inherit",
    },
    declarationP: {
      margin: "10px 0",
    },
    signature: {
      gridArea: "signature",
      padding: "10px",
      marginLeft: "45px",
    },
    sealImg: {
      maxWidth: "100px",
      margin: "auto",
    },
    signatureImg: {
      maxWidth: "200px",
      height: "70px",
      marginLeft: "50px",
    },
  };

  return (
    <>
      {obj && (

        <Box
          sx={{
            flexDirection: "column",
            position: "absolute",
            top: "50%",
            bottom: "10%",
            left: "60%",
            transform: "translate(-50%, -50%)",
            // width: isSmallScreen ? "90%" : "100%",
            // height: isSmallScreen ? "90%" : "100%",
            width: "80%",
            height: "100%",
            bgcolor: "background.paper",
            border: "3px solid #455a64",
            boxShadow: 24,
            // p: 4,
            borderRadius: 4,
            overflow: "scroll",
          }}
        >
          <div
            className="invoice"
            ref={invoiceRef}
            style={styles.invoice_table}
          >{CompanyDetails.map((row, company_id) => (
            <div className="head" style={styles.head}>
              <h1 style={styles.headH1}>{row.company_name}</h1>
            </div>
          ))}

            <div style={{ height: '100px', position: 'relative' }}>
              <div className="invoice-logo" style={styles.invoiceLogo}>
                <img
                  style={{ maxWidth: "175px" }}
                  src={dummy_logo}
                  alt="Invoice logo"
                />
              </div>
              <div className="invoice-address" style={styles.invoiceAddress}>
                <p style={{ textAlign: "end" }}>
                  {/* 4th Floor, New Janpath Complex
                  <br />
                  9 Ashok Marg, Hazratganj, LUCKNOW
                  <br /> */}

                  <div
                    style={{
                      textAlign: "end",
                      display: "inline-block",
                      width: "100%",
                    }}
                  >
                    {CompanyDetails.map((row, company_id) => (
                      <div style={{ textAlign: "end" }}>
                        {row.house_no}, {row.area}, {row.landmark},<br /> {row.city}, {row.state}, {row.country}, <br /> {row.pincode}
                      </div>
                    ))}
                  </div>
                </p>
              </div>
            </div>
            <div className="invoice-header" style={styles.invoiceHeader}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  // gap: "140px",
                }}
              >
                <h2 style={styles.invoiceHeaderH2}>Credit Note</h2>
                {CompanyDetails.map((row, company_id) => (
                  <div
                    style={{ display: "flex", margin: "5px", gap: "5px" }}
                  >
                    <div
                      style={{
                        fontWeight: "bolder",
                        textDecoration: "underline",
                      }}
                    >
                      GSTIN/UIN:{" "}
                    </div>
                    <div>{row.gst_in}</div>
                  </div>
                ))}
              </div>
              <div
                className="invoice-details"
                style={styles.invoiceDetails}
              >
                <div style={{ width: "60%" }}>
                  <div>Credit Note No.:</div>
                  <div>Original Invoice No.: {obj.invoice_number}</div>
                  <div>Original Invoice Date: {obj.generated_date}</div>
                  <div>Due Date: {obj.generated_date}</div>
                  {CompanyDetails.map((row, company_id) => (
                    <div>State: {row.state}</div>
                  ))}
                  {/* <div>State: {obj.state}</div> */}
                </div>
                <div style={{ width: "40%" }}>
                  <div>Credit Note Date: {obj.client_pincode}</div>
                  <div>Ref. No. & Date: {obj.client_pincode}</div>
                  <div>Buyer Order No. & Date: {obj.client_pincode}</div>
                  <div>Delivery Note: {obj.client_pincode}</div>
                  <div>Destination: {obj.client_pincode}</div>
                </div>
              </div>
            </div>

            <div className="invoice-buyer" style={styles.invoiceBuyer}>
              <div
                style={{ display: "flex", justifyContent: "space-evenly" }}
              >
                <h2 style={styles.invoiceHeaderH2}>
                  Buyer (Bill to Party)
                </h2>
                {CompanyDetails.map((row, company_id) => (
                  <div
                    style={{ display: "flex", margin: "5px", gap: "3px" }}
                  >
                    {" "}
                    <div
                      style={{
                        fontWeight: "bolder",
                        textDecoration: "underline",
                      }}
                    >
                      GSTIN/UIN:
                    </div>
                    <div>{row.gst_in}</div>
                  </div>
                ))}
              </div>

              <div className="buyer-details" style={styles.buyerdetails}>
                <div style={{ width: "60%" }}>
                  <div>Name: {obj.customer_name}</div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>Address: {obj.address}</div>
                  </div>
                </div>
              </div>
            </div>


            <div style={{ overflowX: "auto" }}>
              <table className="invoice-table" style={{ width: "100%", minWidth: "600px", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead style={styles.invoiceTableTh}>
                  <tr>
                    <th style={styles.invoiceTableTh} rowSpan="2">SN</th>
                    <th style={styles.invoiceTableTh} rowSpan="2">Product Description</th>
                    <th style={styles.invoiceTableTh} rowSpan="2">Qty</th>
                    <th style={styles.invoiceTableTh} rowSpan="2">Rate Rs</th>
                    <th style={styles.invoiceTableTh} rowSpan="2">Taxable Value</th>
                    {obj.tax_details.map((item, index) => {
                      return (<th style={styles.invoiceTableTh} colSpan="2" key={index}>{item.tax_name}</th>)
                    })}
                    <th style={styles.invoiceTableTh} rowSpan="2">Total</th>
                  </tr>
                  <tr>
                    {obj.tax_details.length % 2 === 0 ? (
                      <>
                        <th style={{ border: '1px solid black', height: "35px" }}>%</th>
                        <th style={{ height: "35px" }}>Amount</th>
                        <th style={{ border: '1px solid black', height: "35px" }}>%</th>
                        <th style={{ height: "35px" }}>Amount</th>
                      </>
                    ) : (
                      <>
                        <th style={{ border: '1px solid black', height: "35px" }}>%</th>
                        <th style={{ height: "35px" }}>Amount</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody style={styles.invoiceTableTd}>
                  {obj.invoice_item.map((item, index) => (
                    <tr key={index}>
                      <td style={styles.invoiceTableTd}>{index + 1}</td>
                      <td style={styles.invoiceTableTd}>{item.product_name}</td>
                      <td style={styles.invoiceTableTd}>{item.quantity}</td>
                      <td style={styles.invoiceTableTd}>{item.unit_price}</td>
                      <td style={styles.invoiceTableTd}>{item.taxable_value}</td>

                      {obj.tax_details.length % 2 === 0 ? (
                        <>
                          <td style={styles.invoiceTableTd}>{obj.tax_details[0].rate}</td>
                          <td style={styles.invoiceTableTd}>{(9 * (item.taxable_value)) / 100}</td>
                          <td style={styles.invoiceTableTd}>{obj.tax_details[0].rate}</td>
                          <td style={styles.invoiceTableTd}>{(9 * (item.taxable_value)) / 100}</td>
                        </>
                      ) : (
                        <>
                          <td style={styles.invoiceTableTd}>{obj.tax_details[0].rate}</td>
                          <td style={styles.invoiceTableTd}>{(18 * (item.taxable_value)) / 100}</td>
                        </>
                      )}
                      <td style={styles.invoiceTableTd}>{item.calculated_amount}</td>
                    </tr>
                  ))}
                  <tr>
                    {obj.tax_details.length % 2 === 0 ? (
                      <>
                        <td
                          colSpan="2"
                          style={{ textAlign: "center", fontWeight: "bold" }}
                        >
                          Total
                        </td><td colSpan="1" style={styles.invoiceTableTd}>
                          {obj.invoice_item.total_amount}
                        </td><td colSpan="1" style={styles.invoiceTableTd}>
                          {obj.invoice_item.tax_amount}
                        </td><td style={styles.invoiceTableTd}>
                          Rs {invoice.total_tax_calculated}
                        </td><td style={styles.invoiceTableTd}>

                        </td>
                        <td style={styles.invoiceTableTd}>
                          Rs {invoice.total_tax_calculated_tax1

                          }
                        </td>
                        <td style={styles.invoiceTableTd}>

                        </td>
                        <td style={styles.invoiceTableTd}>
                          Rs {invoice.total_tax_calculated_tax1}
                        </td>


                        <td style={styles.invoiceTableTd}>
                          Rs {obj.total_amount}
                        </td>
                      </>
                    ) : (
                      <>
                        <td
                          colSpan="2"
                          style={{ textAlign: "center", fontWeight: "bold" }}
                        >
                          Total
                        </td>
                        <td colSpan="1" style={styles.invoiceTableTd}>
                          {obj.invoice_item.total_amount}
                        </td>
                        <td colSpan="1" style={styles.invoiceTableTd}>
                          {obj.invoice_item.tax_amount}
                        </td>
                        <td style={styles.invoiceTableTd}>
                          Rs {invoice.total_tax_calculated}
                        </td>
                        <td style={styles.invoiceTableTd}>

                        </td>
                        <td style={styles.invoiceTableTd}>
                          Rs {invoice.total_tax_calculated_tax1}
                        </td>


                        <td style={styles.invoiceTableTd}>
                          Rs {obj.total_amount}
                        </td>
                      </>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>


            <div className="amount-summary" style={styles.amountSummary}>
              <div className="total-words" style={styles.totalWords}>
                <p>Total Rounded off Invoice Amount in Words (Rupees)</p>
                <p style={{ textTransform: "capitalize" }}>
                  {invoice.amountowords} Only
                </p>
              </div>
              <table
                className="invoice-table-amount"
                style={{ position: "relative", width: "40%" }}
              >
                <tbody style={{ border: "1px solid black", padding:"5px" }}>
                  <tr>

                    <td
                      style={{ border: "1px solid black", height: "35px" }}
                    >
                      Total Amount Before Tax:{" "}
                      {
                        // console.log(invoice,"null values")
                        
                        (invoice.total_tax_calculated)
                        }
                    </td>
                  </tr>
                  <tr>

                    {obj.tax_details.length % 2 === 0 ? (
                      <><td
                        style={{ border: "1px solid black", height: "45px", paddingBottom:"5px" }}
                      >
                        CGST: {invoice.total_tax_calculated_tax1} <br />
                        SGST: {invoice.total_tax_calculated_tax1}
                      </td>
                      </>) : (
                      <td
                        style={{ border: "1px solid black", height: "35px" }}
                      >
                        IGST: {invoice.total_tax_calculated_tax1}
                      </td>
                    )}


                  </tr>
                  <tr>
                    {obj.tax_details.length % 2 === 0 ? (
                      <td
                        style={{ border: "1px solid black", height: "35px" }}
                      >
                        Total Tax:{" "}
                        {
                          (invoice.total_tax_calculated_tax1 + invoice.total_tax_calculated_tax1)}
                      </td>) : (
                      <td
                        style={{ border: "1px solid black", height: "35px" }}
                      >
                        Total Tax:{" "}
                        {
                          (invoice.total_tax_calculated_tax1)}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td
                      style={{ border: "1px solid black", height: "35px" }}
                    >
                      Total Amount with Tax:{" "}
                      {obj.total_amount}
                    </td>
                  </tr>
                  <tr>

                    {obj.tax_details.length % 2 === 0 ? (
                      <td
                        style={{ border: "1px solid black", height: "35px" }}
                      >
                        Net Amount Payable in Tax:{" "}
                        {
                          (invoice.total_tax_calculated_tax1 + invoice.total_tax_calculated_tax1)}
                      </td>) : (
                      <td
                        style={{ border: "1px solid black", height: "35px" }}
                      >
                        Net Amount Payable in Tax:{" "}
                        {
                          (invoice.total_tax_calculated_tax1)}
                      </td>
                    )}


                  </tr>
                  <tr>
                    <td
                      style={{ border: "1px solid black", height: "35px" }}
                    >
                      Advance Amount Paid Rs.: {obj.advanceAmountPaid}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ border: "1px solid black", height: "35px" }}
                    >
                      Balance Amount Payable Rs.:{" "}
                      {obj.balanceAmountPayable}
                    </td>
                  </tr>
                </tbody>
              </table>


              {CompanyDetails.map((row, company_id) => {
                return row.show_bank_data === true ? (
                  <div className="bank-details" style={styles.bankDetails} key={company_id}>
                    <h5 style={{ textAlign: "center", fontWeight: "bold" }}>
                      <u>Bank Details</u>
                    </h5>
                    <div>
                      <u>Name:</u> {row.company_name}
                    </div>
                    <div>
                      <u>A/c No.:</u> {row.account_number}
                    </div>
                    <div>
                      <u>Bank & IFSC:</u> {row.bank_name} - {row.ifsc_code}
                    </div>
                    <div>
                      <u>Branch:</u> {row.branch_name}
                    </div>
                  </div>
                ) : (
                  <div
                    className="bank-details"
                    style={{
                      fontWeight: "bold",
                      position: "absolute",
                      bottom: "21px",
                      left: "0px",
                      padding: "10px",
                      border: "2px solid black",
                      width: "55%",
                      marginLeft: "10px"
                    }}
                    key={company_id}
                  >
                    <div>
                      <h5 style={{ fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>
                        Remarks
                      </h5>
                    </div>
                    <br />
                    <div style={{ textAlign: "center" }}>
                      <p>SALES RETURN AGAINST INVOICE NO - {obj.invoice_number}</p>
                    </div>
                  </div>
                );
              })}

            </div>


            <div style={{ display: 'flex' }}>
              <div className="declaration" style={{ width: '500px', marginLeft: "20px", marginTop: "40px" }}>
                <h5 style={{ textAlign: "center" }}>
                  <b>
                    <u>Declaration</u>
                  </b>
                </h5>
                <br />
                <p style={{ textAlign: "center" }}>
                  We declare that this invoice shows the actual price of the
                  goods described and that all particulars are true and
                  correct.
                </p>
              </div>
              {CompanyDetails.map((row, company_id) => (
                <div className="signature" style={styles.signature}>
                  <h5 style={{ textAlign: "center", height: "35px" }}>
                    <b>FOR</b>
                  </h5>
                  <img
                    style={styles.sealImg}
                    src={sign_logo}
                    alt="Signature"
                  />
                  <img
                    style={styles.signatureImg}
                    src={digital_signature}
                    alt="Seal"
                  />
                </div>
              ))}
            </div>
          </div>
          <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    color: "white",
                    backgroundColor: "#123270",
                    "&:hover": { color: "black", backgroundColor: "#53B789" },
                  }}
                 
                  onClick={handlePrintPDF}
                >
                  Print
                </Button>
              </Box>
        </Box>
      )}
    </>
  )
}