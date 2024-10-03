import React, { useState, useEffect, useRef } from "react";

import {
  Input,
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  IconButton,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Modal,
  TextField,
  useMediaQuery,
  TablePagination,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import NavBar from "../NavBar";
import "jspdf-autotable";
import axios from "axios";
import base_url from "../utils/API";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { useNavigate } from 'react-router-dom';
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";



function Invoice({ pr_q }) {
  const initialFormData = {
    invoice_number: "",
    generated_date: "",
    due_date: "",
    customer: "",
    customer_name: "",
    address: "",
    phone: "",
    total_amount: 0,
    status: "",
    tax_amount: 0,
    tax_details: [
      {
        tax_id: 1,
        tax_name: "CGST",
        rate: "09.00",
      },
      {
        tax_id: 2,
        tax_name: "SGST",
        rate: "09.00",
      },
    ],
    invoice_item: [
      {
        product_name: "",
        unit_price: 0,
        quantity: 0,
        taxable_value: 0,
        tax_amount: 0,
        calculated_amount: 0,
      },
    ],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [tableData, setTableData] = useState([]);
  const [client, setclient] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [CompanyDetails, setCompanyDetails] = useState(null);
  const invoiceRef = useRef();
  const [tax2, setTax2] = useState(true);
  const [invoicenum, setInvoicenum] = useState("");


  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(10); 



  useEffect(() => {
    getData();
    getclient();
    getCompanyDetails();
    getTaxes();
    getProducts();
  }, []);
  const getTaxes = async () => {
    try {
      const response = await axios.get(`${base_url}/api/tax/`);
      setTaxes(response.data);
      console.log("tax 54545545455", response.data);
      const defaultTax = response.data.filter(
        (tax) => tax.tax_id === 1 || tax.tax_id === 2
      );
      setFormData((formData) => ({
        ...formData,
        tax_details: defaultTax,
      }));
    } catch (err) {
      console.log("Error fetching taxes", err);
    }
  };

  const getProducts = async () => {
    try {
      const response = await axios.get(`${base_url}/api/product/`);
      setProducts(response.data);
    } catch (err) {
      console.log("Error fetching products", err);
    }
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };
  const filteredData = tableData.filter((e) => {
    return search.toLowerCase() === ""
      ? e
      : e.customer_details?.customer_name.toLowerCase().includes(search);
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  
  const addItem = () => {
    const updatedItems = [
      ...formData.invoice_item,
      {
        product_name: "",
        price: 0,
        quantity: 0,
        taxable_value: 0,
        total_amount: 0,
      },
    ];
    
    setFormData((formData) => ({
      ...formData,
      invoice_item: updatedItems,
    }));
  };

  const deleteItem = (index) => {
    const updatedItems = [...formData.invoice_item];
    updatedItems.splice(index, 1);
    setFormData((formData) => ({ ...formData, invoice_item: updatedItems }));
    GrandTotal(updatedItems);
  };
  const handleItem = (index, name, value) => {
    const updatedItems = [...formData.invoice_item];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    setFormData((formData) => ({ ...formData, invoice_item: updatedItems }));
    CalculatedAmount(index, updatedItems);
  };
  
  const getData = async () => {
    try {
      axios.defaults.headers.common["ngrok-skip-browser-warning"] = "any value";
      const response = await axios.get(`${base_url}/api/invoice/`);
      setTableData(response.data);
      console.log("invoice****", response.data);
    } catch (err) {
      console.log(err);
      console.error("Error fetching data:", err);
    }
  };

  const getCompanyDetails = async () => {
    try {
      const response = await axios.get(`${base_url}/api/company_details/`);
      setCompanyDetails(response.data);
      console.log(response.data, "zaiddddddddddddd")
      const format = response.data.map((item) => item.inv_num_format)
      setInvoicenum(format)
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

  const handleClient = (event) => {
    const selectedClient = client.find(
      (e) => e.customer_id === event.target.value
    );
    if (selectedClient) {
      setFormData((formData) => ({
        ...formData,
        customer: selectedClient.customer_id,
        customer_name: selectedClient.customer_name,
        // address: selectedClient.area,
        address: `${selectedClient.house_no}, ${selectedClient.area}, ${selectedClient.landmark}, ${selectedClient.pincode}, ${selectedClient.state}, ${selectedClient.country}`,
        phone: selectedClient.phone,
      }));
    }
  };

  const handleProduct = (index, event) => {
    const selectedProduct = products.find(
      (e) => e.product_name === event.target.value
    );
    if (selectedProduct) {
      const updatedItems = [...formData.invoice_item];
      updatedItems[index] = {
        ...updatedItems[index],
        product_id: selectedProduct.product_id,
        product_name: selectedProduct.product_name,
        unit_price: selectedProduct.price,
        stock: selectedProduct.stock_quantity
      };
      setFormData((formData) => ({ ...formData, invoice_item: updatedItems }));
      CalculatedAmount(index, updatedItems);
    }
  };

  const handleTax = (index, tax_id) => {
    setFormData((formData) => {
      let updatedTaxes;
      if (tax_id === 3) {
        const selectedTax = taxes.find((tax) => tax.tax_id === tax_id);
        updatedTaxes = [selectedTax];
      } else if (
        tax_id === 1 &&
        formData.tax_details.length === 1 &&
        formData.tax_details[0].tax_id === 3
      ) {
        const tax1 = taxes.find((tax) => tax.tax_id === 1);
        const tax2 = taxes.find((tax) => tax.tax_id === 2);
        updatedTaxes = [tax1, tax2];
      } else {
        const selectedTax = taxes.find((tax) => tax.tax_id === tax_id);
        updatedTaxes = [...formData.tax_details];
        updatedTaxes[index] = selectedTax;
      }
      const updatedItems = formData.invoice_item.map((item, i) =>
        CalculatedAmount(i, formData.invoice_item)
      );
      if (index === 0 && tax_id === 3) {
        setTax2(false);
      } else {
        setTax2(true);
      }
      return {
        ...formData,
        tax_details: updatedTaxes,
        invoice_item: updatedItems,
      };
    });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setEditMode(false);
    setFormData(initialFormData);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setFormData(initialFormData);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
    if (name === "invoice_number") {
      const pattern = /^[A-Z]{2}\/\d{4}\/\d{2}-\d{2}$/;
      const trimmedValue = value.trim();

      if (trimmedValue && !pattern.test(trimmedValue)) {
        setError("ENTER IN THIS FORMAT: XX/0000/00-00");
      } else {
        setError("");
      }
    }
  };
  const CalculatedAmount = (index, updatedItems) => {
    const item = updatedItems[index];
    const unitPrice = parseFloat(item.unit_price) || 0;
    const quantity = parseFloat(item.quantity) || 0;
    const subtotal = unitPrice * quantity;

    const totalTaxAmount = formData.tax_details.reduce((totalTax, tax) => {
      const taxAmount = (subtotal * parseFloat(tax.rate)) / 100;
      return totalTax + taxAmount;
    }, 0);

    const totalAmount = subtotal + totalTaxAmount;

    updatedItems[index] = {
      ...updatedItems[index],
      taxable_value: subtotal.toFixed(2),
      tax_amount: totalTaxAmount.toFixed(2),
      calculated_amount: totalAmount.toFixed(2),
    };

    setFormData((formData) => {
      const newTotalAmount = updatedItems.reduce(
        (sum, currentItem) => sum + parseFloat(currentItem.calculated_amount),
        0
      );
      const TaxAmount = updatedItems.reduce(
        (sum, currentItem) => sum + parseFloat(currentItem.tax_amount),
        0
      );

      return {
        ...formData,
        invoice_item: updatedItems,
        total_amount: newTotalAmount.toFixed(2),
        tax_amount: TaxAmount.toFixed(2),
      };
    });

    return updatedItems[index];
  };
  const GrandTotal = (items) => {
    const totalAmount = items.reduce(
      (sum, item) => sum + parseFloat(item.calculated_amount || 0),
      0
    );
    setFormData((formData) => ({
      ...formData,
      total_amount: totalAmount.toFixed(2),
    }));
  };
  const navigate = useNavigate();

  const sendData = () => {
    let errors = {};

    if (!formData.invoice_number) {
      errors.invoice_number = true;
    }
    if (!formData.customer) {
      errors.customer = true;
    }
    if (!formData.generated_date) {
      errors.generated_date = true;
    }
    if (!formData.due_date) {
      errors.due_date = true;
    }
    if (!formData.invoice_item || formData.invoice_item.length === 0) {
      errors.invoice_item = true;
    } else {
      formData.invoice_item.forEach((item, index) => {
        if (!item.quantity) {
          errors[`quantity_${index}`] = true;
        }
      });
    }
    if (!formData.status) {
      errors.status = true;
    }

    if (Object.keys(errors).length > 0) {
      setError(errors);
      alert("Please fill all the Required fields");
      return;
    }
    console.log('button clicked')
    navigate(`/Pdf/${encodeURIComponent(JSON.stringify(formData))}`)
    console.log(typeof (formData), "form data");


//     console.log("formSubmitted", formData);
//     if (editMode) {
//       await updateDataToServer();
//       const updatedData = [...tableData];
//       updatedData[editIndex] = formData;
//       setTableData(updatedData);
//     } else {
//       postDataToServer();
//       setTableData([...tableData, { ...formData, id: tableData.length + 1 }]);
//     }

//     setFormData(initialFormData);
//     handleCloseModal();
//   invoiceStock();
  };
//   function invoiceStock() {
//     const pr_q = {};
//     formData.invoice_item.forEach(
//       (item) => (pr_q[item.product_name] = item.quantity)
//     );

//     console.log(pr_q, "656567557");
//   }

//   <Product pr_q={pr_q} />


  

//   const handleEdit = (index) => {
//     getData();
//     setFormData(tableData[index]);
//     setEditMode(true);
//     setEditIndex(index);
//     setIsModalOpen(true);
//   };

//   const handleEditInvoice = () => {
//     if (invoiceData) {
//       setFormData(invoiceData);
//       setEditMode(true);
//       setEditIndex(tableData.findIndex((item) => item.id === invoiceData.id));
//       setIsModalOpen(true);
//       setIsInvoiceModalOpen(false);
//     }
//   };

//   const handleDelete = (invoice_id) => {
//     deleteDataFromServer(invoice_id);
//   };

//   const handleInvoiceClick = (id) => {
//     const invoice = tableData.find((item) => item.id === id);
//     setInvoiceData(invoice);
//     setIsInvoiceModalOpen(true);
//   };

//   const ViewPdf = (invoice_data_of_row) => {
//     console.log("33333333333", invoice_data_of_row);
//     let taxable_value_array = [];
//     let total_tax = 0;
//     let tax_final = 0;
//     let t1 = 0;
//     let t2 = 0;
//     let tname1;
//     let tname2;

//     const txi_2 = invoice_data_of_row.invoice_item_id.map(
//       (item_data, index) => {
//         taxable_value_array.push(parseInt(item_data.taxable_value));
//       }
//     );

//     total_tax = taxable_value_array.reduce((a, b) => {
//       return a + b;
//     });

//     invoice_data_of_row.tax_details.map((e) => {});

//     let rate_percent = null;
//     invoice_data_of_row.tax_details.map((e) => {
//       rate_percent = parseFloat(e.rate);
//     });

//     console.log(typeof rate_percent);

//   }


  const handleViewInvoice = async (invoice_id) => {
    try {

      console.log(`Fetching PDF for invoice ID: ${invoice_id}`);
      const response = await axios.get(`${base_url}/${invoice_id}/`, {
        responseType: 'blob',
      });


      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');

      setTimeout(() => {
        URL.revokeObjectURL(fileURL);
      }, 1000 * 60);

    } catch (error) {
      console.error('Error fetching PDF:', error);
      alert(`Failed to fetch PDF for invoice ID: ${invoice_id}. Please try again later.`);
    }
  };

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  return (
    <Box
      sx={{
        display: "flex",
        p: 10,
        flexDirection: isSmallScreen ? "column" : "row",
      }}
    >
      <NavBar />

      <Box
        component="main"
        sx={{ flexGrow: 1, width: isSmallScreen ? "100%" : "auto" }}
        aria-label="Payment Section"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {" "}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              type="search"
              placeholder="Enter the Customer Name"
              onChange={(e) => setSearch(e.target.value)}
              variant="outlined"
              sx={{
                flex: 1,
                mr: 2,
                "& .MuiOutlinedInput-root": {
                  height: "43px",
                  width: isSmallScreen ? "100%" : 1000,

                  borderRadius: 2,

                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              onClick={() => handleOpenModal()}
              size="medium"
              variant="contained"
              sx={{
                color: "white",
                backgroundColor: "#123270",
                borderRadius: 2,
                height: "40px",
                "&:hover": { color: "black", backgroundColor: "#53B789" },
              }}
            >
              ADD
            </Button>
          </Grid>
        </Box>

        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: 1050,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: { xs: 3, sm: 5 },
              borderRadius: 3,
              maxHeight: "90vh",
              overflowY: "auto",
              border: "1px solid #e0e0e0",
            }}
            component="form"
          >
            <Typography
              id="modal-title"
              variant="h5"
              sx={{ mb: 1, fontWeight: "bold", color: "#123270" }}
            >
              {editMode ? "Edit Invoice" : "Add Invoice"}
            </Typography>

            <FormControl sx={{ marginBottom: 3, width: "50%" }} required>
              <InputLabel
                sx={{
                  "& .MuiInputLabel-asterisk": {
                    color: "red",
                    fontSize: "20px",
                  },
                }}
                htmlFor="invoice-number"
              >
                Invoice Number
              </InputLabel>
              <Input
                name="invoice_number"
                value={formData.invoice_number}
                onChange={handleChange}
                inputProps={{ maxLength: 13 }}
                placeholder={invoicenum}
                sx={{
                  borderRadius: 2,
                  borderColor: "#e0e0e0",
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />

              {error.invoice_number && (
                <Typography sx={{ color: "#c30010", fontSize: 13 }}>
                  <ErrorOutlineOutlinedIcon sx={{ fontSize: "17px" }} /> This
                  Field is Required
                </Typography>
              )}
              <Typography
                sx={{ color: "#c30010", fontSize: 13, fontStyle: "italic" }}
              >

                Format:{invoicenum}
              </Typography>
            </FormControl>
            <br />
            <FormControl sx={{ marginBottom: 3, width: "50%" }}>
              <InputLabel
                id="client-name-label"
                required
                sx={{
                  "& .MuiInputLabel-asterisk": {
                    color: "red",
                    fontSize: "20px",
                  },
                }}
              >
                Customer Name
              </InputLabel>
              <Select
                value={formData.customer}
                onChange={handleClient}
                variant="standard"
                sx={{ borderRadius: 2 }}
              >
                {client.map((row) => (
                  <MenuItem key={row.customer_id} value={row.customer_id}>
                    {row.customer_name}
                  </MenuItem>
                ))}
              </Select>
              {error.customer && (
                <Typography sx={{ color: "#c30010", fontSize: 13 }}>
                  <ErrorOutlineOutlinedIcon sx={{ fontSize: "17px" }} /> This
                  Field is Required
                </Typography>
              )}
            </FormControl>

            <Typography variant="h6" sx={{ mb: 2, color: "#123270" }}>
              Customer Details
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel htmlFor="address">Address</InputLabel>
                  <Input
                    name="address"
                    value={formData.address}
                    sx={{
                      borderRadius: 2,
                      borderColor: "#e0e0e0",
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel htmlFor="phone">phone</InputLabel>
                  <Input
                    name="phone"
                    value={formData.phone}
                    sx={{
                      borderRadius: 2,
                      borderColor: "#e0e0e0",
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h8" sx={{ mb: -4, color: "#123270" }}>
                  Generated Date
                  <Typography
                    variant="h8"
                    sx={{ mb: -4, color: "#c30010", fontSize: "20px" }}
                  >
                    *
                  </Typography>
                </Typography>
                <FormControl fullWidth>
                  <Input
                    name="generated_date"
                    type="date"
                    value={formData.generated_date}
                    onChange={handleChange}
                    sx={{
                      borderRadius: 2,
                      borderColor: "#e0e0e0",
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    }}
                  />
                  {error.generated_date && (
                    <Typography sx={{ color: "#c30010", fontSize: 13 }}>
                      <ErrorOutlineOutlinedIcon sx={{ fontSize: "17px" }} />{" "}
                      This Field is Required
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h8" sx={{ mb: -4, color: "#123270" }}>
                  Due Date
                  <Typography
                    variant="h8"
                    sx={{ mb: -4, color: "#c30010", fontSize: "20px" }}
                  >
                    *
                  </Typography>
                </Typography>
                <FormControl fullWidth>
                  <Input
                    name="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={handleChange}
                    sx={{
                      borderRadius: 2,
                      borderColor: "#e0e0e0",
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    }}
                  />
                  {error.due_date && (
                    <Typography sx={{ color: "#c30010", fontSize: 13 }}>
                      <ErrorOutlineOutlinedIcon sx={{ fontSize: "17px" }} />{" "}
                      This Field is Required
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <InputLabel htmlFor="tax_details">Tax1</InputLabel>
                <Select
                  name="tax_details"
                  value={formData.tax_details[0]?.tax_id}
                  onChange={(event) => handleTax(0, event.target.value)}
                  variant="standard"
                  sx={{ borderRadius: 2 }}
                  fullWidth
                >
                  {taxes 
                    .filter((tax) => tax.tax_id === 1 || tax.tax_id == 3)
                    .map((row) => (
                      <MenuItem key={row.tax_id} value={row.tax_id}>
                        {row.tax_name} : {row.rate}%
                      </MenuItem>
                    ))}
                </Select>
              </Grid>
              {tax2 && (
                <Grid item xs={12} sm={6}>
                  <InputLabel htmlFor="tax_details">Tax2</InputLabel>
                  <Select
                    name="tax_details"
                    value={formData.tax_details[1]?.tax_id || ""}
                    onChange={(event) => handleTax(1, event.target.value)}
                    variant="standard"
                    sx={{ borderRadius: 2 }}
                    fullWidth
                  >
                    {taxes
                      .filter((tax) => tax.tax_id === 2)
                      .map((row) => (
                        <MenuItem key={row.tax_id} value={row.tax_id}>
                          {row.tax_name} : {row.rate}%
                        </MenuItem>
                      ))}
                  </Select>
                </Grid>
              )}
              {/* )} */}
            </Grid>

            <Typography variant="h6" sx={{ mb: 2, color: "#123270", mt: 4 }}>
              Invoice Item and Tax
            </Typography>
            {formData?.invoice_item &&
              Array.isArray(formData.invoice_item) &&
              formData.invoice_item.map((item, index) => (
                <Grid
                  container
                  spacing={2}
                  key={index}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Grid item xs={12} sm={12}></Grid>
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth>
                      <label>
                        Item
                        <Typography
                          variant="h8"
                          sx={{ mb: -3, color: "#c30010", fontSize: "20px" }}
                        >
                          *
                        </Typography>
                      </label>
                      {error[`quantity_${index}`] && (
                        <Typography sx={{ color: "#c30010", fontSize: 13 }}>
                          <ErrorOutlineOutlinedIcon sx={{ fontSize: "9px" }} />{" "}
                          This Field is Required
                        </Typography>
                      )}

                      <Select
                        id={`item-${index}`}
                        value={item.item}
                        onChange={(e) => handleProduct(index, e)}
                        variant="standard"
                        sx={{ borderRadius: 2 }}
                      >
                        {products.map((row) => (
                          <MenuItem
                            key={row.product_id}
                            value={row.product_name}
                          >
                            {row.product_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth>
                      <label>Unit Price</label>
                      <Input
                        id={`unit_price-${index}`}
                        name="unit_price"
                        value={item.unit_price}
                        onChange={(e) =>
                          handleItem(index, e.target.name, e.target.value)
                        }
                        readOnly
                        sx={{
                          width: 110,
                          borderRadius: 2,
                          borderColor: "#e0e0e0",
                          "& .MuiOutlinedInput-root": { borderRadius: 2 },
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <FormControl>


                      

                      <label>
                        Quantity
                        <Typography
                          variant="h8"
                          sx={{ mb: -3, color: "#c30010", fontSize: "20px" }}
                        >
                          *
                        </Typography>
                      </label>
                      {error[`quantity_${index}`] && (
                        <Typography sx={{ color: "#c30010", fontSize: 13 }}>
                          <ErrorOutlineOutlinedIcon sx={{ fontSize: "9px" }} />{" "}
                          This Field is Required
                        </Typography>
                      )}

                      <Input
                        id={`quantity-${index}`}
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItem(index, e.target.name, e.target.value)
                        }
                        sx={{
                          borderRadius: 2,
                          borderColor: "#e0e0e0",
                          "& .MuiOutlinedInput-root": { borderRadius: 2 },
                        }}
                      />
                      <Typography
                sx={{ color: "#c30010", fontSize: 13, fontStyle: "italic" }}
              >

                Available Stock:{item.stock}
              </Typography>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <FormControl>



                      <label>Taxable Amount</label>
                      <Input
                        id={`taxable_value-${index}`}
                        name="taxable_value"
                        value={item.taxable_value}
                        sx={{
                          borderRadius: 2,
                          borderColor: "#e0e0e0",
                          "& .MuiOutlinedInput-root": { borderRadius: 2 },
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <FormControl>

                      <label>Calculated Tax</label>
                      <Input
                        id={`tax_amount-${index}`}
                        name="tax_amount"
                        value={item.tax_amount}
                        sx={{
                          borderRadius: 2,
                          borderColor: "#e0e0e0",
                          "& .MuiOutlinedInput-root": { borderRadius: 2 },
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth>

                      <label>Calculated Amount</label>
                      <Input
                        id={`calculated_amount_${index}`}
                        value={item.calculated_amount}
                        readOnly
                        sx={{
                          borderRadius: 2,
                          width: 150,
                          borderColor: "#e0e0e0",
                          "& .MuiOutlinedInput-root": { borderRadius: 2 },
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={1}
                    sx={{
                      marginBottom: -1,
                      display: "flex",
                      alignItems: "right",
                    }}
                  >
                    <IconButton onClick={() => deleteItem(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

            <Button
              onClick={addItem}
              variant="contained"
              size="small"
              sx={{
                fontSize: "10px",
                color: "white",
                backgroundColor: "#123270",
                borderRadius: 2,
                height: "30px",
                mt: 2,
                "&:hover": { color: "black", backgroundColor: "#53B789" },
              }}
            >
              Add New Item +
            </Button>

            <Grid container spacing={3} sx={{ mt: 1, mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="total-amount">Total Amount</InputLabel>
                  <Input
                    name="total_amount"
                    value={formData.total_amount}
                    readOnly
                    sx={{
                      borderRadius: 2,
                      borderColor: "#e0e0e0",
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel
                    sx={{
                      "& .MuiInputLabel-asterisk": {
                        color: "red",
                        fontSize: "20px",
                      },
                    }}
                    htmlFor="status"
                  >
                    Status
                  </InputLabel>
                  <Select
                    name="status"
                    variant="standard"
                    value={formData.status}
                    onChange={handleChange}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="Paid">Paid</MenuItem>
                    <MenuItem value="Unpaid">Unpaid</MenuItem>
                    <MenuItem value="Partially Paid">Partially Paid</MenuItem>
                  </Select>
                  {error.status && (
                    <Typography sx={{ color: "#c30010", fontSize: 13 }}>
                      <ErrorOutlineOutlinedIcon sx={{ fontSize: "17px" }} />{" "}
                      This Field is Required
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <Box

              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button
                onClick={() => { sendData() }}
                variant="contained"
                size="small"
                sx={{
                  color: "white",
                  backgroundColor: "#123270",
                  borderRadius: 2,
                  height: "40px",
                  mt: 4,
                  "&:hover": { color: "black", backgroundColor: "#53B789" },
                }}
              >
                Create Invoice
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{
                  color: "white",
                  borderRadius: 2,
                  height: "40px",
                  mt: 4,

                }}
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
            </Box>

          </Box>
        </Modal>

        <Box sx={{ display: "block" }}>
          <TableContainer
            component={Paper}
            sx={{marginTop: 5 }}
          >
            <Table>
              <TableHead sx={{ m: 5, backgroundColor: "#53B789" }}>
                <TableRow>
                  {/* <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Invoice ID
                  </TableCell> */}
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Invoice Number
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Customer
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Generated Date
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Due Date
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Invoice Items
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Total Amount
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Details
                  </TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
  {tableData &&
    tableData
      .filter((e) => {
        return search.toLowerCase() === ""
          ? e
          : e.customer_details?.customer_name
              .toLowerCase()
              .includes(search);
      })
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) 
      .map((row, index) => (
        <TableRow
          key={index}
          sx={{
            m: 5,
            height: "3",
            backgroundColor: "#fff",
            "&:hover": { backgroundColor: "#dcf0e7" },
          }}
        >
          {/* <TableCell sx={{ textAlign: "center" }}>
            {row.invoice_id}
          </TableCell> */}
          <TableCell sx={{ textAlign: "center" }}>
            {row.invoice_number}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {row.customer_details?.customer_name}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {row.generated_date}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {row.due_date}
          </TableCell>

          <TableCell sx={{ textAlign: "center" }}>
            {row.invoice_item_id?.map((item, i) => (
              <span key={i}>
                {item.product_name}
                {i < row.invoice_item_id.length - 1 ? ", " : ""}
              </span>
            ))}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {row.total_amount}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {row.status}
          </TableCell>
          <TableCell
            sx={{ textAlign: "center", cursor: "pointer" }}
          >
            <Button
              variant="standard"
              sx={{
                textTransform: "none",
                "&:hover": {
                  color: "black",
                  backgroundColor: "#53B789",
                },
              }}
              onClick={() => handleViewInvoice(row.pdf)}
            >
              View Invoice
            </Button>
          </TableCell>
        </TableRow>
      ))}
</TableBody>

            </Table>
          </TableContainer>
          
      <TablePagination
  component="div"
  count={tableData.length} 
  page={page} 
  onPageChange={(event, newPage) => setPage(newPage)} 
  rowsPerPage={rowsPerPage} 
  onRowsPerPageChange={(event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); 
    setPage(0); 
  }}
  labelRowsPerPage="Invoices per page"
  nextIconButtonProps={{ 
    'aria-label': 'Next Page', 
    sx: { 
      color: '#1976d2', 
      '&:hover': { color: '#1e88e5' } 
    }
  }}
  backIconButtonProps={{ 
    'aria-label': 'Previous Page', 
    sx: { 
      color: '#1976d2', 
      '&:hover': { color: '#1e88e5' } 
    }
  }}
  sx={{
   
    backgroundColor: 'rgb(209,250,229)', 
    padding: '8px 16px', 
    borderRadius: '8px', 
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
    '& .MuiTablePagination-toolbar': {
      justifyContent: 'space-between', 
    },
    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
      color: '#123270', 
      fontWeight: 700, 
    },
    '& .MuiTablePagination-select': {
      borderColor: '#1976d2', 
      '&:focus': {
        borderColor: '#1e88e5', 
      },
    },
  }}
/>
        </Box>
      </Box>
    </Box>

  );
}

export default Invoice;
