import { Box, MenuItem, Select } from "@mui/material";
import React, { useState, useEffect } from "react";
import NavBar from "../NavBar";
import {
  Grid,
  Modal,
  Input,
  Button,
  Typography,
  FormControl,
  TextField,
  InputLabel,
  Stack,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import axios from "axios";
import base_url from "../utils/API";

export default function AddCompany() {
  const [data, setData] = useState({
    company_details_id: "",
    company_name: "",
    house_no: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    bank_name: "",
    branch_name: "",
    account_number: "",
    ifsc_code: "",
    gst_in: "",
    user_id: "",
    inv_num_format: "",
    show_bank_data: "",
  });
  const [images, setImages] = useState({
    company_logo: null,
    digital_seal: null,
    digital_signature: null,
  });
  const [dataImage, setDataImage] = useState({
    company_logo: "",
    digital_seal: "",
    digital_signature: "",
  });
  const [edit, setEdit] = useState(null);
  const [open, setOpen] = useState(false);

  // const [showBankDetails, setShowBankDetails] = useState('no');

  

  const handleAdd = () => {
    setOpen(true);
    setEdit(null);
    setData({});
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(`${base_url}/api/company_details/`)
      .then((response) => {
        console.log(response.data);
        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          setData(response.data);
          const imageData = response.data[0];
          setDataImage({
            company_logo: imageData.company_logo || "",
            digital_seal: imageData.digital_seal || "",
            digital_signature: imageData.digital_signature || "",
          });
        } else {
          setData([]);
          setDataImage({
            company_logo: "",
            digital_seal: "",
            digital_signature: "",
          });
        }
      })
      .catch((error) => {
        console.log("error fetching data", error);
      });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // const handleRadioChange = (event) => {
  //   setShowBankDetails(event.target.value);}
  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setImages((prevImages) => ({
        ...prevImages,
        [name]: files[0],
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setDataImage((prevData) => ({
          ...prevData,
          [name]: reader.result,
        }));
      };
      reader.readAsDataURL(files[0]);
    }
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    addData(data, edit);
  };
  function addData(data, editable) {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    for (const key in images) {
      if (images[key]) {
        formData.append(key, images[key]);
      }
    }
    if (editable) {
      axios
        .patch(
          `${base_url}/api/company_details/?company_d_upd=${edit.company_details_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          fetchData();
          setOpen(false);
        })
        .catch((error) => {
          console.log("error editing data", error);
        });
    } else {
      axios
        .post(`${base_url}/api/company_details/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          fetchData();
          setOpen(false);
        })
        .then((error) => {
          console.log("error adding data", error);
        });
    }
  }
  const handleEdit = (item) => {
    fetchData();
    setEdit(item);
    setData(item);
    setDataImage({
      company_logo: item.company_logo || "",
      digital_seal: item.digital_seal || "",
      digital_signature: item.digital_signature || "",
    });
    setOpen(true);
  };
  const handleDelete = (company_details_id) => {
    axios
      .delete(`${base_url}/api/company_details/?delete=${company_details_id}`)
      .then((response) => {
        fetchData();
        // setData(data => data.filter((e) => e.company_details_id !== company_details_id))
        setData((prevData) =>
          prevData.filter((e) => e.company_details_id !== company_details_id)
        );
      })
      .catch((error) => {
        console.log("error deleting data", error);
      });
  };

  return (
    <>
      <div>
        <Box sx={{ display: "flex", p: 10 }}>
          <NavBar />
          <Box component="main" sx={{ flexGrow: 1 }}>
            {data.length > 0 ? (
              data.map((e, index) => (
                <Box
                  key={index}
                  sx={{
                    maxWidth: "100%",
                    padding: "20px",
                    margin: "10px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    "@media (max-width:600px)": {
                      padding: "15px",
                      margin: "5px",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handleEdit(e)}
                      sx={{
                        color: "white",
                        backgroundColor: "#123270",
                        borderRadius: 2,
                        marginRight: "10px",
                       
                        "&:hover": { color: "black", backgroundColor: "#53B789" },
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(e.company_details_id)}
                    >
                      Delete
                    </Button>
                  </Box>

                  <Grid
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      marginBottom: "20px",
                      "@media (max-width:600px)": {
                        flexDirection: "column",
                      },
                    }}
                    container
                    spacing={3}
                  >
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          "& img": {
                            height: "120px",
                            width: "auto",
                            maxWidth: "100%",
                            objectFit: "contain",
                          },
                        }}
                      >
                        <img src={e.company_logo} alt="Company Logo" />
                      </Box>
                    </Grid>

                    {/* </Box> */}
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", marginLeft: "20px" }}
                      >
                        {e.company_name}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="h6"
                        sx={{ marginBottom: "10px", fontWeight: "bold" }}
                      >
                        Company Details
                      </Typography>
                      <Typography>
                        <strong>House no.:</strong> {e.house_no}
                      </Typography>
                      <Typography>
                        <strong>Area:</strong> {e.area}
                      </Typography>
                      <Typography>
                        <strong>Landmark:</strong> {e.landmark}
                      </Typography>
                      <Typography>
                        <strong>City:</strong> {e.city}
                      </Typography>
                      <Typography>
                        <strong>Pincode:</strong> {e.pincode}
                      </Typography>
                      <Typography>
                        <strong>State:</strong> {e.state}
                      </Typography>
                      <Typography>
                        <strong>Country:</strong> {e.country}
                      </Typography>
                      <Typography>
                        <strong>Contact:</strong> {e.company_contact}
                      </Typography>
                      <Typography>
                        <strong>Email:</strong> {e.company_email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="h6"
                        sx={{ marginBottom: "10px", fontWeight: "bold" }}
                      >
                        Bank Details
                      </Typography>
                      <Typography>
                        <strong>Bank:</strong> {e.bank_name}
                      </Typography>
                      <Typography>
                        <strong>Branch:</strong> {e.branch_name}
                      </Typography>
                      <Typography>
                        <strong>Account Number:</strong> {e.account_number}
                      </Typography>
                      <Typography>
                        <strong>IFSC Code:</strong> {e.ifsc_code}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          marginBottom: "10px",
                          marginTop: "15px",
                          fontWeight: "bold",
                        }}
                      >
                        GST IN
                      </Typography>
                      <Typography>{e.gst_in}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          marginBottom: "10px",
                          marginTop: "15px",
                          fontWeight: "bold",
                        }}
                      >
                        Invoice number Format
                      </Typography>
                      <Typography>{e.inv_num_format}</Typography>
                    </Grid>
                  </Grid>
                  <Box sx={{ marginTop: "20px" }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="h6"
                          sx={{ marginBottom: "10px", fontWeight: "bold" }}
                        >
                          Digital Seal
                        </Typography>
                        <img
                          src={e.digital_seal}
                          alt="Digital seal"
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                            maxHeight: "150px",
                            objectFit: "contain",
                            border: "1px solid #e0e0e0",
                            borderRadius: "4px",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="h6"
                          sx={{ marginBottom: "10px", fontWeight: "bold" }}
                        >
                          Digital Signature
                        </Typography>
                        <img
                          src={e.digital_signature}
                          alt="Digital signature"
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                            maxHeight: "150px",
                            objectFit: "contain",
                            border: "1px solid #e0e0e0",
                            borderRadius: "4px",
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginY: "20px",
                }}
              >
                <Button variant="contained" onClick={handleAdd} sx={{
                color: "white",
                backgroundColor: "#123270",
                borderRadius: 2,
                // height: "40px",
                "&:hover": { color: "black", backgroundColor: "#53B789" },
              }}>
                  Add Company
                </Button>
              </Box>
            )}{" "}
            {(open || edit) && (
              <Modal
                open={open}
                onClose={() => setOpen(false)}
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
                    maxWidth: 800,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: { xs: 2, sm: 4 },
                    borderRadius: 2,
                    maxHeight: "90vh",
                    overflowY: "auto",
                  }}
                  component="form"
                  onSubmit={handleFormSubmit}
                >
                  <Typography
                    id="modal-title"
                    variant="h6"
                    sx={{ fontWeight: "bold", marginBottom: "15px",color: "#123270" }}
                    component="h2"
                  >
                    {edit ? "Edit Company Details" : "Add Company Details"}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <InputLabel htmlFor="user_id">User ID</InputLabel>
                      <Input
                        fullWidth
                        id="user_id"
                        name="user_id"
                        value={data.user_id}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel htmlFor="company_name">
                        Company Name
                      </InputLabel>
                      <Input
                        fullWidth
                        id="company_name"
                        name="company_name"
                        value={data.company_name}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>

                    {/* <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>Company Logo</Typography>
                        <Input
                          type="file"
                          id="company_logo"
                          name="company_logo"
                          onChange={handleImageChange}
                          sx={{ display: 'none' }}
                        />
                        <label htmlFor="company_logo">
                          <Button variant="contained" component="span">
                            Upload Logo
                          </Button>
                        </label>
                        {dataImage.company_logo && (
                          <Box mt={2}>
                            <img src={dataImage.company_logo} alt="Company Logo" style={{ maxWidth: '200px' }} />
                          </Box>
                        )}
                      </Grid> */}

                    <Grid item xs={12} sm={6}>
                      <InputLabel htmlFor="company_email">
                        Company Email
                      </InputLabel>
                      <Input
                        fullWidth
                        id="company_email"
                        name="company_email"
                        multiline
                        value={data.company_email}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel htmlFor="company_contact">
                        Company Contact
                      </InputLabel>
                      <Input
                        fullWidth
                        id="company_contact"
                        name="company_contact"
                        multiline
                        value={data.company_contact}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel htmlFor="house_no">House No.</InputLabel>
                      <Input
                        fullWidth
                        id="house_no"
                        name="house_no"
                        multiline
                        value={data.house_no}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel htmlFor="area">Area</InputLabel>
                      <Input
                        fullWidth
                        id="area"
                        name="area"
                        multiline
                        value={data.area}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel htmlFor="landmark">Landmark</InputLabel>
                      <Input
                        fullWidth
                        id="landmark"
                        name="landmark"
                        multiline
                        value={data.landmark}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel htmlFor="city">City</InputLabel>
                      <Input
                        fullWidth
                        id="city"
                        name="city"
                        multiline
                        value={data.city}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel htmlFor="pincode">Pincode</InputLabel>
                      <Input
                        fullWidth
                        id="pincode"
                        name="pincode"
                        value={data.pincode}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel htmlFor="state">State</InputLabel>
                      <Input
                        fullWidth
                        id="state"
                        name="state"
                        value={data.state}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel htmlFor="country">Country</InputLabel>
                      <Input
                        fullWidth
                        id="country"
                        name="country"
                        value={data.country}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel htmlFor="bank_name">Bank Name</InputLabel>
                      <Input
                        fullWidth
                        id="bank_name"
                        name="bank_name"
                        value={data.bank_name}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel htmlFor="branch_name">Branch Name</InputLabel>
                      <Input
                        fullWidth
                        id="branch_name"
                        name="branch_name"
                        value={data.branch_name}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel htmlFor="account_number">
                        Account Number
                      </InputLabel>
                      <Input
                        fullWidth
                        id="account_number"
                        name="account_number"
                        value={data.account_number}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <InputLabel htmlFor="gst.in">GST</InputLabel>
                      <Input
                        fullWidth
                        id="gst_in"
                        name="gst_in"
                        value={data.gst_in}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel htmlFor="ifcs_code">IFSC Code</InputLabel>
                      <Input
                        fullWidth
                        id="ifsc_code"
                        name="ifsc_code"
                        value={data.ifsc_code}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel htmlFor="inv_num_format">
                        Invoice No. Format
                      </InputLabel>
                      <Select
                        sx={{ width: 350 }}
                        name="inv_num_format"
                        value={data.inv_num_format}
                        onChange={handleChange}
                      // defaultValue="invoice"
                      variant="standard"
                      >
                        {/* <MenuItem value="invoice">
                          <em>Select Invoice no. Format</em>
                        </MenuItem> */}
                        <MenuItem value="YYYY/CI/XXX">YYYY/CI/XXX</MenuItem>
                        <MenuItem value="CI/XXX/YYYY-YY">
                          CI/XXX/YYYY-YY
                        </MenuItem>
                        <MenuItem value="CI/BB/XXX/YYYY-YY">
                          CI/BB/XXX/YYYY-YY
                        </MenuItem>
                      </Select>
                      <Typography  sx={{ color: "#c30010",fontSize:15,fontStyle:"italic"}}>
              CI:Company Initials
            </Typography>
                      <Typography  sx={{ mb: 2, color: "#c30010",fontSize:15,fontStyle:"italic"}}>
              BB:Business to Business
            </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">
                        Do you wish to display the Bank details on invoice pdf?                        </FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          // defaultValue="no"
                          name="show_bank_data"
                          value={data.show_bank_data}
                          onChange={handleChange}
                          row
                        >
                          <FormControlLabel
                            value="True"
                            control={<Radio />}
                            label="Yes"
                            
                          />
                          <FormControlLabel
                            value="False"
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    <Grid container spacing={3} sx={{ margin: "10px" }}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Company Logo
                        </Typography>
                        <Input
                          type="file"
                          id="company_logo"
                          name="company_logo"
                          onChange={handleImageChange}
                          sx={{ display: "none" }}
                        />
                        <label htmlFor="company_logo">
                          <Button variant="contained" component="span">
                            Upload Logo
                          </Button>
                        </label>
                        {dataImage.company_logo && (
                          <Box mt={2}>
                            <img
                              src={dataImage.company_logo}
                              alt="Company Logo"
                              style={{ maxWidth: "200px" }}
                            />
                          </Box>
                        )}
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Digital Seal
                        </Typography>
                        <Input
                          type="file"
                          id="digital_seal"
                          name="digital_seal"
                          onChange={handleImageChange}
                          sx={{ display: "none" }}
                        />
                        <label htmlFor="digital_seal">
                          <Button variant="contained" component="span">
                            Upload Seal
                          </Button>
                        </label>
                        {dataImage.digital_seal && (
                          <Box mt={2}>
                            <img
                              src={dataImage.digital_seal}
                              alt="Digital Seal"
                              style={{ maxWidth: "200px" }}
                            />
                          </Box>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Digital Signature
                        </Typography>
                        <Input
                          type="file"
                          id="digital_signature"
                          name="digital_signature"
                          onChange={handleImageChange}
                          sx={{ display: "none" }}
                        />
                        <label htmlFor="digital_signature">
                          <Button variant="contained" component="span">
                            Upload Signature
                          </Button>
                        </label>
                        {dataImage.digital_signature && (
                          <Box mt={2}>
                            <img
                              src={dataImage.digital_signature}
                              alt="Digital Signature"
                              style={{ maxWidth: "200px" }}
                            />
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
                  >
                    <Button type="submit" variant="contained" sx={{
                color: "white",
                backgroundColor: "#123270",
                borderRadius: 2,
                "&:hover": { color: "black", backgroundColor: "#53B789" },
              }}>
                      {edit ? "Update" : "Save"}
                    </Button>
                    <Button variant="contained" color="error" onClick={() => setOpen(false)} sx={{ mr: 1 }}>
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </Modal>
            )}
          </Box>
        </Box>
      </div>
    </>
  );
}
