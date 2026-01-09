import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Package,
} from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  description: string | null;
  size: string;
  image: string;
  images: string[];
  notes: any;
  concentration: string | null;
  year: number | null;
  stock: number;
  active: boolean;
  created_at: string;
}

interface AdminProductsTabProps {
  products: Product[];
  loading: boolean;
  onRefresh: () => void;
  onCreateProduct: (product: any) => Promise<void>;
  onUpdateProduct: (id: string, updates: any) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onToggleProduct: (id: string, active: boolean) => Promise<void>;
  formatPrice: (value: number) => string;
}

const emptyForm = {
  name: "",
  brand: "",
  price: "",
  category: "masculino",
  description: "",
  size: "",
  image: "",
  concentration: "",
  year: "",
  stock: "0",
};

const AdminProductsTab = ({
  products,
  loading,
  onRefresh,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onToggleProduct,
  formatPrice,
}: AdminProductsTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      brand: product.brand,
      price: product.price.toString(),
      category: product.category,
      description: product.description || "",
      size: product.size,
      image: product.image,
      concentration: product.concentration || "",
      year: product.year?.toString() || "",
      stock: product.stock.toString(),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.brand || !form.price || !form.size || !form.image) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const productData = {
      name: form.name,
      brand: form.brand,
      price: parseFloat(form.price),
      category: form.category,
      description: form.description || null,
      size: form.size,
      image: form.image,
      images: [form.image],
      notes: {},
      concentration: form.concentration || null,
      year: form.year ? parseInt(form.year) : null,
      stock: parseInt(form.stock) || 0,
      active: true,
    };

    try {
      if (editingProduct) {
        await onUpdateProduct(editingProduct.id, productData);
        toast.success("Produto atualizado!");
      } else {
        await onCreateProduct(productData);
        toast.success("Produto criado!");
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Erro ao salvar produto");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este produto?")) return;
    
    try {
      await onDeleteProduct(id);
      toast.success("Produto excluído!");
    } catch (error) {
      toast.error("Erro ao excluir produto");
    }
  };

  const handleToggle = async (product: Product) => {
    try {
      await onToggleProduct(product.id, !product.active);
      toast.success(product.active ? "Produto desativado" : "Produto ativado");
    } catch (error) {
      toast.error("Erro ao atualizar produto");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="premium"
            className="gap-2"
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Novo Produto
          </Button>
          <Button variant="outline" onClick={onRefresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-secondary/30 border border-divider p-4">
          <p className="text-2xl font-bold text-foreground">{products.length}</p>
          <p className="text-sm text-muted-foreground">Total de Produtos</p>
        </div>
        <div className="bg-secondary/30 border border-divider p-4">
          <p className="text-2xl font-bold text-foreground">
            {products.filter((p) => p.active).length}
          </p>
          <p className="text-sm text-muted-foreground">Produtos Ativos</p>
        </div>
        <div className="bg-secondary/30 border border-divider p-4">
          <p className="text-2xl font-bold text-foreground">
            {products.filter((p) => p.stock <= 5).length}
          </p>
          <p className="text-sm text-muted-foreground">Estoque Baixo</p>
        </div>
        <div className="bg-secondary/30 border border-divider p-4">
          <p className="text-2xl font-bold text-foreground">
            {products.reduce((sum, p) => sum + p.stock, 0)}
          </p>
          <p className="text-sm text-muted-foreground">Unidades em Estoque</p>
        </div>
      </div>

      {/* Table */}
      <div className="border border-divider overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.size}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell className="capitalize">{product.category}</TableCell>
                <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded ${
                      product.stock <= 5
                        ? "bg-red-500/10 text-red-500"
                        : "bg-green-500/10 text-green-500"
                    }`}
                  >
                    <Package className="w-3 h-3" />
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggle(product)}
                    className={
                      product.active
                        ? "text-green-500 hover:text-green-600"
                        : "text-red-500 hover:text-red-600"
                    }
                  >
                    {product.active ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(product)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Mostrando {filteredProducts.length} de {products.length} produtos
      </p>

      {/* Product Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nome do perfume"
                />
              </div>
              <div>
                <Label>Marca *</Label>
                <Input
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="Ex: Dior"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Preço (R$) *</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Tamanho *</Label>
                <Input
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                  placeholder="Ex: 100ml"
                />
              </div>
              <div>
                <Label>Estoque</Label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Categoria *</Label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full mt-1 p-2 border border-divider bg-background rounded"
                >
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="unissex">Unissex</option>
                </select>
              </div>
              <div>
                <Label>Concentração</Label>
                <Input
                  value={form.concentration}
                  onChange={(e) => setForm({ ...form, concentration: e.target.value })}
                  placeholder="Ex: Eau de Parfum"
                />
              </div>
              <div>
                <Label>Ano</Label>
                <Input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  placeholder="Ex: 2020"
                />
              </div>
            </div>

            <div>
              <Label>URL da Imagem *</Label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
              />
              {form.image && (
                <img
                  src={form.image}
                  alt="Preview"
                  className="mt-2 w-20 h-20 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Descrição do perfume..."
                rows={3}
              />
            </div>

            <Button variant="premium" className="w-full" onClick={handleSave}>
              {editingProduct ? "Atualizar" : "Criar"} Produto
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProductsTab;
