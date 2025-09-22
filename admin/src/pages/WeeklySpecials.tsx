import { useState, useEffect } from 'react';
import { supabaseAdmin } from '../lib/supabase';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, GripVertical, Settings, Image } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

interface WeeklySpecial {
  id: string;
  product_id: string;
  sort_order: number;
  is_active: boolean;
  week_of: string;
  created_at: string;
  products?: {
    name: string;
    description: string;
    product_images?: { url: string }[];
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

const WeeklySpecials = () => {
  const [specials, setSpecials] = useState<WeeklySpecial[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSpecial, setEditingSpecial] = useState<WeeklySpecial | null>(null);
  const [formData, setFormData] = useState({
    product_id: '',
    sort_order: '',
    is_active: true,
    week_of: '',
  });
  const [productImages, setProductImages] = useState<{ url: string; alt_text: string; sort_order: number; }[]>([]);
  const [migrating, setMigrating] = useState(false);

  useEffect(() => {
    fetchSpecials();
    fetchProducts();
  }, []);

  const fetchSpecials = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('weekly_specials')
        .select(`
          *,
          products (
            name,
            description,
            product_images (url)
          )
        `)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setSpecials(data || []);
    } catch (error) {
      console.error('Error fetching weekly specials:', error);
      toast.error('Erro ao carregar ofertas semanais');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('id, name, description, is_active')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const specialData = {
        ...formData,
        sort_order: parseInt(formData.sort_order) || 0,
        week_of: formData.week_of || null,
      };

      if (editingSpecial) {
        const { error } = await supabaseAdmin
          .from('weekly_specials')
          .update(specialData)
          .eq('id', editingSpecial.id);

        if (error) throw error;
        toast.success('Oferta semanal atualizada com sucesso!');
      } else {
        const { error } = await supabaseAdmin
          .from('weekly_specials')
          .insert([specialData]);

        if (error) throw error;
        toast.success('Oferta semanal criada com sucesso!');
      }

      // Save product images if any were uploaded
      if (productImages.length > 0 && formData.product_id) {
        // Delete existing images for this product
        await supabaseAdmin
          .from('product_images')
          .delete()
          .eq('product_id', formData.product_id);

        // Insert new images
        const imageInserts = productImages.map(img => ({
          product_id: formData.product_id,
          url: img.url,
          alt_text: img.alt_text,
          sort_order: img.sort_order
        }));

        const { error: imageError } = await supabaseAdmin
          .from('product_images')
          .insert(imageInserts);

        if (imageError) {
          console.error('Error saving images:', imageError);
          toast.error('Oferta salva, mas houve erro ao salvar as imagens');
        }
      }

      setIsDialogOpen(false);
      resetForm();
      fetchSpecials();
    } catch (error: any) {
      console.error('Error saving weekly special:', error);
      if (error.code === '23505') {
        toast.error('Este produto já está nas ofertas semanais');
      } else {
        toast.error('Erro ao salvar oferta semanal');
      }
    }
  };

  const handleEdit = async (special: WeeklySpecial) => {
    setEditingSpecial(special);
    setFormData({
      product_id: special.product_id,
      sort_order: special.sort_order.toString(),
      is_active: special.is_active,
      week_of: special.week_of || '',
    });

    // Load existing images for this product
    try {
      const { data: images } = await supabaseAdmin
        .from('product_images')
        .select('url, alt_text, sort_order')
        .eq('product_id', special.product_id)
        .order('sort_order');

      setProductImages(images || []);
    } catch (error) {
      console.error('Error loading product images:', error);
      setProductImages([]);
    }

    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta oferta semanal?')) return;

    try {
      const { error } = await supabaseAdmin
        .from('weekly_specials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Oferta semanal removida com sucesso!');
      fetchSpecials();
    } catch (error) {
      console.error('Error deleting weekly special:', error);
      toast.error('Erro ao remover oferta semanal');
    }
  };

