import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function RowRadioButtonsGroup(props) {
  const { t } = useTranslation();
  return (
    <FormControl component="fieldset" disabled={props.disabled}>
      <Typography>{props.label}</Typography>
      <RadioGroup
        row={props.row}
        name="row-radio-buttons-group"
        value={props.value}
        style={{ fontSize: 10 }}
        name={props.name}
        onChange={props.handleChange}
      >
        {props.data.map((item) => {
          return (
            <FormControlLabel
              value={item.value}
              control={<Radio />}
              label={<div style={{ fontSize: 14 }}>{t(item.label)}</div>}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
}
