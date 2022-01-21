// init
import React, { useState } from "react";
import api from "../../../api";
import { toast } from "react-toastify";

// component
import InputWithLabel from "../../../components/InputWithLabel";
import { Button } from "@mui/material";

// Forget Password Modal
const ForgetPasswordModal = ({ handleOpenModal }) => {
  // States
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // onSubmit
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        email: email,
      };
      const result = await api("post", `/Architects/forgotPassword`, data);
      toast.success(result.data.message);
      handleOpenModal();
    } catch (err) {
      setLoading(false);
    }
  };

  // jsx
  return (
    <div>
      {/* Login form */}
      <form onSubmit={onSubmit}>
        <br />
        <InputWithLabel
          value={email}
          label="Email"
          name="email"
          type="email"
          handleChange={(e) => setEmail(e.target.value)}
          style={{ width: 450 }}
        />
        <br />
        <br />
        <div style={{ width: "104.5%", textAlign: "right" }}>
          <Button
            variant="contained"
            color="primary"
            style={{
              marginRight: 20,
              backgroundColor: !loading ? "#3b373c" : "lightgray",
            }}
            type="submit"
            disabled={loading}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ForgetPasswordModal;
