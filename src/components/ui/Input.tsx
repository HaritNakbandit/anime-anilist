import { TextField } from "@mui/material";

interface Props {
  id?: string;
  label: string;
  value: string;
  onChange: Function;
  setState: Function;
  field: string
}

const Input = (props: Props) => {
  return (
    <TextField
      id={props.id ?? "input-field"}
      value={props.value}
      label={props.label}
      variant="outlined"
      color="primary"
      focused 
      sx={{ width: 300 }}
      InputLabelProps={{
        shrink: true,
      }}
      onChange={(e) => {
        props.onChange(e.target.value, props.setState, props.field);
      }}
    />
  );
};
export default Input;
