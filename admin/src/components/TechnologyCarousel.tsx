import { useState, useEffect } from 'react';
import { supabaseAdmin } from '../lib/supabase';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Image, Settings } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface TechCarouselItem {
  id: string;
  carousel_id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export default function TechnologyCarousel() {
  const [items, setItems] = useState<TechCarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TechCarouselItem | null>(null);
  const [carouselId, setCarouselId] = useState<string>('');
  const [formData, setFormData] = useState({
    alt_text: '',
    sort_order: '',
    is_active: true,
  });
  const [itemImage, setItemImage] = useState<{ url: string; alt_text: string; sort_order: number; }[]>([]);

  useEffect(() => {
    fetchTechCarousel();
  }, []);

  const createTechCarousel = async () => {
    try {
      // Create the carousel
      const { data: newCarousel, error: createError } = await supabaseAdmin
        .from('carousels')
        .insert([{ key: 'tecnologia-processo', title: 'Tecnologia e Processo' }])
        .select()
        .single();

      if (createError) throw createError;

      // Create sample items
      const sampleItems = [
        {
          carousel_id: newCarousel.id,
          image_url: 'https://placehold.co/600x400/174A8B/FFFFFF/png?text=CNC+Machines',
          alt_text: 'Máquinas CNC de precisão para corte e usinagem',
          sort_order: 1,
          is_active: true,
        },
        {
          carousel_id: newCarousel.id,
          image_url: 'https://placehold.co/600x400/174A8B/FFFFFF/png?text=Quality+Control',
          alt_text: 'Sistema de controle de qualidade e medição',
          sort_order: 2,
          is_active: true,
        },
        {
          carousel_id: newCarousel.id,
          image_url: 'https://placehold.co/600x400/174A8B/FFFFFF/png?text=Automation',
          alt_text: 'Automação e tecnologia de produção',
          sort_order: 3,
          is_active: true,
        },
      ];

      const { error: itemsError } = await supabaseAdmin
        .from('carousel_items')
        .insert(sampleItems);

      if (itemsError) throw itemsError;

      setCarouselId(newCarousel.id);
      toast.success('Carrossel Tecnologia e Processo criado com sucesso!');

      // Fetch the items
      fetchCarouselItems(newCarousel.id);
    } catch (error) {
      console.error('Error creating tech carousel:', error);
      toast.error('Erro ao criar carrossel de tecnologia');
    }
  };

  const fetchCarouselItems = async (carouselId: string) => {
    try {
      const { data: items, error: itemsError } = await supabaseAdmin
        .from('carousel_items')
        .select('*')
        .eq('carousel_id', carouselId)
        .order('sort_order');

      if (itemsError) throw itemsError;
      setItems(items || []);
    } catch (error) {
      console.error('Error fetching carousel items:', error);
      toast.error('Erro ao carregar itens do carrossel');
    }
  };

  const fetchTechCarousel = async () => {
    try {
      // Get technology carousel
      const { data: carousel, error: carouselError } = await supabaseAdmin
        .from('carousels')
        .select('id, title')
        .eq('key', 'tecnologia-processo')
        .single();

      if (carouselError) {
        console.log('Carousel not found, will show create option:', carouselError);
        setCarouselId('');
        setLoading(false);
        return;
      }

      setCarouselId(carousel.id);
      fetchCarouselItems(carousel.id);
    } catch (error) {
      console.error('Error fetching tech carousel:', error);
      toast.error('Erro ao carregar carrossel de tecnologia');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemImage[0]?.url) {
      toast.error('Selecione uma imagem');
      return;
    }

    try {
      const itemData = {
        carousel_id: carouselId,
        image_url: itemImage[0].url,
        alt_text: formData.alt_text || itemImage[0].alt_text,
        sort_order: parseInt(formData.sort_order) || 0,
        is_active: formData.is_active,
      };

      if (editingItem) {
        const { error } = await supabaseAdmin
          .from('carousel_items')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('Item atualizado com sucesso!');
      } else {
        const { error } = await supabaseAdmin
          .from('carousel_items')
          .insert([itemData]);

        if (error) throw error;
        toast.success('Item criado com sucesso!');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchCarouselItems(carouselId);
    } catch (error: any) {
      console.error('Error saving carousel item:', error);
      toast.error('Erro ao salvar item do carrossel');
    }
  };

  const handleEdit = (item: TechCarouselItem) => {
    setEditingItem(item);
    setFormData({
      alt_text: item.alt_text || '',
      sort_order: item.sort_order.toString(),
      is_active: item.is_active,
    });

    // Set existing image
    setItemImage([{
      url: item.image_url,
      alt_text: item.alt_text || '',
      sort_order: 1
    }]);

    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este item?')) return;

    try {
      const { error } = await supabaseAdmin
        .from('carousel_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Item removido com sucesso!');
      fetchCarouselItems(carouselId);
    } catch (error) {
      console.error('Error deleting carousel item:', error);
      toast.error('Erro ao remover item');
    }
  };

  const handleToggleActive = async (item: TechCarouselItem) => {
    try {
      const { error } = await supabaseAdmin
        .from('carousel_items')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;
      toast.success(`Item ${!item.is_active ? 'ativado' : 'desativado'} com sucesso!`);
      fetchCarouselItems(carouselId);
    } catch (error) {
      console.error('Error toggling item status:', error);
      toast.error('Erro ao alterar status do item');
    }
  };

  const resetForm = () => {
    setFormData({
      alt_text: '',
      sort_order: '',
      is_active: true,
    });
    setItemImage([]);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carrossel Tecnologia e Processo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!carouselId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carrossel Tecnologia e Processo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Carrossel não encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              O carrossel 'tecnologia-processo' precisa ser criado para gerenciar as imagens da página Empresa.
            </p>
            <Button onClick={createTechCarousel} className="mb-4">
              <Plus className="h-4 w-4 mr-2" />
              Criar Carrossel Tecnologia e Processo
            </Button>
            <div className="bg-gray-100 p-4 rounded-lg text-left text-sm">
              <p className="text-gray-600 mb-2">
                <strong>Alternativa manual:</strong> Execute este SQL no Dashboard do Supabase:
              </p>
              <code>
                INSERT INTO public.carousels (key, title)<br/>
                VALUES ('tecnologia-processo', 'Tecnologia e Processo');
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Carrossel Tecnologia e Processo</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Editar Item' : 'Novo Item do Carrossel'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="alt_text">Descrição da Imagem</Label>
                  <Input
                    id="alt_text"
                    value={formData.alt_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                    placeholder="Máquinas CNC de precisão..."
                  />
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
                  <Label className="flex items-center gap-2 mb-3">
                    <Image className="h-4 w-4" />
                    Imagem do Item
                  </Label>
                  <ImageUpload
                    existingImages={itemImage}
                    onImagesChange={setItemImage}
                    maxImages={1}
                    className="border-dashed border-2 border-gray-200 rounded-lg"
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

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingItem ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600 mb-4">
          Gerencie as imagens que aparecem no carrossel da seção "Tecnologia e Processo" da página Empresa.
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum item no carrossel</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagem</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img
                      src={item.image_url}
                      alt={item.alt_text}
                      className="w-16 h-12 object-cover rounded border"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      {item.alt_text || 'Sem descrição'}
                    </div>
                  </TableCell>
                  <TableCell>{item.sort_order}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={item.is_active}
                        onCheckedChange={() => handleToggleActive(item)}
                        size="sm"
                      />
                      <span className={cn(
                        "text-sm",
                        item.is_active ? "text-green-600" : "text-red-600"
                      )}>
                        {item.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
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
        )}
      </CardContent>
    </Card>
  );
}