import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogFilters from "@/components/CatalogFilters";
import CatalogProductCard from "@/components/CatalogProductCard";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: "masculino" | "feminino" | "unissex";
  description: string;
  size: string;
  image: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Sauvage",
    brand: "Dior",
    price: 699,
    category: "masculino",
    description: "Fragrância marcante e sofisticada",
    size: "100ml",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=800&fit=crop",
  },
  {
    id: "2",
    name: "Bleu de Chanel",
    brand: "Chanel",
    price: 789,
    category: "masculino",
    description: "Elegância atemporal em cada nota",
    size: "100ml",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop",
  },
  {
    id: "3",
    name: "La Vie Est Belle",
    brand: "Lancôme",
    price: 549,
    category: "feminino",
    description: "Doçura e feminilidade marcantes",
    size: "75ml",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=800&fit=crop",
  },
  {
    id: "4",
    name: "1 Million",
    brand: "Paco Rabanne",
    price: 459,
    category: "masculino",
    description: "Ousadia e poder em cada gota",
    size: "100ml",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=800&fit=crop",
  },
  {
    id: "5",
    name: "Good Girl",
    brand: "Carolina Herrera",
    price: 629,
    category: "feminino",
    description: "Dualidade entre luz e sombra",
    size: "80ml",
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&h=800&fit=crop",
  },
  {
    id: "6",
    name: "Acqua di Gio",
    brand: "Giorgio Armani",
    price: 529,
    category: "masculino",
    description: "Frescor mediterrâneo atemporal",
    size: "100ml",
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&h=800&fit=crop",
  },
  {
    id: "7",
    name: "J'adore",
    brand: "Dior",
    price: 719,
    category: "feminino",
    description: "Luxo floral absoluto",
    size: "100ml",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&h=800&fit=crop",
  },
  {
    id: "8",
    name: "CK One",
    brand: "Calvin Klein",
    price: 289,
    category: "unissex",
    description: "Minimalismo refrescante",
    size: "100ml",
    image: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=600&h=800&fit=crop",
  },
  {
    id: "9",
    name: "Black Opium",
    brand: "Yves Saint Laurent",
    price: 679,
    category: "feminino",
    description: "Intensidade viciante",
    size: "90ml",
    image: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=600&h=800&fit=crop",
  },
  {
    id: "10",
    name: "Invictus",
    brand: "Paco Rabanne",
    price: 479,
    category: "masculino",
    description: "Espírito de vitória",
    size: "100ml",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=800&fit=crop",
  },
  {
    id: "11",
    name: "Coco Mademoiselle",
    brand: "Chanel",
    price: 849,
    category: "feminino",
    description: "Sofisticação parisiense",
    size: "100ml",
    image: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=600&h=800&fit=crop",
  },
  {
    id: "12",
    name: "Le Male",
    brand: "Jean Paul Gaultier",
    price: 419,
    category: "masculino",
    description: "Clássico reinventado",
    size: "125ml",
    image: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=600&h=800&fit=crop",
  },
];

const brands = [...new Set(products.map((p) => p.brand))].sort();

const Catalog = () => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesBrand && matchesCategory && matchesPrice;
    });
  }, [selectedBrands, selectedCategories, priceRange]);

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
  };

  const hasActiveFilters = selectedBrands.length > 0 || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000;

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
            <p className="text-muted-foreground font-sans">
              Explore nossa seleção exclusiva de fragrâncias importadas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden flex items-center justify-between">
              <Button
                variant="premium-outline"
                size="default"
                onClick={() => setIsMobileFiltersOpen(true)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
              </Button>
              <p className="text-muted-foreground text-sm">
                {filteredProducts.length} produto{filteredProducts.length !== 1 && "s"}
              </p>
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
                      Ver {filteredProducts.length} Resultado{filteredProducts.length !== 1 && "s"}
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
                  {filteredProducts.length} produto{filteredProducts.length !== 1 && "s"} encontrado{filteredProducts.length !== 1 && "s"}
                </p>
              </div>

              {filteredProducts.length === 0 ? (
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
                    {filteredProducts.map((product, index) => (
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
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Catalog;