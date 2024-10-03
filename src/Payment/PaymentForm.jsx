import React, { useEffect, useState } from "react";
import axios from "axios";
import base_url from "../utils/API";
import { useForm } from "react-hook-form";
import {
  Input,
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Modal,
  MenuItem,
  Select,
  useMediaQuery,
  
} from "@mui/material";

export default function PaymentForm({ addData, edit, open, onClose }) {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [invoiceId, setInvoiceId] = useState([]);
  const [paymethod, setPaymethod] = useState("");

  useEffect(() => {
    getInvoiceId();
    getpaymethod();
    reset({
      invoice_id: edit?.invoice_id || "",
      method_id: edit?.method_id || "",
      amount: edit?.amount || "",
      payment_date: edit?.payment_date || "",
    });
  }, [edit, reset]);

  const getInvoiceId = async () => {
    try {
      axios.defaults.headers.common["ngrok-skip-browser-warning"] = "any value";
      const response = await axios.get(`${base_url}/api/invoice/`);
      setInvoiceId(response.data);
      console.log("invoice", response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const getpaymethod = async () => {
    try {
      axios.defaults.headers.common["ngrok-skip-browser-warning"] = "any value";
      const response = await axios.get(`${base_url}/api/payment_method/`);
      setPaymethod(response.data);
      console.log("invoice", response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handlepayment = (event) => {
    const selectedInvoiceId = invoiceId.find(
      (e) => e.invoice_id === event.target.value
    );
    if (selectedInvoiceId) {
      setValue("invoice_id", selectedInvoiceId.invoice_id);
      setValue("amount", selectedInvoiceId.total_amount);
    }
  };

  const onSubmit = (formData) => {
    addData(formData, Object.keys(edit || {}).length > 0);
    onClose();
  };
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const filter_status = invoiceId.filter((inv) =>{
    return inv.status !== "Paid"
  })
  

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
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
        >
          <Typography
            id="modal-title"
            variant="h6"
            sx={{ mb: 1, fontWeight: "bold", color: "#123270" }}
          >
            {Object.keys(edit).length > 0 ? "Edit Payment" : "Add Payment"}
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="invoice_id">Invoice Number</InputLabel>
            <Select
              variant="standard"
              id="invoice_id"
              name="invoice_id"
              {...register("invoice_id")}
              onChange={handlepayment}
            >
              {filter_status &&
                filter_status.map((item) => (
                  <MenuItem key={item.invoice_id} value={item.invoice_id}>
                    {item.invoice_number}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="method_id">Payment Method</InputLabel>
            <Select
              variant="standard"
              id="method_id"
              name="method_id"
              {...register("method_id")}
            >
              {paymethod &&
                paymethod.map((item) => (
                  <MenuItem
                    key={item.payment_method_id}
                    value={item.payment_method_id}
                  >
                    {item.payment_type}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            {/* <label htmlFor="amount">Amount</label> */}
            <Typography variant="h8" sx={{ mb: -1, marginLeft:2, color: "#black" }}>
                  Amount
                  </Typography>
            <Input
            readOnly="true"
            
              type="number"
              id="amount"
              name="amount"
        
              {...register("amount")}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Input
              type="date"
              id="payment_date"
              name="payment_date"
              {...register("payment_date")}
            />
          </FormControl>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              sx={{
                color: "white",
                backgroundColor: "#123270",
                "&:hover": { color: "black", backgroundColor: "#53B789" },
              }}
              type="submit"
              variant="contained"
              color="success"
            >
              Save
            </Button>
            <Button variant="contained" color="error" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
