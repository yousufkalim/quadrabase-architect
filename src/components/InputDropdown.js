import React from "react";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Index(props) {
  const { t } = useTranslation();
  return (
    <div>
      <TextField
        name={props.name}
        label={props.label}
        onChange={props.onChange}
        select
        fullWidth
        disabled={props.disabled}
        SelectProps={{ native: true }}
        value={props.value}
        variant={props.variant ? props.variant : "outlined"}
        InputLabelProps={{
          shrink: true,
          style: { color: "#3b373c" },
        }}
        InputProps={{
          style: {
            height: props.height ? props.height : 50,
            backgroundColor: props.backgroundColor && props.backgroundColor,
          },
        }}
        required={props.required}
      >
        <option
          value={props.component === "register" ? 0 : ""}
          disabled={props.first === "notDisable" ? false : true}
        >
          {props.component === "register" ? "0" : t("Select An Option")}
        </option>

        {props?.options?.map((option) => (
          <option value={option._id}>
            {option.name
              ? option.name
              : option.title
              ? option.title
              : option.value
              ? option.value
              : option.text}
            {option.value && "%"}
          </option>
        ))}
      </TextField>
    </div>
  );
}
