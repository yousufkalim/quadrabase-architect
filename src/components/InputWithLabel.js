import React from "react";
import { TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  field: {
    width: "100%",
    marginBottom: "20px",
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#878289",
      },
    },
  },
  input: {
    height: "50px",
  },
  multilineInput: {
    height: "auto",
  },
}));

const InputWithLabel = ({
  value = "",
  label,
  required = false,
  name,
  type,
  autoFocus = false,
  placeholder = "",
  handleChange,
  error = false,
  errorMessage = "",
  multiline = false,
  min,
  max,
  style,
}) => {
  const classes = useStyles();

  if (type === "number") {
    return (
      <TextField
        error={error}
        value={value}
        helperText={errorMessage}
        autoFocus={autoFocus}
        required={required}
        id={name}
        name={name}
        min={min}
        max={max}
        label={label}
        type={type}
        className={classes.field}
        variant="outlined"
        InputProps={{
          className: classes.input,
          inputProps: { min: min, max: max },
        }}
        InputLabelProps={{
          shrink: true,
          style: { color: "#3b373c" },
        }}
        placeholder={placeholder}
        onChange={(e) => handleChange(e)}
        style={style}
      />
    );
  } else if (type === "file") {
    return (
      <TextField
        error={error}
        helperText={errorMessage}
        autoFocus={autoFocus}
        required={required}
        id={name}
        name={name}
        label={label}
        multiline={multiline}
        rows={multiline ? 4 : 1}
        type={type}
        className={classes.field}
        variant="outlined"
        InputProps={{
          className: multiline ? classes.multilineInput : classes.input,
        }}
        InputLabelProps={{
          shrink: true,
          style: { color: "#3b373c" },
        }}
        placeholder={placeholder}
        onChange={(e) => handleChange(e)}
        style={style}
      />
    );
  } else {
    return (
      <TextField
        value={value}
        error={error}
        helperText={errorMessage}
        autoFocus={autoFocus}
        required={required}
        id={name}
        name={name}
        label={label}
        multiline={multiline}
        rows={multiline ? 4 : 1}
        type={type}
        className={classes.field}
        variant="outlined"
        InputProps={{
          className: multiline ? classes.multilineInput : classes.input,
        }}
        InputLabelProps={{
          shrink: true,
          style: { color: "#3b373c" },
        }}
        placeholder={placeholder}
        onChange={(e) => handleChange(e)}
        style={style}
      />
    );
  }
};

export default InputWithLabel;
