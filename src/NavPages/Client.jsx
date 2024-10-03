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
  Grid,
  TextField,
  useMediaQuery,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import NavBar from "../NavBar";
import axios from "axios";
import base_url from "../utils/API";

function Product(props) {
  const initialFormData = {
    customer_name: "",
    house_no: "",
    area: "",
    landmark: "",
    state: "",
    city: "",
    pincode: "",
    country: "",
    email: "",
    phone: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentcustomer_id, setcurrentcustomer_id] = useState(null);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      axios.defaults.headers.common["ngrok-skip-browser-warning"] = "any value";
      const response = await axios.get(`${base_url}/api/customer/`);
      setTableData(response.data);
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const postDataToServer = async () => {
    try {
      await axios.post(`${base_url}/api/customer/`, formData);
      getData();
      alert("customer Added Successfully");
    } catch (err) {
      console.error("Error adding client:", err);
    }
  };

  const updateDataToServer = async (customer_id) => {
    const { password, ...updateData } = formData;
    try {
      await axios.patch(
        `${base_url}/api/customer/?customer_update=${customer_id}`,
        updateData
      );
      getData();
      alert("Client updated Successfully");
    } catch (err) {
      console.error("Error updating client:", err);
    }
  };

  const deleteDataFromServer = async (customer_id) => {
    try {
      await axios.delete(
        `${base_url}/api/customer/?delete_client=${customer_id}`
      );
      getData();
      alert("Client deleted Successfully");
    } catch (err) {
      console.error("Error deleting client:", err);
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

  const handleOpenModal = (client = null) => {
    if (client) {
      setFormData(client);
      setEditMode(true);
      setcurrentcustomer_id(client.customer_id);
    } else {
      setFormData(initialFormData);
      setEditMode(false);
      setcurrentcustomer_id(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormData);
    setEditMode(false);
    setcurrentcustomer_id(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys.length === 1) {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData((prevFormData) => {
        const updatedData = { ...prevFormData };
        let nestedObject = updatedData;

        for (let i = 0; i < keys.length - 1; i++) {
          nestedObject = nestedObject[keys[i]];
        }

        nestedObject[keys[keys.length - 1]] = value;
        return updatedData;
      });
    }
  };

  const handleSubmit = () => {
    if (editMode && currentcustomer_id) {
      updateDataToServer(currentcustomer_id);
    } else {
      postDataToServer();
    }
    handleCloseModal();
  };

  const handleEdit = (customer_id) => {
    handleOpenModal(customer_id);
  };

  const handleDelete = (customer_id) => {
    deleteDataFromServer(customer_id);
  };
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  return (
    <>
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
              {/* <Typography id="modal-title" component="h2">
                {editMode ? "Edit Client" : "Add Customer"}
              </Typography> */}
              <Typography
              id="modal-title"
              variant="h5"
              sx={{ mb: 1, fontWeight: "bold", color: "#123270" }}
            >
              {editMode ? "Edit Customer" : "Add Customer"}
            </Typography>
              {/* <FormControl sx={{ margin: 2 }}>
            <InputLabel htmlFor="client-name">Client Id</InputLabel>
            <Input
              id="client-id"
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
            />
          </FormControl> */}
              <FormControl sx={{ margin: 2 }}>
                <InputLabel htmlFor="customer-name">Customer Name</InputLabel>
                <Input
                  id="customer-name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl sx={{ margin: 2 }}>
                <InputLabel htmlFor="house_no">House no.</InputLabel>
                <Input
                  id="house_no"
                  name="house_no"
                  value={formData.house_no}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl sx={{ margin: 2 }}>
                <InputLabel htmlFor="area">Area</InputLabel>
                <Input
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl sx={{ margin: 2 }}>
                <InputLabel htmlFor="landmark">Landmark</InputLabel>
                <Input
                  id="landmark"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl sx={{ margin: 2 }}>
                <InputLabel htmlFor="city">City</InputLabel>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl sx={{ margin: 2 }}>
                <InputLabel htmlFor="state">State</InputLabel>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl sx={{ margin: 2 }}>
                <InputLabel htmlFor="pincode">Pincode</InputLabel>
                <Input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl sx={{ margin: 2 }}>
                <InputLabel htmlFor="country">Country</InputLabel>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl sx={{ margin: 2 }}>
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl sx={{ margin: 2 }}>
                <InputLabel htmlFor="phone">Phone</InputLabel>
                <Input
                    id="phone"
                    name="phone"
                    placeholder="+91 prefix"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                {/* {editMode ? (
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+91 prefix"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Enter a 10 digit number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                )} */}
              </FormControl>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Button
                  variant="contained"
                  color="success"
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
              sx={{marginTop: 5 }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: "#53B789" }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Customer Id
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Customer Name
                    </TableCell>

                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      House no.
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Area
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Landmark
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      State
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      City
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Pincode
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Country
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Phone
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData &&
                    tableData
                      .filter((client) =>
                        client.customer_name
                          .toString()
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((client) => (
                        <TableRow key={client.customer_id}>
                          <TableCell sx={{ textAlign: "center" }}>
                            {client.customer_id}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {client.customer_name}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {client.house_no}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {client.area}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {client.landmark}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {client.state}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {client.city}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {client.pincode}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {client.country}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {client.email}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {client.phone}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <IconButton
                              onClick={() => handleEdit(client)}
                              sx={{ color: "gray" }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(client.customer_id)}
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
    </>
  );
}

export default Product;

// import React, { useState, useEffect } from "react";
// import {
//   Input,
//   Box,
//   Button,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   IconButton,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   FormControl,
//   InputLabel,
//   Modal,
//   TextField,
//   Grid,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import NavBar from "../NavBar";
// import axios from "axios";
// import base_url from "../utils/API";

// function Project(props) {
//   const initialFormData = {
//     client_name: "",
//     address: "",
//     email: "",
//     contact: "",
//     pincode: "",
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [tableData, setTableData] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [currentClientId, setCurrentClientId] = useState(null);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     getData();
//   }, []);

//   const getData = async () => {
//     try {
//       const response = await axios.get(`${base_url}/client/client/`);
//       setTableData(response.data);
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     }
//   };

//   const postDataToServer = async () => {
//     try {
//       await axios.post(`${base_url}/client/client/`, formData);
//       getData();
//       alert("Client Added Successfully");
//     } catch (err) {
//       console.error("Error adding client:", err);
//     }
//   };

//   const updateDataToServer = async (client_id) => {
//     const { password, ...updateData } = formData;
//     try {
//       await axios.patch(
//         `${base_url}/client/client/?client_update=${client_id}`,
//         updateData
//       );
//       getData();
//       alert("Client updated Successfully");
//     } catch (err) {
//       console.error("Error updating client:", err);
//     }
//   };

//   const deleteDataFromServer = async (client_id) => {
//     try {
//       await axios.delete(
//         `${base_url}/client/client/?delete_client=${client_id}`
//       );
//       getData();
//       alert("Client deleted Successfully");
//     } catch (err) {
//       console.error("Error deleting client:", err);
//     }
//   };

//   const handleOpenModal = (client = null) => {
//     if (client) {
//       setFormData(client);
//       setEditMode(true);
//       setCurrentClientId(client.client_id);
//     } else {
//       setFormData(initialFormData);
//       setEditMode(false);
//       setCurrentClientId(null);
//     }
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setFormData(initialFormData);
//     setEditMode(false);
//     setCurrentClientId(null);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const keys = name.split(".");

//     if (keys.length === 1) {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     } else {
//       setFormData((prevFormData) => {
//         const updatedData = { ...prevFormData };
//         let nestedObject = updatedData;

//         for (let i = 0; i < keys.length - 1; i++) {
//           nestedObject = nestedObject[keys[i]];
//         }

//         nestedObject[keys[keys.length - 1]] = value;
//         return updatedData;
//       });
//     }
//   };

//   const handleSubmit = () => {
//     if (editMode && currentClientId) {
//       updateDataToServer(currentClientId);
//     } else {
//       postDataToServer();
//     }
//     handleCloseModal();
//   };

//   const handleEdit = (client) => {
//     handleOpenModal(client);
//   };

//   const handleDelete = (client_id) => {
//     deleteDataFromServer(client_id);
//   };

//   return (
//     <Box sx={{ display: "block", p: 10, marginLeft: 30 }}>
//       <NavBar />

//       <Grid container spacing={2} sx={{ alignItems: "center" }}>
//         <Grid item xs={12} sm={8}>
//           <TextField
//             type="search"
//             placeholder="Enter the Client Name"
//             onChange={(e) => setSearch(e.target.value)}
//             variant="outlined"
//             sx={{
//               width: "100%",
//               "& .MuiOutlinedInput-root": {
//                 height: "43px",
//                 borderRadius: 16,
//               },
//             }}
//           />
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <Button
//             onClick={() => handleOpenModal()}
//             size="medium"
//             variant="contained"
//             sx={{
//               color: "white",
//               backgroundColor: "#123270",
//               borderRadius: 2,
//               height: "40px",
//               width: "100%",
//               "&:hover": { color: "black", backgroundColor: "#53B789" },
//             }}
//           >
//             ADD
//           </Button>
//         </Grid>
//       </Grid>
//       <Modal
//         open={isModalOpen}
//         onClose={handleCloseModal}
//         aria-labelledby="modal-title"
//         aria-describedby="modal-description"
//       >
//         <Box
//           sx={{
//             flexDirection: "column",
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: "90%",
//             maxWidth: 800,
//             bgcolor: "background.paper",
//             border: "3px solid #455a64",
//             boxShadow: 24,
//             p: 4,
//             borderRadius: 4,
//           }}
//         >
//           <Typography id="modal-title" component="h2">
//             {editMode ? "Edit Client" : "Add Client"}
//           </Typography>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel htmlFor="client-name">Client Name</InputLabel>
//                 <Input
//                   id="client-name"
//                   name="client_name"
//                   value={formData.client_name}
//                   onChange={handleChange}
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel htmlFor="email">Email</InputLabel>
//                 <Input
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel htmlFor="contact">Contact</InputLabel>
//                 <Input
//                   id="contact"
//                   name="contact"
//                   value={formData.contact}
//                   onChange={handleChange}
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel htmlFor="pincode">Pincode</InputLabel>
//                 <Input
//                   id="pincode"
//                   name="pincode"
//                   value={formData.pincode}
//                   onChange={handleChange}
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth>
//                 <InputLabel htmlFor="address">Address</InputLabel>
//                 <Input
//                   id="address"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                 />
//               </FormControl>
//             </Grid>
//           </Grid>
//           <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
//             <Button variant="contained" color="success" onClick={handleSubmit}>
//               {editMode ? "Update" : "Save"}
//             </Button>
//             <Button variant="outlined" color="error" onClick={handleCloseModal}>
//               Cancel
//             </Button>
//           </Box>
//         </Box>
//       </Modal>

//       <TableContainer component={Paper} sx={{ marginTop: 5 }}>
//         <Table>
//           <TableHead sx={{ backgroundColor: "#53B789" }}>
//             <TableRow>
//               <TableCell sx={{ color: "white", textAlign: "center" }}>
//                 Client Id
//               </TableCell>
//               <TableCell sx={{ color: "white", textAlign: "center" }}>
//                 Client Name
//               </TableCell>
//               <TableCell sx={{ color: "white", textAlign: "center" }}>
//                 Email
//               </TableCell>
//               <TableCell sx={{ color: "white", textAlign: "center" }}>
//                 Contact
//               </TableCell>
//               <TableCell sx={{ color: "white", textAlign: "center" }}>
//                 Address
//               </TableCell>
//               <TableCell sx={{ color: "white", textAlign: "center" }}>
//                 Pincode
//               </TableCell>
//               <TableCell sx={{ color: "white", textAlign: "center" }}>
//                 Actions
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {tableData &&
//               tableData
//                 .filter((client) =>
//                   client.client_name
//                     .toString()
//                     .toLowerCase()
//                     .includes(search.toLowerCase())
//                 )
//                 .map((client) => (
//                   <TableRow key={client.client_id}>
//                     <TableCell sx={{ textAlign: "center" }}>
//                       {client.client_id}
//                     </TableCell>
//                     <TableCell sx={{ textAlign: "center" }}>
//                       {client.client_name}
//                     </TableCell>
//                     <TableCell sx={{ textAlign: "center" }}>
//                       {client.email}
//                     </TableCell>
//                     <TableCell sx={{ textAlign: "center" }}>
//                       {client.contact}
//                     </TableCell>
//                     <TableCell sx={{ textAlign: "center" }}>
//                       {client.address}
//                     </TableCell>
//                     <TableCell sx={{ textAlign: "center" }}>
//                       {client.pincode}
//                     </TableCell>
//                     <TableCell sx={{ textAlign: "center" }}>
//                       <IconButton
//                         onClick={() => handleEdit(client)}
//                         sx={{ color: "gray" }}
//                       >
//                         <EditIcon />
//                       </IconButton>
//                       <IconButton
//                         onClick={() => handleDelete(client.client_id)}
//                         sx={{ color: "red" }}
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// }

// export default Project;
