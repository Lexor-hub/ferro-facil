import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Upload, GripVertical } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface CarouselItem {
  id: string;
  carousel_id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

const CarouselItems = () => {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CarouselItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [logisticaCarouselId, setLogisticaCarouselId] = useState<string>('');
  const [formData, setFormData] = useState({
    alt_text: '',
    sort_order: '',
    is_active: true,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    fetchCarouselItems();
  }, []);

  const fetchCarouselItems = async () => {
    try {
      // First get the logistics carousel ID
      const { data: carousel, error: carouselError } = await supabase
        .from('carousels')
        .select('id, title')
        .eq('key', 'logistica')
        .single();

      if (carouselError) throw carouselError;
      setLogisticaCarouselId(carousel.id);

      // Then get the carousel items
      const { data, error } = await supabase
        .from('carousel_items')
        .select('*')
        .eq('carousel_id', carousel.id)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching carousel items:', error);
      toast.error('Erro ao carregar itens do carrossel');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `carousels/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('carousels')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('carousels')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingImage(true);
    
    try {
      let imageUrl = editingItem?.image_url || '';

      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      if (!imageUrl && !editingItem) {
        toast.error('Por favor, selecione uma imagem');
        return;
      }

      const itemData = {
        carousel_id: logisticaCarouselId,
        image_url: imageUrl,
        alt_text: formData.alt_text,
        sort_order: parseInt(formData.sort_order) || 0,
        is_active: formData.is_active,
      };

      if (editingItem) {
        const { error } = await supabase
          .from('carousel_items')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('Item do carrossel atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('carousel_items')
          .insert([itemData]);

        if (error) throw error;
        toast.success('Item do carrossel criado com sucesso!');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchCarouselItems();
    } catch (error: any) {
      console.error('Error saving carousel item:', error);
      toast.error('Erro ao salvar item do carrossel');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEdit = (item: CarouselItem) => {
    setEditingItem(item);
    setFormData({
      alt_text: item.alt_text || '',
      sort_order: item.sort_order.toString(),
      is_active: item.is_active,
    });
    setPreviewUrl(item.image_url);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item do carrossel?')) return;

    try {
      const { error } = await supabase
        .from('carousel_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Item do carrossel excluído com sucesso!');
      fetchCarouselItems();
    } catch (error) {
      console.error('Error deleting carousel item:', error);
      toast.error('Erro ao excluir item do carrossel');
    }
  };

  const handleToggleActive = async (item: CarouselItem) => {
    try {
      const { error } = await supabase
        .from('carousel_items')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;
      toast.success(`Item ${!item.is_active ? 'ativado' : 'desativado'} com sucesso!`);
      fetchCarouselItems();
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
    setEditingItem(null);
    setSelectedImage(null);
    setPreviewUrl('');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Carrossel Logística</h1>
          <p className="text-gray-600">Gerencie as imagens do carrossel "Logística própria, sua garantia de confiabilidade"</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Slide' : 'Novo Slide'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Imagem do Slide</Label>
                <div
                  {...getRootProps()}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                    isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"
                  )}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {isDragActive
                      ? "Solte a imagem aqui..."
                      : "Arraste uma imagem aqui ou clique para selecionar"}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                  <p className="text-xs text-orange-600 mt-2">
                    <strong>Recomendação:</strong> Use imagens com proporção 16:9 (ex: 1920x1080px) para melhor resultado
                  </p>
                </div>
                {previewUrl && (
                  <div className="mt-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="alt_text">Texto Alternativo (acessibilidade)</Label>
                <Input
                  id="alt_text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                  placeholder="Descreva a imagem para acessibilidade"
                  required
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
                <Button type="submit" disabled={uploadingImage}>
                  {uploadingImage ? 'Salvando...' : editingItem ? 'Atualizar' : 'Criar'}
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
              <CardTitle>Slides do Carrossel ({items.filter(item => item.is_active).length} ativos)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead width="50"></TableHead>
                    <TableHead>Ordem</TableHead>
                    <TableHead>Imagem</TableHead>
                    <TableHead>Texto Alt</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <GripVertical className="h-4 w-4 text-gray-400" />
                      </TableCell>
                      <TableCell className="font-medium">{item.sort_order}</TableCell>
                      <TableCell>
                        <img
                          src={item.image_url}
                          alt={item.alt_text}
                          className="h-16 w-24 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{item.alt_text}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={item.is_active}
                            onCheckedChange={() => handleToggleActive(item)}
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
                <h4 className="font-medium mb-2">Dimensões Recomendadas</h4>
                <p>Use imagens com proporção 16:9 (exemplo: 1920x1080px) para melhor resultado no carrossel.</p>
              </div>
              
              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">Ordenação</h4>
                <p>Use o campo "Ordem" para controlar a sequência dos slides. Números menores aparecem primeiro.</p>
              </div>

              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">Acessibilidade</h4>
                <p>Sempre preencha o texto alternativo para tornar o conteúdo acessível a usuários com deficiência visual.</p>
              </div>

              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">Performance</h4>
                <p>Otimize as imagens antes do upload para melhorar o tempo de carregamento do site.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CarouselItems;