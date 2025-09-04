import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';

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

  useEffect(() => {
    fetchSpecials();
    fetchProducts();
  }, []);

  const fetchSpecials = async () => {
    try {
      const { data, error } = await supabase
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
      const { data, error } = await supabase
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
        const { error } = await supabase
          .from('weekly_specials')
          .update(specialData)
          .eq('id', editingSpecial.id);

        if (error) throw error;
        toast.success('Oferta semanal atualizada com sucesso!');
      } else {
        const { error } = await supabase
          .from('weekly_specials')
          .insert([specialData]);

        if (error) throw error;
        toast.success('Oferta semanal criada com sucesso!');
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

  const handleEdit = (special: WeeklySpecial) => {
    setEditingSpecial(special);
    setFormData({
      product_id: special.product_id,
      sort_order: special.sort_order.toString(),
      is_active: special.is_active,
      week_of: special.week_of || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta oferta semanal?')) return;

    try {
      const { error } = await supabase
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
      const { error } = await supabase
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

  const handleReorder = async (specialId: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('weekly_specials')
        .update({ sort_order: newOrder })
        .eq('id', specialId);

      if (error) throw error;
      fetchSpecials();
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Erro ao reordenar');
    }
  };

  const resetForm = () => {
    setFormData({
      product_id: '',
      sort_order: '',
      is_active: true,
      week_of: '',
    });
    setEditingSpecial(null);
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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
                        <div>
                          <div className="font-medium">{special.products?.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {special.products?.description}
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
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Dicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">Limite de Exibição</h4>
                <p>O site público exibe exatamente 4 ofertas semanais. Se você adicionar mais de 4, apenas as primeiras 4 (por ordem) serão exibidas.</p>
              </div>
              
              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">Ordenação</h4>
                <p>Use o campo "Ordem" para controlar a sequência de exibição. Números menores aparecem primeiro.</p>
              </div>

              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">Semana</h4>
                <p>O campo "Semana" é opcional e serve para organização interna. Não afeta a exibição no site.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WeeklySpecials;