import { ChevronDown } from "lucide-react";

interface Options {
  label: string;
  value: string;
}

interface Props {
  id?: string;
  label: string;
  value: Options | null;
  options: Options[];
  onChange: (value: string) => void;
  setState: React.Dispatch<React.SetStateAction<Options | null>>;
  field: string;
  /** If true, the first option is a placeholder; otherwise the current value is pre-selected. */
  hasPlaceholder?: boolean;
}

const InputSelect = ({ id, label, value, options, onChange, setState, field, hasPlaceholder = true }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Notify parent immediately so the query refetches on change.
    onChange(e.target.value);
    // Keep local state in sync with the selected option (or null for placeholder).
    setState(options.find(opt => opt.value === e.target.value) || null);
  };

  return (
    <div className="flex w-full flex-col gap-1 sm:w-[220px]">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-navy-textSecondary dark:text-navyDark-textSecondary">{label}</label>
      <div className="relative">
        <select
          id={id ?? ""}
          value={value?.value ?? ""}
          onChange={handleChange}
          className="h-[40px] w-full appearance-none rounded-lg border border-navy-border bg-white px-3 pr-8 text-sm font-medium text-navy-textPrimary shadow-sm transition-shadow focus:border-navy-primary focus:outline-none focus:ring-1 focus:ring-navy-primary dark:border-navyDark-border dark:bg-navyDark-paper dark:text-navyDark-textPrimary"
        >
          {hasPlaceholder && <option value="">{label}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <ChevronDown className="h-4 w-4 text-navy-textSecondary dark:text-navyDark-textSecondary" />
        </div>
      </div>
    </div>
  );
};

export default InputSelect;