  const handleToggleActive = async (special: WeeklySpecial) => {
    try {
      const { error } = await supabaseAdmin
        .from('weekly_specials')
        .update({ is_active: !special.is_active })
        .eq('id', special.id);

      if (error) throw error;
      toast.success(`Oferta semanal ${!special.is_active ? 'ativada' : 'desativada'} com sucesso!`);
      fetchSpecials();
    } catch (error) {
      console.error('Error toggling weekly special status:', error);
      toast.error('Erro ao alterar status da oferta semanal');
    }
  };

  const resetForm = () => {
    setFormData({
      product_id: '',
      sort_order: '',
      is_active: true,
      week_of: '',
    });
    setProductImages([]);
    setEditingSpecial(null);
  };

  const migrateFallbackProducts = async () => {
    if (!confirm('Isso irá criar os produtos da home page no banco de dados e configurar as ofertas semanais. Continuar?')) return;

    setMigrating(true);
    try {
      const fallbackProducts = [
        {
          name: "Furadeira de Impacto Profissional",
          sku: "FIP-850W",
          description: "850W de potência • Mandril 13mm • Velocidade variável",
          category: "Ferramentas Elétricas",
          price: 299.90,
          is_active: true
        },
        {
          name: "Capacete de Segurança com Jugular",
          sku: "CS-CA-001",
          description: "Certificação INMETRO • Material ABS • Cores variadas",
          category: "EPIs",
          price: 45.90,
          is_active: true
        },
        {
          name: "Barra Chata Aço 1020",
          sku: "BC-1020-50X6",
          description: "50mm x 6mm • Aço 1020 • Comprimento 6m",
          category: "Ferro & Aço",
          price: 125.50,
          is_active: true
        },
        {
          name: "Parafusadeira à Bateria 12V",
          sku: "PB-12V-LI",
          description: "Bateria 12V Li-ion • LED de trabalho • Carregador incluído",
          category: "Ferramentas à Bateria",
          price: 189.90,
          is_active: true
        }
      ];

      const { data: categories } = await supabaseAdmin
        .from('categories')
        .select('id, name');

      const insertedProducts = [];

      for (const product of fallbackProducts) {
        let category = categories?.find(cat =>
          cat.name.toLowerCase().includes(product.category.toLowerCase().split(' ')[0])
        );

        if (!category) {
          category = categories?.find(cat =>
            product.category.toLowerCase().includes(cat.name.toLowerCase().split(' ')[0])
          );
        }

        if (!category && product.category === "Ferramentas à Bateria") {
          category = categories?.find(cat => cat.name.includes("Bateria"));
        }

        if (!category) continue;

        const { data: existing } = await supabaseAdmin
          .from('products')
          .select('id')
          .eq('sku', product.sku)
          .single();

        if (existing) {
          insertedProducts.push(existing);
          continue;
        }

        const { data: newProduct, error } = await supabaseAdmin
          .from('products')
          .insert({
            name: product.name,
            sku: product.sku,
            description: product.description,
            category: product.category,
            category_id: category.id,
            price: product.price,
            is_active: product.is_active
          })
          .select('id')
          .single();

        if (error) throw error;
        insertedProducts.push(newProduct);
      }

      const weeklySpecials = insertedProducts.map((product, index) => ({
        product_id: product.id,
        sort_order: index + 1,
        is_active: true,
        week_of: new Date().toISOString().split('T')[0]
      }));

      const { error: specialsError } = await supabaseAdmin
        .from('weekly_specials')
        .insert(weeklySpecials);

      if (specialsError) throw specialsError;

      toast.success(`${insertedProducts.length} produtos migrados e ofertas criadas com sucesso!`);
      fetchSpecials();
      fetchProducts();

    } catch (error: any) {
      console.error('Error migrating products:', error);
      toast.error('Erro na migração: ' + error.message);
    } finally {
      setMigrating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ofertas Semanais</h1>
          <p className="text-gray-600">Gerencie os produtos em destaque da semana</p>
        </div>
        <div className="flex gap-2">
          {specials.length === 0 && (
            <Button
              onClick={migrateFallbackProducts}
              disabled={migrating}
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              {migrating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                  Migrando...
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Migrar Produtos da Home
                </>
              )}
            </Button>
          )}
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Oferta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingSpecial ? 'Editar Oferta Semanal' : 'Nova Oferta Semanal'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="product_id">Produto</Label>
                  <Select
                    value={formData.product_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, product_id: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sort_order">Ordem de Exibição</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: e.target.value }))}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="week_of">Semana (opcional)</Label>
                  <Input
                    id="week_of"
                    type="date"
                    value={formData.week_of}
                    onChange={(e) => setFormData(prev => ({ ...prev, week_of: e.target.value }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Ativo</Label>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Image className="h-4 w-4" />
                    Imagens do Produto
                  </Label>
                  <ImageUpload
                    productId={formData.product_id}
                    existingImages={productImages}
                    onImagesChange={setProductImages}
                    maxImages={3}
                    className="border-dashed border-2 border-gray-200 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    As imagens aparecerão no carrossel da home page. Primeira imagem será a principal.
                  </p>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingSpecial ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {specials.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Bem-vindo às Ofertas Semanais! 🎯</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Settings className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Configure suas primeiras ofertas
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Atualmente você não tem nenhuma oferta semanal configurada.
                      Você pode migrar os produtos que já aparecem na home page ou criar novas ofertas do zero.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                    <Button
                      onClick={migrateFallbackProducts}
                      disabled={migrating}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {migrating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Migrando...
                        </>
                      ) : (
                        <>
                          <Settings className="h-4 w-4 mr-2" />
                          Migrar da Home
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => setIsDialogOpen(true)}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Oferta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Ofertas Ativas ({specials.filter(s => s.is_active).length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead width="50"></TableHead>
                      <TableHead>Ordem</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Semana</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {specials.map((special) => (
                      <TableRow key={special.id}>
                        <TableCell>
                          <GripVertical className="h-4 w-4 text-gray-400" />
                        </TableCell>
                        <TableCell className="font-medium">{special.sort_order}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {special.products?.product_images?.[0] ? (
                              <img
                                src={special.products.product_images[0].url}
                                alt={special.products.name}
                                className="w-10 h-10 object-cover rounded-lg border"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 rounded-lg border flex items-center justify-center">
                                <Image className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{special.products?.name}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {special.products?.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={special.is_active}
                              onCheckedChange={() => handleToggleActive(special)}
                            />
                            <span className={cn(
                              "text-sm",
                              special.is_active ? "text-green-600" : "text-red-600"
                            )}>
                              {special.is_active ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {special.week_of
                            ? new Date(special.week_of).toLocaleDateString('pt-BR')
                            : 'Geral'
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(special)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(special.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview do Carrossel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                Assim ficará exibido no site público:
              </div>

              <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 rounded-xl">
                <h3 className="font-bold text-lg mb-3">Ofertas Especiais desta Semana</h3>
                <div className="grid grid-cols-2 gap-3">
                  {specials
                    .filter(s => s.is_active)
                    .slice(0, 4)
                    .map((special, index) => (
                      <div key={special.id} className="bg-white/50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-500 mb-1">#{index + 1}</div>
                        {special.products?.product_images?.[0] && (
                          <img
                            src={special.products.product_images[0].url}
                            alt={special.products?.name}
                            className="w-full h-16 object-cover rounded mb-2"
                          />
                        )}
                        <div className="font-medium text-sm truncate">
                          {special.products?.name}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {special.products?.description}
                        </div>
                      </div>
                    ))}
                </div>
                {specials.filter(s => s.is_active).length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    Nenhuma oferta ativa para exibir
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">🎯 Limite de Exibição</h4>
                <p>O site público exibe até <strong>8 ofertas semanais</strong> no carrossel. Use a ordem para controlar a sequência.</p>
              </div>

              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">📊 Ordenação</h4>
                <p>Use o campo "Ordem" para controlar a sequência de exibição. Números menores aparecem primeiro.</p>
              </div>

              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">📅 Semana</h4>
                <p>O campo "Semana" é opcional e serve para organização interna. Não afeta a exibição no site.</p>
              </div>

              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">🔄 Status</h4>
                <p>Apenas ofertas <strong>ativas</strong> aparecem no carrossel do site público.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WeeklySpecials;