import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Trash2, Upload, Copy, ExternalLink, Download } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: any;
}

interface BucketFiles {
  [bucketName: string]: StorageFile[];
}

const ImageGallery = () => {
  const [files, setFiles] = useState<BucketFiles>({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState('general-images');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const buckets = [
    { id: 'general-images', name: 'Imagens Gerais', description: 'Imagens diversas do site' },
    { id: 'banners', name: 'Banners', description: 'Banners do carrossel principal' },
    { id: 'carousels', name: 'Carrossel', description: 'Imagens do carrossel de logística' },
    { id: 'product-images', name: 'Produtos', description: 'Imagens dos produtos' }
  ];

  useEffect(() => {
    fetchAllFiles();
  }, []);

  const fetchAllFiles = async () => {
    try {
      const allFiles: BucketFiles = {};
      
      for (const bucket of buckets) {
        const { data, error } = await supabase.storage
          .from(bucket.id)
          .list('', {
            limit: 1000,
            sortBy: { column: 'created_at', order: 'desc' }
          });

        if (error) {
          console.error(`Error fetching files from ${bucket.id}:`, error);
          allFiles[bucket.id] = [];
        } else {
          allFiles[bucket.id] = data || [];
        }
      }
      
      setFiles(allFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Erro ao carregar imagens');
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (bucketId: string, imageFiles: File[]) => {
    const uploadPromises = imageFiles.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from(bucketId)
        .upload(fileName, file);

      if (error) throw error;
      return fileName;
    });

    return Promise.all(uploadPromises);
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) {
      toast.error('Selecione pelo menos uma imagem');
      return;
    }

    setUploadingImage(true);
    
    try {
      await uploadImages(selectedBucket, selectedImages);
      toast.success(`${selectedImages.length} imagem(ns) enviada(s) com sucesso!`);
      setIsDialogOpen(false);
      setSelectedImages([]);
      fetchAllFiles();
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast.error('Erro ao enviar imagens');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (bucketId: string, fileName: string) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;

    try {
      const { error } = await supabase.storage
        .from(bucketId)
        .remove([fileName]);

      if (error) throw error;
      toast.success('Imagem excluída com sucesso!');
      fetchAllFiles();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Erro ao excluir imagem');
    }
  };

  const getPublicUrl = (bucketId: string, fileName: string) => {
    const { data } = supabase.storage
      .from(bucketId)
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copiada para a área de transferência!');
  };

  const downloadImage = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg']
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setSelectedImages(acceptedFiles);
    }
  });

  const filteredFiles = (bucketFiles: StorageFile[]) => {
    if (!searchTerm) return bucketFiles;
    return bucketFiles.filter(file => 
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <h1 className="text-2xl font-bold text-gray-900">Galeria de Imagens</h1>
          <p className="text-gray-600">Gerencie todas as imagens do site</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Enviar Imagens
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enviar Novas Imagens</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bucket">Pasta de Destino</Label>
                <select
                  id="bucket"
                  value={selectedBucket}
                  onChange={(e) => setSelectedBucket(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {buckets.map((bucket) => (
                    <option key={bucket.id} value={bucket.id}>
                      {bucket.name} - {bucket.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Selecionar Imagens</Label>
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
                      ? "Solte as imagens aqui..."
                      : "Arraste imagens aqui ou clique para selecionar"}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP, SVG até 10MB cada</p>
                </div>
                {selectedImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedImages.length} imagem(ns) selecionada(s):
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="text-xs text-gray-500 truncate">
                          {file.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleUpload} disabled={uploadingImage}>
                  {uploadingImage ? 'Enviando...' : 'Enviar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar imagens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Tabs defaultValue="general-images" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {buckets.map((bucket) => (
            <TabsTrigger key={bucket.id} value={bucket.id}>
              {bucket.name} ({files[bucket.id]?.length || 0})
            </TabsTrigger>
          ))}
        </TabsList>
        
        {buckets.map((bucket) => (
          <TabsContent key={bucket.id} value={bucket.id}>
            <Card>
              <CardHeader>
                <CardTitle>{bucket.name}</CardTitle>
                <p className="text-sm text-gray-600">{bucket.description}</p>
              </CardHeader>
              <CardContent>
                {filteredFiles(files[bucket.id] || []).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'Nenhuma imagem encontrada com esse termo' : 'Nenhuma imagem nesta pasta'}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {filteredFiles(files[bucket.id] || []).map((file) => {
                      const publicUrl = getPublicUrl(bucket.id, file.name);
                      return (
                        <div key={file.name} className="group relative">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={publicUrl}
                              alt={file.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              loading="lazy"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => copyToClipboard(publicUrl)}
                                title="Copiar URL"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => window.open(publicUrl, '_blank')}
                                title="Abrir em nova aba"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => downloadImage(publicUrl, file.name)}
                                title="Download"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(bucket.id, file.name)}
                                title="Excluir"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs text-gray-600 truncate" title={file.name}>
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatDate(file.created_at)}
                            </p>
                            {file.metadata?.size && (
                              <p className="text-xs text-gray-400">
                                {formatFileSize(file.metadata.size)}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ImageGallery;