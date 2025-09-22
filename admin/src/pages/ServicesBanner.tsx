import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';
import { Upload, ExternalLink } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface ServicesBanner {
  id: string;
  image_url: string;
  alt_text: string;
  is_active: boolean;
  created_at: string;
}

const ServicesBanner = () => {
  const [banner, setBanner] = useState<ServicesBanner | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    alt_text: '',
    is_active: true,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    fetchServicesBanner();
  }, []);

  const fetchServicesBanner = async () => {
    try {
      const { data, error } = await supabase
        .from('services_banner')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      setBanner(data?.[0] || null);
    } catch (error) {
      console.error('Error fetching services banner:', error);
      toast.error('Erro ao carregar banner de serviços');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `services-banner/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('services-banner')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('services-banner')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingImage(true);
    
    try {
      let imageUrl = banner?.image_url || '';

      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      if (!imageUrl && !banner) {
        toast.error('Por favor, selecione uma imagem');
        return;
      }

      const bannerData = {
        alt_text: formData.alt_text,
        is_active: formData.is_active,
        image_url: imageUrl,
      };

      let response;

      if (banner) {
        // Update existing banner
        response = await supabase
          .from('services_banner')
          .update(bannerData)
          .eq('id', banner.id);
      } else {
        // Create new banner
        response = await supabase
          .from('services_banner')
          .insert([bannerData]);
      }

      if (response.error) throw response.error;

      toast.success(`Banner de serviços ${banner ? 'atualizado' : 'criado'} com sucesso!`);
      setIsDialogOpen(false);
      fetchServicesBanner();
      resetForm();
    } catch (error) {
      console.error('Error saving services banner:', error);
      toast.error(`Erro ao ${banner ? 'atualizar' : 'criar'} banner de serviços`);
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setFormData({
      alt_text: '',
      is_active: true,
    });
    setSelectedImage(null);
    setPreviewUrl('');
  };

  const handleEdit = () => {
    if (banner) {
      setFormData({
        alt_text: banner.alt_text || '',
        is_active: banner.is_active,
      });
      setPreviewUrl(banner.image_url);
    }
    setIsDialogOpen(true);
  };

  const handleToggleActive = async () => {
    if (!banner) return;

    try {
      const { error } = await supabase
        .from('services_banner')
        .update({ is_active: !banner.is_active })
        .eq('id', banner.id);

      if (error) throw error;
      toast.success(`Banner de serviços ${!banner.is_active ? 'ativado' : 'desativado'} com sucesso!`);
      fetchServicesBanner();
    } catch (error) {
      console.error('Error toggling banner status:', error);
      toast.error('Erro ao alterar status do banner');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
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
          <CardTitle className="text-2xl font-bold">Banner de Serviços</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
                className="ml-auto"
              >
                {banner ? 'Editar Banner' : 'Adicionar Banner'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{banner ? 'Editar' : 'Adicionar'} Banner de Serviços</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Imagem (Recomendado: 2400x400px)</Label>
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
                          className="max-h-[200px] object-contain mb-4" 
                        />
                        <p className="text-sm text-muted-foreground">Clique ou arraste para trocar a imagem</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Clique ou arraste uma imagem</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF até 5MB</p>
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
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Carregando...</div>
          ) : banner ? (
            <div className="space-y-6">
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={banner.image_url} 
                  alt={banner.alt_text} 
                  className="w-full h-auto object-cover" 
                />
              </div>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Button onClick={handleEdit} variant="outline">
                  Editar Banner
                </Button>
                <Button 
                  onClick={handleToggleActive} 
                  variant={banner.is_active ? "destructive" : "default"}
                >
                  {banner.is_active ? 'Desativar' : 'Ativar'}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center" 
                  onClick={() => window.open('/', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver no site
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p><strong>Texto alternativo:</strong> {banner.alt_text}</p>
                <p><strong>Status:</strong> {banner.is_active ? 'Ativo' : 'Inativo'}</p>
                <p><strong>Última atualização:</strong> {new Date(banner.created_at).toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">Nenhum banner de serviços encontrado</p>
              <Button 
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                Adicionar Banner
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesBanner;