import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import NavBar from "../NavBar";
import PayMethod from "../PaymentMethod/PayMethod";

function PaymentMethod(props) {
  const isSmallScreen = useMediaQuery("(max-width:400px)");

  return (
    <Box sx={{ display: "flex", p: 10 }}>
      <NavBar />
      <Box
        component="main"
        sx={{ flexGrow: 1, width: isSmallScreen ? "100%" : "auto" }}
        aria-label="Payment Section"
      >
        <PayMethod />
      </Box>
    </Box>
  );
}

export default PaymentMethod;
