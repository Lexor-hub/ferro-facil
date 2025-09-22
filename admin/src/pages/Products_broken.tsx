import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Upload, List, Eye } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface Product {
  id: string;
  name: string;
  slug?: string | null;
  description: string;
  price: number;
  sku: string;
  category_id: string;
  is_active: boolean;
  created_at: string;
  categories?: { name: string };
  product_images?: { url: string; alt_text: string; sort_order: number }[];
}

interface Category {
  id: string;
  name: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sku: '',
    category_id: '',
    is_active: true,
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // Bulk import states
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [bulkCategoryId, setBulkCategoryId] = useState('');
  const [bulkProductsText, setBulkProductsText] = useState('');
  const [bulkPreview, setBulkPreview] = useState<string[]>([]);
  const [showBulkPreview, setShowBulkPreview] = useState(false);
  const [bulkSaving, setBulkSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name),
          product_images (url, alt_text, sort_order)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const uploadImages = async (productId: string, images: File[]) => {
    const uploadPromises = images.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}/${Date.now()}_${index}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      return {
        product_id: productId,
        url: data.publicUrl,
        alt_text: file.name.split('.')[0],
        sort_order: index,
      };
    });

    const imageRecords = await Promise.all(uploadPromises);
    
    const { error } = await supabase
      .from('product_images')
      .insert(imageRecords);

    if (error) throw error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingImages(true);
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description || null,
        price: formData.price ? parseFloat(formData.price) : null,
        sku: formData.sku || null,
        category_id: formData.category_id || null,
        is_active: formData.is_active,
      };

      let productId: string;

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        productId = editingProduct.id;
        toast.success('Produto atualizado com sucesso!');
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();

        if (error) throw error;
        productId = data.id;
        toast.success('Produto criado com sucesso!');
      }

      if (selectedImages.length > 0) {
        await uploadImages(productId, selectedImages);
      }

      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error('Erro ao salvar produto');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price?.toString() || '',
      sku: product.sku || '',
      category_id: product.category_id || '',
      is_active: product.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Produto excluído com sucesso!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erro ao excluir produto');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id);

      if (error) throw error;
      toast.success(`Produto ${!product.is_active ? 'ativado' : 'desativado'} com sucesso!`);
      fetchProducts();
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast.error('Erro ao alterar status do produto');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      sku: '',
      category_id: '',
      is_active: true,
    });
    setEditingProduct(null);
    setSelectedImages([]);
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
    }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setSelectedImages(acceptedFiles);
    }
  });

  // Bulk import functions
  const handleBulkPreview = () => {
    if (!bulkProductsText.trim() || !bulkCategoryId) {
      toast.error('Selecione uma categoria e adicione produtos');
      return;
    }

    const products = bulkProductsText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (products.length === 0) {
      toast.error('Nenhum produto válido encontrado');
      return;
    }

    setBulkPreview(products);
    setShowBulkPreview(true);
  };

  const handleBulkSave = async () => {
    if (bulkPreview.length === 0 || !bulkCategoryId) return;

    setBulkSaving(true);
    try {
      const productsData = bulkPreview.map(productName => ({
        name: productName,
        description: null,
        price: null,
        sku: null,
        category_id: bulkCategoryId,
        is_active: true
      }));

      const { error } = await supabase
        .from('products')
        .insert(productsData);

      if (error) throw error;

      toast.success(`${bulkPreview.length} produtos cadastrados com sucesso!`);
      resetBulkForm();
      fetchProducts();
    } catch (error) {
      console.error('Error bulk saving products:', error);
      toast.error('Erro ao cadastrar produtos em massa');
    } finally {
      setBulkSaving(false);
    }
  };

  const resetBulkForm = () => {
    setBulkCategoryId('');
    setBulkProductsText('');
    setBulkPreview([]);
    setShowBulkPreview(false);
    setIsBulkDialogOpen(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600">Gerencie o catálogo de produtos</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isBulkDialogOpen} onOpenChange={(open) => {
            setIsBulkDialogOpen(open);
            if (!open) resetBulkForm();
          }}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <List className="h-4 w-4 mr-2" />
                Cadastro em Massa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cadastro em Massa de Produtos</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bulk-category">Categoria</Label>
                  <Select value={bulkCategoryId} onValueChange={setBulkCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bulk-products">Lista de Produtos (um por linha)</Label>
                  <Textarea
                    id="bulk-products"
                    value={bulkProductsText}
                    onChange={(e) => setBulkProductsText(e.target.value)}
                    rows={8}
                    placeholder="Digite os nomes dos produtos, um por linha:&#10;&#10;Martelo&#10;Chave de fenda&#10;Alicate universal&#10;..."
                  />
                </div>

                {showBulkPreview && bulkPreview.length > 0 && (
                  <div>
                    <Label className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Preview ({bulkPreview.length} produtos)
                    </Label>
                    <div className="border rounded-md p-3 max-h-32 overflow-y-auto bg-gray-50">
                      {bulkPreview.map((product, index) => (
                        <div key={index} className="text-sm py-1">
                          {index + 1}. {product}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  {!showBulkPreview ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsBulkDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="button"
                        onClick={handleBulkPreview}
                        disabled={!bulkCategoryId || !bulkProductsText.trim()}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowBulkPreview(false)}
                      >
                        Voltar
                      </Button>
                      <Button
                        type="button"
                        onClick={handleBulkSave}
                        disabled={bulkSaving}
                      >
                        {bulkSaving ? 'Salvando...' : `Cadastrar ${bulkPreview.length} Produtos`}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  />
                </div>
              </div>
              

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="category_id">Categoria</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Imagens do Produto</Label>
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
                  <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                </div>
                {selectedImages.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      {selectedImages.length} imagem(ns) selecionada(s)
                    </p>
                  </div>
                )}
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
                <Button type="submit" disabled={uploadingImages}>
                  {uploadingImages ? 'Salvando...' : editingProduct ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Imagens</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku || '-'}</TableCell>
                  <TableCell>{product.categories?.name || '-'}</TableCell>
                  <TableCell>
                    {product.price ? `R$ ${product.price.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={product.is_active}
                        onCheckedChange={() => handleToggleActive(product)}
                      />
                      <span className={cn(
                        "text-sm",
                        product.is_active ? "text-green-600" : "text-red-600"
                      )}>
                        {product.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.product_images?.length || 0} imagem(ns)
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
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
  );
};

export default Products;