import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { AlertCircle, ChevronDown } from "lucide-react";

const controlBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-ink outline-none transition duration-200 placeholder:text-slateink/50";

function stateClasses(hasError: boolean) {
  return hasError
    ? "border-sunset focus:border-sunset focus:ring-4 focus:ring-sunset/15"
    : "border-hairline hover:border-slateink/40 focus:border-aiesec focus:ring-4 focus:ring-aiesec/15";
}

// Same visual states, but keyed on focus-within so the ring lives on the
// wrapper when the inner input (next to a prefix chip) is focused.
function wrapperStateClasses(hasError: boolean) {
  return hasError
    ? "border-sunset focus-within:border-sunset focus-within:ring-4 focus-within:ring-sunset/15"
    : "border-hairline hover:border-slateink/40 focus-within:border-aiesec focus-within:ring-4 focus-within:ring-aiesec/15";
}

type ShellProps = {
  id: string;
  label: string;
  error?: string;
  children: (a11y: { "aria-invalid": boolean; "aria-describedby"?: string }) => ReactNode;
};

function FieldShell({ id, label, error, children }: ShellProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-ink">
        {label}
      </label>
      {children({
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? errorId : undefined,
      })}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-sunset"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  type?: "text" | "email" | "tel";
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
  /** A fixed, non-editable leading chip (e.g. "+216") shown inside the field. */
  prefix?: string;
};

export function TextField({
  id,
  label,
  registration,
  error,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  prefix,
}: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error}>
      {(a11y) =>
        prefix ? (
          <div
            className={`flex items-stretch overflow-hidden rounded-xl border bg-white transition duration-200 ${wrapperStateClasses(
              Boolean(error),
            )}`}
          >
            <span className="flex select-none items-center border-r border-hairline bg-mist/70 px-3.5 font-medium text-slateink">
              {prefix}
            </span>
            <input
              id={id}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              inputMode={inputMode}
              className="w-full bg-transparent px-4 py-3 text-ink outline-none placeholder:text-slateink/50"
              {...a11y}
              {...registration}
            />
          </div>
        ) : (
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            inputMode={inputMode}
            className={`${controlBase} ${stateClasses(Boolean(error))}`}
            {...a11y}
            {...registration}
          />
        )
      }
    </FieldShell>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  placeholder: string;
  options: readonly string[];
};

export function SelectField({
  id,
  label,
  registration,
  error,
  placeholder,
  options,
}: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error}>
      {(a11y) => (
        <div className="relative">
          <select
            id={id}
            defaultValue=""
            className={`${controlBase} ${stateClasses(Boolean(error))} appearance-none pr-11`}
            {...a11y}
            {...registration}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slateink"
            aria-hidden
          />
        </div>
      )}
    </FieldShell>
  );
}
