import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogFilters from "@/components/CatalogFilters";
import CatalogProductCard from "@/components/CatalogProductCard";
import SearchBar from "@/components/SearchBar";
import SortSelect, { SortOption } from "@/components/SortSelect";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X, Loader2 } from "lucide-react";
import { useProducts, useBrands } from "@/hooks/useProducts";

const Catalog = () => {
  const { data: products = [], isLoading } = useProducts();
  const brands = useBrands();
  
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBrand && matchesCategory && matchesPrice && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "year-desc":
          return b.year - a.year;
        case "year-asc":
          return a.year - b.year;
        default:
          return 0;
      }
    });
  }, [products, selectedBrands, selectedCategories, priceRange, searchQuery, sortBy]);

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setSearchQuery("");
  };

  const hasActiveFilters = selectedBrands.length > 0 || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000 || searchQuery !== "";

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-card">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <p className="text-muted-foreground tracking-[0.3em] uppercase text-xs font-sans mb-4">
              Catálogo Completo
            </p>
            <h1 className="text-4xl md:text-5xl font-display text-foreground mb-4">
              Nossa Coleção
            </h1>
            <p className="text-muted-foreground font-sans mb-8">
              Explore nossa seleção exclusiva de fragrâncias importadas.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden flex items-center justify-between gap-4">
                <Button
                  variant="premium-outline"
                  size="default"
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtros
                </Button>
                <SortSelect value={sortBy} onChange={setSortBy} />
              </div>

              {/* Mobile Filters Overlay */}
              <AnimatePresence>
                {isMobileFiltersOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-background lg:hidden"
                  >
                    <div className="flex items-center justify-between p-6 border-b border-divider">
                      <h2 className="text-lg font-display">Filtros</h2>
                      <button
                        onClick={() => setIsMobileFiltersOpen(false)}
                        className="p-2"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
                      <CatalogFilters
                        brands={brands}
                        selectedBrands={selectedBrands}
                        setSelectedBrands={setSelectedBrands}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        onClearAll={clearAllFilters}
                        hasActiveFilters={hasActiveFilters}
                      />
                      <Button
                        variant="premium"
                        size="lg"
                        className="w-full mt-8"
                        onClick={() => setIsMobileFiltersOpen(false)}
                      >
                        Ver {filteredAndSortedProducts.length} Resultado{filteredAndSortedProducts.length !== 1 && "s"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Desktop Filters Sidebar */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-28">
                  <CatalogFilters
                    brands={brands}
                    selectedBrands={selectedBrands}
                    setSelectedBrands={setSelectedBrands}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    onClearAll={clearAllFilters}
                    hasActiveFilters={hasActiveFilters}
                  />
                </div>
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                <div className="hidden lg:flex items-center justify-between mb-8">
                  <p className="text-muted-foreground text-sm">
                    {filteredAndSortedProducts.length} produto{filteredAndSortedProducts.length !== 1 && "s"} encontrado{filteredAndSortedProducts.length !== 1 && "s"}
                  </p>
                  <SortSelect value={sortBy} onChange={setSortBy} />
                </div>

                {filteredAndSortedProducts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <p className="text-muted-foreground font-sans mb-4">
                      Nenhum produto encontrado com os filtros selecionados.
                    </p>
                    <Button variant="premium-outline" onClick={clearAllFilters}>
                      Limpar Filtros
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredAndSortedProducts.map((product, index) => (
                        <CatalogProductCard
                          key={product.id}
                          product={product}
                          index={index}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Catalog;
