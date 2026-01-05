import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/hooks/useCart";
import { useLoyaltyPoints } from "@/hooks/useLoyaltyPoints";
import CouponInput from "@/components/CouponInput";
import ShippingCalculator from "@/components/ShippingCalculator";
import SecurityBadges from "@/components/SecurityBadges";
import LoyaltyPointsCard from "@/components/LoyaltyPointsCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  CreditCard, 
  QrCode, 
  FileText, 
  Loader2, 
  ShoppingBag,
  Lock,
  ArrowLeft
} from "lucide-react";
import { z } from "zod";
import { Link } from "react-router-dom";

const customerSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  cep: z.string().length(8, "CEP deve ter 8 dígitos"),
  address: z.string().min(5, "Endereço inválido"),
  number: z.string().min(1, "Número obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro inválido"),
  city: z.string().min(2, "Cidade inválida"),
  state: z.string().length(2, "Estado deve ter 2 letras"),
});

interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  min_purchase: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { getCartProducts, getTotal, clearCart } = useCart();
  const { addPoints, calculatePointsFromPurchase } = useLoyaltyPoints();
  const cartProducts = getCartProducts();
  const subtotal = getTotal();

  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix" | "boleto">("pix");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cep: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    switch (appliedCoupon.type) {
      case "percentage":
        return (subtotal * appliedCoupon.value) / 100;
      case "fixed":
        return appliedCoupon.value;
      case "free_shipping":
        return shippingCost;
      default:
        return 0;
    }
  };

  const discount = calculateDiscount() + loyaltyDiscount;
  const finalShipping = appliedCoupon?.type === "free_shipping" ? 0 : shippingCost;
  const total = subtotal - discount + finalShipping;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const fetchAddressByCep = async (cep: string) => {
    if (cep.length !== 8) return;
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          address: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
        }));
      }
    } catch (err) {
      console.error("Error fetching address:", err);
    }
  };

  const handleSubmit = async () => {
    // Validate form
    const validation = customerSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast.error("Preencha todos os campos corretamente");
      return;
    }

    if (cartProducts.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }

    setLoading(true);
    try {
      // Create payment with Mercado Pago
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke(
        "create-payment",
        {
          body: {
            items: cartProducts.map(item => ({
              id: item.id,
              title: `${item.brand} - ${item.name}`,
              quantity: item.quantity,
              unit_price: item.price,
            })),
            payer: {
              email: formData.email,
              name: formData.name,
            },
            payment_method: paymentMethod,
            shipping_cost: finalShipping,
            coupon_code: appliedCoupon?.code,
            discount_amount: discount,
          },
        }
      );

      if (paymentError) throw paymentError;

      const fullAddress = `${formData.address}, ${formData.number}${formData.complement ? ` - ${formData.complement}` : ""}, ${formData.neighborhood}, ${formData.city} - ${formData.state}, CEP: ${formData.cep}`;
      
      const orderItems = cartProducts.map(item => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
      }));

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([{
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_cep: formData.cep,
          customer_address: fullAddress,
          items: orderItems as unknown as any,
          total_amount: total,
          shipping_amount: finalShipping,
          payment_method: paymentMethod,
          notes: appliedCoupon ? `Cupom: ${appliedCoupon.code}` : null,
          order_number: `JF${Date.now()}`,
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Add loyalty points
      const pointsEarned = calculatePointsFromPurchase(total);
      if (pointsEarned > 0) {
        await addPoints(formData.email, total, orderData.id);
      }

      // Send confirmation email
      await supabase.functions.invoke("send-order-email", {
        body: {
          type: "confirmation",
          order: {
            ...orderData,
            items: orderItems,
          },
        },
      });

      // Redirect based on payment method
      if (paymentData?.init_point) {
        window.location.href = paymentData.init_point;
      } else {
        clearCart();
        navigate(`/pedido/${orderData.order_number}`);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Erro ao processar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (cartProducts.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="pt-28 pb-20">
          <div className="container mx-auto px-6">
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
              <h2 className="text-2xl font-display text-foreground mb-4">
                Seu carrinho está vazio
              </h2>
              <Link to="/catalogo">
                <Button variant="premium" size="lg">Explorar Catálogo</Button>
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-8 bg-secondary/30">
        <div className="container mx-auto px-6">
          <Link 
            to="/carrinho" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Carrinho
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-primary" />
              <span className="text-primary tracking-[0.2em] uppercase text-xs font-medium">
                Checkout Seguro
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display text-foreground">
              Finalizar Compra
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Customer Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-secondary/30 border border-divider p-6"
              >
                <h2 className="text-xl font-display text-foreground mb-6">
                  Dados Pessoais
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, ""))}
                      placeholder="11999999999"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </motion.div>

              {/* Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-secondary/30 border border-divider p-6"
              >
                <h2 className="text-xl font-display text-foreground mb-6">
                  Endereço de Entrega
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cep">CEP *</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => {
                        const cep = e.target.value.replace(/\D/g, "").slice(0, 8);
                        handleInputChange("cep", cep);
                        fetchAddressByCep(cep);
                      }}
                      placeholder="00000000"
                      className={errors.cep ? "border-red-500" : ""}
                    />
                    {errors.cep && <p className="text-red-500 text-xs mt-1">{errors.cep}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address">Endereço *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <Label htmlFor="number">Número *</Label>
                    <Input
                      id="number"
                      value={formData.number}
                      onChange={(e) => handleInputChange("number", e.target.value)}
                      className={errors.number ? "border-red-500" : ""}
                    />
                    {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
                  </div>
                  <div>
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      value={formData.complement}
                      onChange={(e) => handleInputChange("complement", e.target.value)}
                      placeholder="Apto, Bloco, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="neighborhood">Bairro *</Label>
                    <Input
                      id="neighborhood"
                      value={formData.neighborhood}
                      onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                      className={errors.neighborhood ? "border-red-500" : ""}
                    />
                    {errors.neighborhood && <p className="text-red-500 text-xs mt-1">{errors.neighborhood}</p>}
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value.toUpperCase().slice(0, 2))}
                      placeholder="SP"
                      maxLength={2}
                      className={errors.state ? "border-red-500" : ""}
                    />
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-secondary/30 border border-divider p-6"
              >
                <h2 className="text-xl font-display text-foreground mb-6">
                  Forma de Pagamento
                </h2>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as "card" | "pix" | "boleto")}
                  className="space-y-3"
                >
                  <label
                    className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${
                      paymentMethod === "pix" 
                        ? "border-primary bg-primary/5" 
                        : "border-divider hover:border-muted-foreground"
                    }`}
                  >
                    <RadioGroupItem value="pix" id="pix" />
                    <QrCode className="w-6 h-6 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">PIX</p>
                      <p className="text-sm text-muted-foreground">Aprovação instantânea</p>
                    </div>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      Recomendado
                    </span>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${
                      paymentMethod === "card" 
                        ? "border-primary bg-primary/5" 
                        : "border-divider hover:border-muted-foreground"
                    }`}
                  >
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="w-6 h-6 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Cartão de Crédito</p>
                      <p className="text-sm text-muted-foreground">Parcele em até 12x</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${
                      paymentMethod === "boleto" 
                        ? "border-primary bg-primary/5" 
                        : "border-divider hover:border-muted-foreground"
                    }`}
                  >
                    <RadioGroupItem value="boleto" id="boleto" />
                    <FileText className="w-6 h-6 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Boleto Bancário</p>
                      <p className="text-sm text-muted-foreground">Vencimento em 3 dias úteis</p>
                    </div>
                  </label>
                </RadioGroup>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="sticky top-28 bg-secondary/30 border border-divider p-6 space-y-6"
              >
                <h2 className="text-xl font-display text-foreground">
                  Resumo do Pedido
                </h2>

                {/* Items */}
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {cartProducts.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-16 bg-secondary/50 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">{item.brand}</p>
                        <p className="text-sm text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Loyalty Points */}
                {formData.email && (
                  <LoyaltyPointsCard
                    email={formData.email}
                    subtotal={subtotal}
                    onApplyDiscount={(discount) => setLoyaltyDiscount(discount)}
                  />
                )}

                {/* Coupon */}
                <CouponInput
                  subtotal={subtotal}
                  appliedCoupon={appliedCoupon}
                  onApplyCoupon={setAppliedCoupon}
                />

                {/* Shipping */}
                <div className="border-t border-divider pt-4">
                  <ShippingCalculator
                    productValue={subtotal}
                    onShippingSelect={(cost) => setShippingCost(cost)}
                    compact
                  />
                </div>

                {/* Totals */}
                <div className="border-t border-divider pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-primary">Desconto</span>
                      <span className="text-primary">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="text-foreground">
                      {finalShipping === 0 ? "Grátis" : formatPrice(finalShipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-medium pt-2 border-t border-divider">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  variant="premium"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Finalizar Pedido
                    </>
                  )}
                </Button>

                <SecurityBadges compact />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Checkout;
