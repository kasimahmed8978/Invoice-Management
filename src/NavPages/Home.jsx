import React, { useEffect, useState } from "react";
import NavBar from "../NavBar";
import Box from "@mui/material/Box";
import { Grid, Typography } from "@mui/material";
import moment from "moment";
import axios from "axios";
import Plot from "react-plotly.js";
import base_url from "../utils/API";
import {
  AccountTreeOutlined,
  CurrencyRupeeOutlined,
  MovingOutlined,
  PeopleAltOutlined,
  TaskAltOutlined,
} from "@mui/icons-material";
import { color } from "chart.js/helpers";

export default function Home() {
  const [tableData, setTableData] = useState([]);
  const [product, setProduct] = useState([]);
  const [client, setClient] = useState([]);
  const [totalAmount, setTotalAmount] = useState([]);
  const [date, setDate] = useState([]);
  const [count, setCounts] = useState([]);
  const [generatedDate, setGeneratedDate] = useState([]);
  const [items, setItems] = useState([]);
  const [qty,setQty]=useState([])

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      axios.defaults.headers.common["ngrok-skip-browser-warning"] = "any value";
      const Clientsresponse = await axios.get(`${base_url}/api/customer/`);
      const Productresponse = await axios.get(`${base_url}/api/product/`);
      const Invoiceresponse = await axios.get(`${base_url}/api/invoice/`);
      setTableData(Invoiceresponse.data);
      setProduct(Productresponse.data);
      setClient(Clientsresponse.data);
      const DATA = Invoiceresponse.data.map((e) => ({
        due_date: moment(e.due_date).format("MMM YYYY"),
        total_amount: parseFloat(e.total_amount),
      }));
      const groupedData = DATA.reduce((acc, invoice) => {
        if (!acc[invoice.due_date]) {
          acc[invoice.due_date] = 0;
        }
        acc[invoice.due_date] += invoice.total_amount;
        return acc;
      }, {});
      const sortdata = Object.entries(groupedData).sort(
        ([dateA], [dateB]) => new Date(dateA) - new Date(dateB)
      );
      const duedate = sortdata.map(([due_date]) => due_date);
      const amount = sortdata.map(([, total_amount]) => total_amount);
      setDate(duedate);
      setTotalAmount(amount);
      setClient(Clientsresponse.data);
      const counts = {};
      Invoiceresponse.data.forEach((invoice) => {
        const monthYear = invoice.generated_date
          ? moment(invoice.generated_date).format("MMM YYYY")
          : "";
        counts[monthYear] = (counts[monthYear] || 0) + 1;
      });
      const monthYears = Object.keys(counts).sort((a, b) =>
        moment(a, "YYYY MMMM").diff(moment(b, "YYYY MMMM"))
      );
      setGeneratedDate(monthYears);
      setCounts(monthYears.map((my) => counts[my]));
      const productqty = Invoiceresponse.data.reduce((acc, item) => {
        item.invoice_item_id.forEach((invoiceItem) => {
          const { product_name, quantity } = invoiceItem;
          if (acc[product_name]) {
            acc[product_name].quantity += quantity;
          } else {
            acc[product_name] = { name: product_name, quantity: quantity };
          }
        });
        return acc;
      }, {});
      const names = Object.values(productqty).map((product) => product.name);
      const quantities = Object.values(productqty).map((product) => product.quantity);
      setItems(names);
      setQty(quantities);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const amount = tableData.map((e) => e.total_amount);
  const total = amount.reduce((sum, value) => sum + parseFloat(value || 0), 0);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          p: { xs: 2, sm: 5, md: 10 },
        }}
      >
        <NavBar />
        <Box component="main" sx={{ flexGrow: 1, width: "100%" }}>
          <Grid container spacing={2} sx={{ mt: 3, mb: 3 }}>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center",
                flexWrap: "wrap",
              }}
              item
              xs={12}
              sm={6}
              md={4}
            >
              <Box
                sx={{
                  border: "1px solid white",
                  color: "#53B789",
                  backgroundColor: "white",
                  boxShadow: "0 0 10px 10px #eeeeee ",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: { xs: 2, sm: 3 },
                  height: "100%",
                  width: "100%",
                }}
              >
                <Box>
                  <TaskAltOutlined />
                </Box>
                <Box sx={{ textAlign: "right", padding: "0" }}>
                  <Typography sx={{ fontWeight: "100" }}>
                    Recent Activity
                  </Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "600" }}>
                    Dashboard
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center",
                flexWrap: "wrap",
              }}
              item
              xs={12}
              sm={6}
              md={4}
            >
              <Box
                sx={{
                  border: "1px solid white",
                  color: "#53B789",
                  backgroundColor: "white",
                  boxShadow: "0 0 10px 10px #eeeeee ",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: { xs: 2, sm: 3 },
                  height: "100%",
                  width: "100%",
                }}
              >
                <Box>
                  <MovingOutlined />
                </Box>
                <Box sx={{ textAlign: "right", padding: "0" }}>
                  <Typography sx={{ fontWeight: "100" }}>
                    Total Sales
                  </Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "600" }}>
                    {amount.length}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center",
                flexWrap: "wrap",
              }}
              item
              xs={12}
              sm={6}
              md={4}
            >
              <Box
                sx={{
                  border: "1px solid white",
                  color: "#53B789",
                  backgroundColor: "white",
                  boxShadow: "0 0 10px 10px #eeeeee ",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: { xs: 2, sm: 3 },
                  height: "100%",
                  width: "100%",
                }}
              >
                <Box>
                  <CurrencyRupeeOutlined />
                </Box>
                <Box sx={{ textAlign: "right", padding: "0" }}>
                  <Typography sx={{ fontWeight: "100" }}>
                    Total Income
                  </Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "600" }}>
                    {total}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center",
                flexWrap: "wrap",
              }}
              item
              xs={12}
              sm={6}
              md={4}
            >
              <Box
                sx={{
                  border: "1px solid white",
                  color: "#53B789",
                  backgroundColor: "white",
                  boxShadow: "0 0 10px 10px #eeeeee ",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: { xs: 2, sm: 3 },
                  height: "100%",
                  width: "100%",
                }}
              >
                <Box>
                  <AccountTreeOutlined />
                </Box>
                <Box sx={{ textAlign: "right", padding: "0" }}>
                  <Typography sx={{ fontWeight: "100" }}>
                    Number of Products
                  </Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "600" }}>
                    {product.length}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center",
                flexWrap: "wrap",
              }}
              item
              xs={12}
              sm={6}
              md={4}
            >
              <Box
                sx={{
                  border: "1px solid white",
                  color: "#53B789",
                  backgroundColor: "white",
                  boxShadow: "0 0 10px 10px #eeeeee ",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: { xs: 2, sm: 3 },
                  height: "100%",
                  width: "100%",
                }}
              >
                <Box>
                  <PeopleAltOutlined />
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ fontWeight: "100" }}>
                    Total Customers
                  </Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "600" }}>
                    {client.length}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Plot
                data={[
                  {
                    x: date,
                    y: totalAmount,
                    type: "scatter",
                    mode: "lines+markers",
                    marker: { color: "rgb(25,255,140)" },
                    name: "Invoices",
                  },
                ]}
                layout={{
                  title: "TOTAL AMOUNT GENERATED PER MONTH",
                  width: 600,
                  height: 450,
                  xaxis: {
                    showgrid: true,
                    zeroline: false,
                  },
                  yaxis: { title: "Total Amount" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Plot
                data={[
                  {
                    y: count,
                    x: generatedDate,
                    type: "bar",
                    orientation: "x",
                    marker: {
                      color: [
                        "#99BC85",
                        "#C8E4B2",
                        "#9ED2BE",
                        "#7EAA92",
                        "#FFD9B7",
                      ],
                    },
                  },
                ]}
                layout={{
                  title: "TOTAL INVOICES PER MONTH",

                  width: 550,
                  height: 450,
                  xaxis: { title: "" },
                  yaxis: { title: "Number of Invoices" },
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Plot
                data={[
                  {
                    labels:items,
                    values: qty,
                    type: "pie",
                    marker: {
                      colors: ["#A6CF98", "#557C55", "#FA7070","#A6D0DD",'#FFD3B0'],
                    },
                  },
                ]}
                layout={{
                  title: "Products Sold",
                  width: 600,
                  height: 500,
                  // autosize:true,
                }}
              />
            </Grid>

            {/* <Grid item xs={12} sm={6}>

              <Box sx={{ marginTop: 5 }}>
                <PieChart />
              </Box>
            </Grid> */}
          </Grid>
        </Box>
      </Box>
    </>
  );
}
