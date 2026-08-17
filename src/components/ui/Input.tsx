import { Search } from "lucide-react";

interface Props {
  id?: string;
  label: string;
  value: string;
  onChange: Function;
  setState: Function;
  field: string;
  /** If provided, show a search button and submit on Enter. */
  onSubmit?: (value: string) => void;
}

const Input = ({ id, label, value, onChange, setState, field, onSubmit }: Props) => {
  const inputId = id ?? "input-field";

  return (
    <div className="flex w-full items-center gap-2">
      <label htmlFor={inputId} className="sr-only">{label}</label>
      <div className="relative flex flex-1 items-center gap-2">
        <div className="flex h-[40px] flex-1 items-center gap-2 rounded-lg border border-navy-border bg-white px-3 text-sm font-medium text-navy-textPrimary shadow-sm transition-shadow focus-within:border-navy-primary focus-within:outline-none focus-within:ring-1 focus-within:ring-navy-primary dark:border-navyDark-border dark:bg-navyDark-paper dark:text-navyDark-textPrimary">
          <Search className="h-[18px] w-[18px] shrink-0 text-navy-textSecondary dark:text-navyDark-textSecondary" />
          <input
            id={inputId}
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setState(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && onSubmit) {
                onSubmit(value);
              }
            }}
            placeholder={`Search ${label.toLowerCase()}`}
            className="h-full w-full bg-transparent placeholder:text-navy-textSecondary outline-none dark:placeholder:text-navyDark-textSecondary"
          />
        </div>
        {onSubmit && (
          <button
            type="button"
            onClick={() => onSubmit(value)}
            aria-label={label}
            className="flex h-[40px] shrink-0 items-center gap-1.5 rounded-lg bg-navy-primary px-3 text-sm font-semibold text-white shadow-sm transition-shadow hover:shadow-md dark:bg-navyDark-secondary"
          >
            <Search className="h-[18px] w-[18px]" />
            <span>{label}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;