import * as React from "react";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect(props) {
  const theme = useTheme();

  return (
    <div>
      <FormControl sx={{ width: "100%" }}>
        <InputLabel
          id="demo-multiple-name-label"
          shrink={true}
          style={{ color: "#3b373c", backgroundColor: "white" }}
        >
          {props.label}
        </InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          required={props.required}
          value={props.value}
          onChange={props.handleChange}
          input={<OutlinedInput label={props.label} />}
          MenuProps={MenuProps}
          sx={{
            height: 50,
          }}
        >
          {props.options &&
            props.options.map((option) => (
              <MenuItem
                key={option._id}
                value={option._id}
                style={getStyles(option._id, props.value, theme)}
              >
                {option.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
}
