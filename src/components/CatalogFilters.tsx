import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface CatalogFiltersProps {
  brands: string[];
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

const categories = [
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Feminino" },
  { value: "unissex", label: "Unissex" },
];

const CatalogFilters = ({
  brands,
  selectedBrands,
  setSelectedBrands,
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setPriceRange,
  onClearAll,
  hasActiveFilters,
}: CatalogFiltersProps) => {
  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm tracking-[0.2em] uppercase font-sans text-foreground">
          Filtros
        </h3>
        {hasActiveFilters && (
          <Button
            variant="premium-ghost"
            size="sm"
            onClick={onClearAll}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            Limpar
          </Button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs tracking-[0.15em] uppercase font-sans text-muted-foreground mb-4">
          Categoria
        </h4>
        <div className="space-y-3">
          {categories.map((category) => (
            <label
              key={category.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={selectedCategories.includes(category.value)}
                onCheckedChange={() => toggleCategory(category.value)}
                className="border-foreground/30 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
              />
              <span className="text-sm font-sans text-foreground/80 group-hover:text-foreground transition-colors">
                {category.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-divider" />

      {/* Brands */}
      <div>
        <h4 className="text-xs tracking-[0.15em] uppercase font-sans text-muted-foreground mb-4">
          Marca
        </h4>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
                className="border-foreground/30 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
              />
              <span className="text-sm font-sans text-foreground/80 group-hover:text-foreground transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-divider" />

      {/* Price Range */}
      <div>
        <h4 className="text-xs tracking-[0.15em] uppercase font-sans text-muted-foreground mb-4">
          Faixa de Preço
        </h4>
        <div className="px-1">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            min={0}
            max={1000}
            step={50}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm font-sans text-foreground/80">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogFilters;