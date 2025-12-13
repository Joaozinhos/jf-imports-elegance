import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = "Buscar por nome ou marca..." }: SearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 bg-secondary/50 border border-divider text-foreground placeholder:text-muted-foreground font-sans text-sm focus:outline-none focus:border-foreground transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Limpar busca"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
