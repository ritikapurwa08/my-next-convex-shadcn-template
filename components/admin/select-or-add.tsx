import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

interface SelectOrAddProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  onAddNew: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
}

export function SelectOrAdd({
  label,
  value,
  options,
  onChange,
  onAddNew,
  placeholder,
  disabled,
}: SelectOrAddProps) {
  const [adding, setAdding] = useState(false);
  const [newVal, setNewVal] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    const trimmed = newVal.trim();
    if (!trimmed) {
      setError("Name cannot be empty");
      return;
    }
    if (options.map((o) => o.toLowerCase()).includes(trimmed.toLowerCase())) {
      setError("Already exists");
      return;
    }
    onAddNew(trimmed);
    setAdding(false);
    setNewVal("");
    setError("");
  };

  if (adding) {
    return (
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest block">
          {label}{" "}
          <span className="text-primary normal-case font-normal">(new)</span>
        </label>
        <input
          autoFocus
          type="text"
          value={newVal}
          placeholder={placeholder}
          onChange={(e) => {
            setNewVal(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleConfirm();
            if (e.key === "Escape") {
              setAdding(false);
              setNewVal("");
              setError("");
            }
          }}
          className="w-full bg-surface-container-lowest border border-primary/40 rounded-xl p-3 text-sm outline-none text-on-surface focus:border-primary transition-colors"
        />
        {error && <p className="text-xs text-error">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:shadow-md transition-all"
          >
            ✓ Add
          </button>
          <button
            onClick={() => {
              setAdding(false);
              setNewVal("");
              setError("");
            }}
            className="flex-1 py-2 rounded-xl border border-outline-variant/30 text-xs font-bold text-secondary hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-secondary uppercase tracking-widest block">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.value === "__ADD__") setAdding(true);
            else onChange(e.target.value);
          }}
          className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-3 text-sm outline-none appearance-none text-on-surface cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
          <option disabled>──────────</option>
          <option value="__ADD__">+ Add New {label}</option>
        </select>
        <MaterialIcon
          name="expand_more"
          className="absolute right-3 top-3.5 pointer-events-none text-outline text-lg"
        />
      </div>
    </div>
  );
}
