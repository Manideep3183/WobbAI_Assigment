interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      className="border p-2 w-80"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search influencers..."
    />
  );
}
