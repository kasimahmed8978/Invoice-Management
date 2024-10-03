import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
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
  List,
  useMediaQuery,
  TablePagination,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import NavBar from "../NavBar";
import axios from "axios";
import base_url from "../utils/API";
import { Start } from "@mui/icons-material";
import Invoice from "./Invoice";

function Product({ pr_q }) {
  const initialFormData = {
    product_name: "",
    description: "",
    price: "",
    stock_quantity: "",
  };
  // console.log(setQ,"quant");
  <Invoice pr_q={pr_q} />;
  console.log(pr_q, "pr_q6767867687");

  const [formData, setFormData] = useState(initialFormData);
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [quantity, setQuantity] = useState({});
  const [product_name, setProduct_name] = useState({});

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (pr_q) {
      setQuantity(pr_q.quantity);
      setProduct_name(pr_q.product_name);
    }
  }, [pr_q]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      axios.defaults.headers.common["ngrok-skip-browser-warning"] = "any value";
      const response = await axios.get(`${base_url}/api/product/`);
      setTableData(response.data);
      console.log(response.data, "#$%^##");
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  function postDataToServer(values) {
    axios
      .post(`${base_url}/api/product/`, formData)
      .then((res) => {
        console.log(res.data);
        getData();
        alert("Product Added Successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const updateDataToServer = async () => {
    try {
      await axios.put(`${base_url}/api/product/`, formData);
      getData();
      alert("Product updated Successfully");
    } catch (err) {
      console.error("Error updating Product", err);
    }
  };

  const deleteDataFromServer = async (product_id) => {
    try {
      await axios.delete(`${base_url}/api/product/?delete=${product_id}`);
      getData();
      alert("Product deleted Successfully");
    } catch (err) {
      console.error("Error deleting Product:", err);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };

  const paginatedData = tableData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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

  const handleDelete = (product_id) => {
    deleteDataFromServer(product_id);
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
        aria-label="Product Section"
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
              width: isSmallScreen ? "100%" : "90%",
              maxWidth: 800,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: { xs: 2, sm: 4 },
              borderRadius: 2,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            component="form"
          >
            {/* <Typography id="modal-title" component="main" sx={{ flexGrow: 1 }}>
            {editMode ? "Edit Product" : "Add Product"}
          </Typography> */}
            <Typography
              id="modal-title"
              variant="h6"
              sx={{ mb: 1, fontWeight: "bold", color: "#123270" }}
            >
              {editMode ? "Edit Product" : "Add Product"}
            </Typography>

            <FormControl sx={{ margin: 2 }}>
              <InputLabel htmlFor="product_name">Product Name</InputLabel>
              <Input
                id="product-name"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl sx={{ margin: 2 }}>
              <InputLabel htmlFor="product_name">
                Product Description
              </InputLabel>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl sx={{ margin: 2 }}>
              <InputLabel htmlFor="product_name">Price</InputLabel>
              <Input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl sx={{ margin: 2 }}>
              <InputLabel htmlFor="duration">Stock Quantity</InputLabel>
              <Input
                type="number"
                id="stock_quantity"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
              />
            </FormControl>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  color: "white",
                  backgroundColor: "#123270",
                  "&:hover": { color: "black", backgroundColor: "#53B789" },
                }}
              >
                {editMode ? "Update" : "Save"}
              </Button>
              <Button
                variant="contained"
                color="error"
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
            sx={{ marginTop: 5 }}
          >
            <Table>
              <TableHead sx={{ m: 5, backgroundColor: "#53B789" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Product Id
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Product Name
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Product Description
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Price
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Stock Quantity
                  </TableCell>
                  {/* <TableCell sx={{ color: "white", textAlign: "center" }}>
                Client Id
              </TableCell> */}
                  {/* <TableCell sx={{ color: "white", textAlign: "center" }}>
                Team Id
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Tech Id
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Action
              </TableCell> */}
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData
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
                      <TableCell sx={{ textAlign: "center" }}>
                        {row.product_id}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {row.product_name}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {row.description}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {row.price}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {row.stock_quantity}
                      </TableCell>
                      {/* <TableCell sx={{ textAlign: "center" }}>
                  {row.team_name}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.tech_id.join(',')}
                </TableCell> */}
                      <TableCell sx={{ textAlign: "center" }}>
                        <IconButton
                          onClick={() => handleEdit(index)}
                          aria-label="edit"
                          sx={{ color: "grey" }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(row.product_id)}
                          aria-label="delete"
                          sx={{ color: "red" }}
                        >
                          <DeleteIcon />
                        </IconButton>
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
              "aria-label": "Next Page",
              sx: {
                color: "#1976d2",
                "&:hover": { color: "#1e88e5" },
              },
            }}
            backIconButtonProps={{
              "aria-label": "Previous Page",
              sx: {
                color: "#1976d2",
                "&:hover": { color: "#1e88e5" },
              },
            }}
            sx={{
              backgroundColor: "rgb(209,250,229)",
              padding: "8px 16px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              "& .MuiTablePagination-toolbar": {
                justifyContent: "space-between",
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  color: "#123270",
                  fontWeight: 700,
                },
              "& .MuiTablePagination-select": {
                borderColor: "#1976d2",
                "&:focus": {
                  borderColor: "#1e88e5",
                },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Product;
