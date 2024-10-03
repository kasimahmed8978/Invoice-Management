import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Input,
  MenuItem,
  Select,
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Modal,
} from "@mui/material";
export default function Form({ addData, edit, open, onClose }) {
  const { register, handleSubmit, reset } = useForm();
  useEffect(() => {
    reset({
      payment_type: edit?.payment_type || "",
    });
  }, [edit, reset]);
  const onSubmit = (data) => {
    addData(data, Object.keys(edit || {}).length > 0);
    onClose();
  };

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
            width: 400,
            bgcolor: "background.paper",
            border: "3px solid #455a64",
            boxShadow: 24,
            p: 4,
            borderRadius: 4,
          }}
        >
          
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="payment_type">Payment Type</InputLabel>

            <Select label="Payment Type" {...register("payment_type")}>
              <MenuItem name="payment_type" value={"UPI"}>
                UPI
              </MenuItem>
              <MenuItem name="payment_type" value={"Card"}>
                Card
              </MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button type="submit" variant="contained" color="success">
              Submit
            </Button>
            <Button variant="outlined" color="error" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
