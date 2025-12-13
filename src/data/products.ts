export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: "masculino" | "feminino" | "unissex";
  description: string;
  size: string;
  image: string;
  images: string[];
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  concentration: string;
  year: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Sauvage",
    brand: "Dior",
    price: 699,
    category: "masculino",
    description: "Fragrância marcante e sofisticada com notas selvagens e frescas que evocam paisagens desérticas ao entardecer.",
    size: "100ml",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=800&fit=crop",
    ],
    notes: {
      top: ["Bergamota", "Pimenta"],
      heart: ["Lavanda", "Pimenta Sichuan", "Gerânio"],
      base: ["Ambroxan", "Cedro", "Labdanum"],
    },
    concentration: "Eau de Toilette",
    year: 2015,
  },
  {
    id: "2",
    name: "Bleu de Chanel",
    brand: "Chanel",
    price: 789,
    category: "masculino",
    description: "Elegância atemporal em cada nota. Uma fragrância aromática-amadeirada que expressa liberdade e determinação.",
    size: "100ml",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=800&fit=crop",
    ],
    notes: {
      top: ["Limão", "Menta", "Toranja Rosa"],
      heart: ["Gengibre", "Noz-Moscada", "Jasmim"],
      base: ["Incenso", "Cedro", "Sândalo"],
    },
    concentration: "Eau de Parfum",
    year: 2010,
  },
  {
    id: "3",
    name: "La Vie Est Belle",
    brand: "Lancôme",
    price: 549,
    category: "feminino",
    description: "Doçura e feminilidade marcantes em uma composição floral gourmand que celebra a felicidade e a liberdade.",
    size: "75ml",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=600&h=800&fit=crop",
    ],
    notes: {
      top: ["Groselha Preta", "Pera"],
      heart: ["Íris", "Jasmim", "Flor de Laranjeira"],
      base: ["Pralinê", "Baunilha", "Patchouli"],
    },
    concentration: "Eau de Parfum",
    year: 2012,
  },
  {
    id: "4",
    name: "1 Million",
    brand: "Paco Rabanne",
    price: 459,
    category: "masculino",
    description: "Ousadia e poder em cada gota. Uma fragrância especiada e amadeirada que simboliza sucesso e sedução.",
    size: "100ml",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop",
    ],
    notes: {
      top: ["Toranja", "Menta", "Notas Sanguíneas"],
      heart: ["Rosa", "Canela", "Especiarias"],
      base: ["Couro", "Madeira", "Âmbar"],
    },
    concentration: "Eau de Toilette",
    year: 2008,
  },
  {
    id: "5",
    name: "Good Girl",
    brand: "Carolina Herrera",
    price: 629,
    category: "feminino",
    description: "Dualidade entre luz e sombra. Uma fragrância oriental floral que revela a mulher boa e a rebelde em perfeita harmonia.",
    size: "80ml",
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&h=800&fit=crop",
    ],
    notes: {
      top: ["Amêndoa", "Café"],
      heart: ["Tuberosa", "Jasmim Sambac"],
      base: ["Cacau", "Tonka", "Sândalo"],
    },
    concentration: "Eau de Parfum",
    year: 2016,
  },
  {
    id: "6",
    name: "Acqua di Gio",
    brand: "Giorgio Armani",
    price: 529,
    category: "masculino",
    description: "Frescor mediterrâneo atemporal inspirado nas águas cristalinas de Pantelleria, capturando a essência do verão.",
    size: "100ml",
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=800&fit=crop",
    ],
    notes: {
      top: ["Limão Calabrês", "Bergamota", "Neroli"],
      heart: ["Jasmim", "Alecrim", "Caqui"],
      base: ["Cedro", "Musgo", "Âmbar Branco"],
    },
    concentration: "Eau de Toilette",
    year: 1996,
  },
  {
    id: "7",
    name: "J'adore",
    brand: "Dior",
    price: 719,
    category: "feminino",
    description: "Luxo floral absoluto. Um buquê de flores preciosas que encarna a feminilidade e a elegância francesa.",
    size: "100ml",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=600&h=800&fit=crop",
    ],
    notes: {
      top: ["Ylang-Ylang", "Magnólia", "Pera"],
      heart: ["Rosa de Damasco", "Jasmim Sambac"],
      base: ["Sândalo", "Almíscar", "Baunilha"],
    },
    concentration: "Eau de Parfum",
    year: 1999,
  },
  {
    id: "8",
    name: "CK One",
    brand: "Calvin Klein",
    price: 289,
    category: "unissex",
    description: "Minimalismo refrescante. O pioneiro das fragrâncias unissex que revolucionou a perfumaria nos anos 90.",
    size: "100ml",
    image: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop",
    ],
    notes: {
      top: ["Bergamota", "Cardamomo", "Papaia"],
      heart: ["Violeta", "Rosa", "Noz-Moscada"],
      base: ["Almíscar", "Cedro", "Âmbar"],
    },
    concentration: "Eau de Toilette",
    year: 1994,
  },
  {
    id: "9",
    name: "Black Opium",
    brand: "Yves Saint Laurent",
    price: 679,
    category: "feminino",
    description: "Intensidade viciante. Uma fragrância oriental que combina café e flores brancas em uma mistura irresistível.",
    size: "90ml",
    image: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=600&h=800&fit=crop",
    ],
    notes: {
      top: ["Pera", "Café", "Pimenta Rosa"],
      heart: ["Flor de Laranjeira", "Jasmim"],
      base: ["Baunilha", "Patchouli", "Cedro"],
    },
    concentration: "Eau de Parfum",
    year: 2014,
  },
  {
    id: "10",
    name: "Invictus",
    brand: "Paco Rabanne",
    price: 479,
    category: "masculino",
    description: "Espírito de vitória. Uma fragrância aquática-amadeirada que celebra a força e a determinação.",
    size: "100ml",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=800&fit=crop",
    ],
    notes: {
      top: ["Toranja", "Mandarina", "Notas Marinhas"],
      heart: ["Louro", "Jasmim"],
      base: ["Guaiaco", "Patchouli", "Âmbar Cinza"],
    },
    concentration: "Eau de Toilette",
    year: 2013,
  },
  {
    id: "11",
    name: "Coco Mademoiselle",
    brand: "Chanel",
    price: 849,
    category: "feminino",
    description: "Sofisticação parisiense. Uma fragrância oriental fresca que combina frescor cítrico com sensualidade.",
    size: "100ml",
    image: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=800&fit=crop",
    ],
    notes: {
      top: ["Laranja", "Bergamota", "Toranja"],
      heart: ["Rosa", "Jasmim", "Lichia"],
      base: ["Patchouli", "Vetiver", "Baunilha"],
    },
    concentration: "Eau de Parfum",
    year: 2001,
  },
  {
    id: "12",
    name: "Le Male",
    brand: "Jean Paul Gaultier",
    price: 419,
    category: "masculino",
    description: "Clássico reinventado. Uma fragrância oriental fougère que equilibra força e sensualidade com maestria.",
    size: "125ml",
    image: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=800&fit=crop",
    ],
    notes: {
      top: ["Lavanda", "Menta", "Cardamomo"],
      heart: ["Flor de Laranjeira", "Cominho", "Canela"],
      base: ["Baunilha", "Sândalo", "Tonka"],
    },
    concentration: "Eau de Toilette",
    year: 1995,
  },
];

export const brands = [...new Set(products.map((p) => p.brand))].sort();
