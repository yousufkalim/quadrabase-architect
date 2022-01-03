import React from "react";
import { TextField } from "@mui/material";

export default function index(props) {
  return (
    <div>
      <TextField
        name={props.name}
        label={props.label}
        onChange={props.onChange}
        select
        fullWidth
        SelectProps={{ native: true }}
        value={props.value}
        variant={props.variant ? props.variant : "outlined"}
        InputLabelProps={{
          shrink: true,
          style: { color: "#3b373c" },
        }}
        InputProps={{
          style: { height: 50 },
        }}
        required={props.required}
      >
        <option value="">Select An Option</option>

        {props?.options?.map((option) => (
          <option value={option._id}>{option.name}</option>
        ))}
      </TextField>
    </div>
  );
}
