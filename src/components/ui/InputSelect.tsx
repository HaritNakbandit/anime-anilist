import { Autocomplete, TextField } from "@mui/material";

interface Options {
  label: string;
  value: string;
}

interface Props {
  id?: string;
  label: string;
  value: Options;
  options: Options[];
  onChange: Function;
  setState: Function;
  field: string
}

const InputSelect = (props: Props) => {
  return (
    <Autocomplete
      disablePortal
      value={props.value}
      onChange={(_, newValue: Options | null) => {
        props.onChange(newValue, props.setState, props.field);
      }}
      id={props.id ?? ""}
      options={props.options ?? []}
      getOptionLabel={(option) => option.label}
      sx={{ width: 200 }}
      renderInput={(params) => (
        <TextField {...params} label={props.label} focused />
      )}
    />
  );
};
export default InputSelect;
