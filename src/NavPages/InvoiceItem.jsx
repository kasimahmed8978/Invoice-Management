import React, { useState, useEffect } from "react";
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
  useMediaQuery
} from "@mui/material";
import ReactSelect from "react-select";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import NavBar from "../NavBar";
import axios from "axios";
import base_url from "../utils/API";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
function Project(props) {
  const initialFormData = {
    quantity: "",
    unit_price: "",
    total_amount: "",
    tax_amount: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [tableData, setTableData] = useState([]);
  const [projectdata, setProjectdata] = useState([]);
  const [taxdata, settaxdata] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [productid, setproductid] = React.useState("");
  const [taxid, settaxid] = React.useState("");

  useEffect(() => {
    getData();
    getproject();
    gettax();
  }, []);
  const gettax = async () => {
    try {
      const response = await axios.get(`${base_url}/api/tax/`);
      settaxdata(response.data);
    } catch (err) {
      console.error("Error", err);
    }
  };
 
  const getproject = async () => {
    try {
      const response = await axios.get(`${base_url}/api/product/`);
      setProjectdata(response.data.map((product_data) => (
        // console.log(product_data.price,'ddddddddd')
        {
        label: product_data.product_name,
        value: product_data.product_id,
        price:product_data.price
      }
    )));
      console.log(response.data, "#$%^##");
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  const getData = async () => {
    try {
      axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'any value';
      const response = await axios.get(`${base_url}/api/invoice_item/`);
      console.log(response.data,"767867768");
      setTableData(response.data);
    } catch (err) {
      console.log(err);
      console.error("Error fetching data:", err);
    }
  };

  function postDataToServer(values) {
    axios
      .post(`${base_url}/api/invoice_item/`, formData)
      .then((res) => {
        console.log(res.data);
        getData();
        alert("Invoice Item Added Successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const updateDataToServer = async () => {
    try {
      await axios.put(`${base_url}/api/invoice_item/`, formData);
      getData();
      alert("Invoice Item updated Successfully");
    } catch (err) {
      console.error("Error updating client:", err);
    }
  };

  const deleteDataFromServer = async (invoice_item_id) => {
    try {
      await axios.delete(
        `${base_url}/api/invoice_item/?delete=${invoice_item_id}`
      );
      getData();
      alert("Invoice Item deleted Successfully");
    } catch (err) {
      console.error("Error deleting client:", err);
    }
  };

  
  const handleChangeProjectDropdown = (event) => {
    console.log(event,"ebebebeb")
    setproductid(event)
    setFormData({
      ...formData,
      unit_price: event.price,
      product_id: +event.value,
    });
  };
  const handleChangeTaxDropdown = (event) => {
    const selectedTax = event.target.value;
    const taxRate = selectedTax.rate;
    const itemPrice = formData.item_price;
    const taxAmount = ((itemPrice * taxRate)/100).toFixed(2);
    console.log(event.target.value.rate,'event tax dropdown');
    settaxid(selectedTax);
    // settaxid(event.target.value);
    setFormData({
      ...formData,
      // tax_id: +event.target.value,
      tax_id: +selectedTax.tax_id,
      tax_amount: taxAmount,
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (editMode) {
      updateDataToServer();
      const updatedData = [...tableData];
      updatedData[editIndex] = formData;
      setTableData(updatedData);
    } else {
      postDataToServer();
      setTableData([...tableData, formData]);
    }
    setFormData(initialFormData);
    handleCloseModal();
  };

  const handleEdit = (index) => {
    setFormData(tableData[index]);
    setEditMode(true);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (invoice_item_id) => {
    deleteDataFromServer(invoice_item_id);
  };
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  return (
    <Box sx={{ display: "flex", p: 10, flexDirection : isSmallScreen ? "column" : "row"}} >
    <NavBar />
    <Box
      component="main"
      sx={{ flexGrow: 1, width: isSmallScreen ? "100%" : "auto" }}
      aria-label="Payment Section"
    >
      {/* <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={handleOpenModal}
          size="medium"
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "#123270",
            borderRadius: 2,
            "&:hover": { color: "black", backgroundColor: "#53B789" },
          }}
        >
          ADD
        </Button>
      </Box> */}

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isSmallScreen ? "100%" : '90%',
        maxWidth: 800,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: { xs: 2, sm: 4 },
        borderRadius: 2,
        maxHeight: '90vh',
        overflowY: 'auto',
      }}
      component="form"
        >
          {/* <Typography id="modal-title" component="main" sx={{ flexGrow: 1 }}>
            {editMode ? "Edit Invoice Item" : "Add Invoice Item"}
          </Typography>
           */}
           <Typography
              id="modal-title"
              variant="h6"
              sx={{ mb: 1, fontWeight: "bold", color: "#123270" }}
            >
              {editMode ? "Edit Invoice Item" : "Add Invoice Item"}
            </Typography>

          <FormControl sx={{ margin: 2, width: 200 }}>
            {/* <InputLabel id="demo-simple-select-label">Product Name</InputLabel> */}
            <ReactSelect
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={productid}
              variant="standard"
              label="Invoice Id"
              onChange={handleChangeProjectDropdown}
              options={projectdata}
            />
              {/* {projectdata(
                (row, index) => (
                  console.log(row, "******"),
                  (<MenuItem value={row.product_id} price={row.price}>{row.product_name}</MenuItem>)
                )
              )} */}
           
          </FormControl>

          <FormControl sx={{ margin: 2 }}>
            <InputLabel htmlFor="client-id">Quantity</InputLabel>
            <Input
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
          </FormControl>

          {/* <FormControl sx={{ margin: 2, width: 200 }}>
            <InputLabel id="demo-simple-select-label">Unit Price</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={unit_price}
              variant="standard"
              label="Invoice Id"
              onChange={handleChange}
            >
              {taxdata.map((row, index) => (
                <MenuItem value={row}>{row.tax_name}-{row.rate}%</MenuItem>
              ))}
            </Select>
          </FormControl> */}
          <FormControl sx={{ margin: 2 }}>
            <InputLabel htmlFor="unit-price">Unit Price</InputLabel>
            <Input
              id="unit-price"
              name="unit_price"
              value={formData.unit_price}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl sx={{ margin: 2 }}>
            <InputLabel htmlFor="total-amount">Total Amount</InputLabel>
            <Input
              id="total-amount"
              name="total_amount"
              value={formData.total_amount}
              onChange={handleChange}
              
            />
          </FormControl>
          <FormControl sx={{ margin: 2 }}>
            <InputLabel htmlFor="tech-id">Tax Amount</InputLabel>
            <Input
              id="tax-amount"
              name="tax_amount"
              value={formData.tax_amount}
              onChange={handleChange}
              
            />
          </FormControl>
          
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="contained" color="success"
            sx={{
              color: "white",
              backgroundColor: "#123270",
              "&:hover": { color: "black", backgroundColor: "#53B789" },
            }} onClick={handleSubmit}>
              {editMode ? "Update" : "Save"}
            </Button>
            <Button variant="contained" color="error" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      <Box sx={{ display: "block" }}>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "100vh", marginTop: 5 }}
      >
        <Table>
          <TableHead sx={{ m: 5, backgroundColor: "#53B789" }}>
            <TableRow>
              
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Invoice Item Id
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Invoice Number
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Product Name
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Quantity
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Unit Price
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Tax Rate
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Taxable Value
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Calculated Amount
              </TableCell>
              {/* <TableCell sx={{ color: "white", textAlign: "center" }}>
                Action
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  m: 5,
                  height: "3",
                  backgroundColor: "#fff",
                  "&:hover": { backgroundColor: "#dcf0e7" },
                }}
              >
        
                <TableCell sx={{ textAlign: "center" }}>
                  {row.invoice_item_id}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.invoice_number}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.product_name}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.quantity}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.unit_price}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.taxid}
                </TableCell>
                {/* <TableCell sx={{ textAlign: "center" }}>{row.tax_name}-{row.tax_rate}%</TableCell> */}
                <TableCell sx={{ textAlign: "center" }}>
                  {row.taxable_value}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                {row.calculated_amount}
                </TableCell>
                {/* <TableCell sx={{ textAlign: "center" }}>
                  <IconButton
                    onClick={() => handleEdit(index)}
                    aria-label="edit"
                    sx={{ color: "grey" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(row.invoice_item_id)}
                    aria-label="delete"
                    sx={{ color: "red" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    </Box>
    </Box>
  );
}

export default Project;
