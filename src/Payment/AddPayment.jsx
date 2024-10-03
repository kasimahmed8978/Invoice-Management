import React, { useEffect, useState } from "react";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import PaymentForm from "./PaymentForm";
import PaymentTable from "./PaymentTable";
import base_url from "../utils/API";

export default function AddPayment() {
  let [data, setData] = useState([]);
  let [edit, setEdit] = useState({});
  let [open, setOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  function addData(data, editable) {
    if (editable) {
      axios
        .put(`${base_url}/api/payment/?update_payment=${edit.payment_id}`, data, {
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
          console.error("Error", error);
        });
    } else {
      axios
        .post(`${base_url}/api/payment/`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          fetchData();
          setOpen(false);
        })
        .catch((error) => {
          console.error("Error", error);
        });
    }
  }

  function editData(data) {
    setEdit({ ...data });
    setOpen(true);
  }

  function deleteData(id) {
    axios
      .delete(`${base_url}/api/payment/?delete=${id}`)
      .then((response) => {
        fetchData();
        setData(data.filter((e) => e.id !== id));
      })
      .catch((error) => {
        console.error("Error", error);
      });
  }

  async function fetchData() {
    try {
      axios.defaults.headers.common["ngrok-skip-browser-warning"] = "any value";
      const response = await axios.get(`${base_url}/api/payment/`);
      console.log(response.data,'%^%^&^&^&');
      setData(response.data);
    } catch (error) {
      console.error("Error", error);
    }
  }

  return (
    <>
      <PaymentForm
        open={open}
        onClose={() => setOpen(false)}
        addData={addData}
        edit={edit}
      />
      <Routes>
        <Route
          path="/"
          element={
            <PaymentTable
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