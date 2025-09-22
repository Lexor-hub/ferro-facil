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
import { Plus, Edit2, Trash2, Upload, GripVertical, ExternalLink } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Textarea } from '../components/ui/textarea';

interface BelowBannerImage {
  id: string;
  image_url: string;
  alt_text: string;
  title: string | null;
  description: string | null;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const BelowBannerImages = () => {
  const [images, setImages] = useState<BelowBannerImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingImage, setEditingImage] = useState<BelowBannerImage | null>(null);
  const [formData, setFormData] = useState({
    alt_text: '',
    title: '',
    description: '',
    link_url: '',
    sort_order: '0',
    is_active: true,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('below_banner_images')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching below banner images:', error);
      toast.error('Erro ao carregar imagens abaixo do banner');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `below-banner/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('below-banner-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Erro ao fazer upload da imagem:', uploadError);
        toast.error(`Erro no upload: ${uploadError.message}`);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('below-banner-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error: any) {
      console.error('Erro detalhado no upload:', error);
      toast.error(`Falha no upload: ${error.message || 'Erro desconhecido'}`);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingImage(true);
    
    try {
      let imageUrl = editingImage?.image_url || '';

      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      if (!imageUrl && !editingImage) {
        toast.error('Por favor, selecione uma imagem');
        return;
      }

      const imageData = {
        image_url: imageUrl,
        alt_text: formData.alt_text,
        title: formData.title || null,
        description: formData.description || null,
        link_url: formData.link_url || null,
        sort_order: parseInt(formData.sort_order) || 0,
        is_active: formData.is_active,
      };

      if (editingImage) {
        const { error } = await supabase
          .from('below_banner_images')
          .update(imageData)
          .eq('id', editingImage.id);

        if (error) throw error;
        toast.success('Imagem atualizada com sucesso!');
      } else {
        const { error } = await supabase
          .from('below_banner_images')
          .insert([imageData]);

        if (error) throw error;
        toast.success('Imagem adicionada com sucesso!');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchImages();
    } catch (error: any) {
      console.error('Error saving image:', error);
      if (error.code === 'PGRST205') {
        toast.error('A tabela below_banner_images não existe no banco de dados. Verifique se a migração foi executada.');
      } else if (error.code === '23505') {
        toast.error('Já existe uma imagem com este nome ou ordem.');
      } else if (error.message && error.message.includes('storage')) {
        toast.error(`Erro no armazenamento: ${error.message}`);
      } else {
        toast.error(`Erro ao salvar imagem: ${error.message || 'Erro desconhecido'}`);
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setFormData({
      alt_text: '',
      title: '',
      description: '',
      link_url: '',
      sort_order: '0',
      is_active: true,
    });
    setSelectedImage(null);
    setPreviewUrl('');
    setEditingImage(null);
  };

  const handleEdit = (image: BelowBannerImage) => {
    setEditingImage(image);
    setFormData({
      alt_text: image.alt_text || '',
      title: image.title || '',
      description: image.description || '',
      link_url: image.link_url || '',
      sort_order: image.sort_order.toString(),
      is_active: image.is_active,
    });
    setPreviewUrl(image.image_url);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;

    try {
      const { error } = await supabase
        .from('below_banner_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Imagem excluída com sucesso!');
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Erro ao excluir imagem');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('below_banner_images')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Imagem ${!currentStatus ? 'ativada' : 'desativada'} com sucesso!`);
      fetchImages();
    } catch (error) {
      console.error('Error toggling image status:', error);
      toast.error('Erro ao alterar status da imagem');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg']
    },
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    },
  });

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Imagens Abaixo do Banner</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
                className="ml-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Imagem
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingImage ? 'Editar' : 'Adicionar'} Imagem</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 py-4">
                <div className="flex justify-end space-x-2 mb-4 sticky top-0 bg-background pt-2 pb-2 z-10">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={uploadingImage}>
                    {uploadingImage ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Imagem (Recomendado: 2048x512px)</Label>
                  <div 
                    {...getRootProps()} 
                    className={cn(
                      "border-2 border-dashed rounded-md p-6 cursor-pointer text-center hover:bg-muted/50 transition-colors",
                      previewUrl ? "border-primary" : "border-muted"
                    )}
                  >
                    <input {...getInputProps()} />
                    {previewUrl ? (
                      <div className="flex flex-col items-center">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="max-w-full max-h-[200px] object-contain mb-4" 
                          style={{ aspectRatio: '4/1' }} 
                        />
                        <p className="text-sm text-muted-foreground">Clique ou arraste para trocar a imagem</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Clique ou arraste uma imagem</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF, SVG até 5MB</p>
                        <p className="text-xs text-muted-foreground mt-1">Dimensão recomendada: 2048x512 pixels</p>
                      </div>
                    )}
                  </div>
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
                  <Label htmlFor="title">Título (opcional)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título da imagem"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição da imagem"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="link_url">Link (opcional)</Label>
                  <Input
                    id="link_url"
                    value={formData.link_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                    placeholder="https://exemplo.com"
                  />
                </div>

                <div>
                  <Label htmlFor="sort_order">Ordem de Exibição</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: e.target.value }))}
                    min="0"
                    required
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


              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Carregando...</div>
          ) : images.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagem</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {images.map((image) => (
                  <TableRow key={image.id}>
                    <TableCell>
                      <img 
                        src={image.image_url} 
                        alt={image.alt_text} 
                        className="w-20 h-16 object-cover rounded-md" 
                      />
                    </TableCell>
                    <TableCell>
                      {image.title || <span className="text-muted-foreground italic">Sem título</span>}
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {image.description || 'Sem descrição'}
                      </p>
                    </TableCell>
                    <TableCell>{image.sort_order}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${image.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {image.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(image)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={image.is_active ? "destructive" : "default"}
                          size="sm"
                          onClick={() => handleToggleActive(image.id, image.is_active)}
                        >
                          {image.is_active ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(image.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">Nenhuma imagem encontrada</p>
              <Button 
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                Adicionar Imagem
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BelowBannerImages;