import React, { useState, useEffect } from "react";
import Form from "./Form";
import { Routes, Route } from "react-router-dom";
import TableMethod from "./TableMethod";
import axios from "axios";
import base_url from "../utils/API";

export default function PayMethod() {
  let [data, setdata] = useState([]);
  let [edit, setEdit] = useState({});
  let [open, setOpen] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  function addData(data, editable) {
    if (editable) {
      axios
        .put(`${base_url}/client/payment_method/${edit.payment_method_id}`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          fetchData();
          setEdit({});
          setOpen(false);
        })
        .catch((error) => {
          console.log("error");
        });
    } else {
      console.log("*******************************",data)
      axios.post(`${base_url}/client/payment_method/`, data,{
        headers:{
          "Content-Type":"application/json",
        }
      })
        .then((response)=>{
          fetchData()
          setOpen(false)
        })
        .catch((error)=>{
          console.log("error");
        })
    }
  }
  function editData(data) {
    setEdit({ ...data });
    setOpen(true);
  }
  function deleteData(id) {
    axios
      .delete(`http://localhost:3000/Paymethod/${id}`)
      .then((response) => {
        fetchData();
        setdata(data.filter((e) => e.id !== id));
      })
      .catch((error) => {
        console.log("error");
      });
  }
  async function fetchData() {
    try {
      axios.defaults.headers.common["ngrok-skip-browser-warning"] = "any value";
      const response = await axios.get(`${base_url}/api/payment_method/`);
      setdata(response.data);
      console.log(response.data,'&^&*');
    } catch (error) {
      console.log("error");
    }
  }
  return (
    <>
      <Form
        open={open}
        onClose={() => setOpen(false)}
        addData={addData}
        edit={edit}
      />
      <Routes>
        <Route
          path="/"
          element={
            <TableMethod
              data={data}
              edit={editData}
              dlt={deleteData}
              setOpen={setOpen}
            />
          }
        />
      </Routes>
    </>
  );
}
