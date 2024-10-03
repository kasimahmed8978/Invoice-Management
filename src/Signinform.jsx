import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Input,
  Box,
  Button,
  FormControl,
  InputLabel,
  Link,
  Typography
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";
import base_url from "../src/utils/API";


export default function Signinform() {
  const { register, handleSubmit, reset } = useForm();
  const navigate =useNavigate()
  const {storeTokenInLS}= useAuth()

  const onSubmit = async (formData) => {
    try {
      const response = await axios.post(`${base_url}/api/login/`,formData);
      const token = response.data;
      console.log("Tokens", response.data);
      storeTokenInLS(response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      navigate('/*')
    } catch (error) {
      console.log("error during login");
      alert("Invalid Username and Password");
    }
    reset();
  };
  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "#CEE1E6",

          boxShadow: 24,
          p: 4,
          borderRadius: 4,
        }}
      >
         <Typography
              id="modal-title"
              variant="h6"
              sx={{ mb: 1, fontWeight: "bold", color: "#123270" }}
            >
              Login
            </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Username</InputLabel>
          <Input
            type="text"
            placeholder="Enter the Username"
            {...register("username")}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Password</InputLabel>
          <Input
            type="password"
            placeholder="Enter Your Password"
            {...register("password")}
          />
        </FormControl>
        <Link href="/signup/*">Don't have an account</Link>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button type="submit" variant="contained" color="success">
            Sign In
          </Button>

        </Box>
      </Box>
    </>
  );
}
