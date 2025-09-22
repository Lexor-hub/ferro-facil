import { useState, useEffect } from 'react';
import { supabaseAdmin } from '../lib/supabase';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Image, Building2 } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import TechnologyCarousel from '../components/TechnologyCarousel';

interface CompanySection {
  id: string;
  section_key: string;
  title: string;
  description: string | null;
  image_url: string | null;
  alt_text: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const CompanySections = () => {
  const [sections, setSections] = useState<CompanySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<CompanySection | null>(null);
  const [formData, setFormData] = useState({
    section_key: '',
    title: '',
    description: '',
    alt_text: '',
    is_active: true,
    sort_order: '',
  });
  const [sectionImage, setSectionImage] = useState<{ url: string; alt_text: string; sort_order: number; }[]>([]);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('company_sections')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching company sections:', error);
      toast.error('Erro ao carregar seções da empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const sectionData = {
        ...formData,
        sort_order: parseInt(formData.sort_order) || 0,
        description: formData.description || null,
        alt_text: formData.alt_text || null,
        image_url: sectionImage[0]?.url || null,
      };

      if (editingSection) {
        const { error } = await supabaseAdmin
          .from('company_sections')
          .update(sectionData)
          .eq('id', editingSection.id);

        if (error) throw error;
        toast.success('Seção da empresa atualizada com sucesso!');
      } else {
        const { error } = await supabaseAdmin
          .from('company_sections')
          .insert([sectionData]);

        if (error) throw error;
        toast.success('Seção da empresa criada com sucesso!');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchSections();
    } catch (error: any) {
      console.error('Error saving company section:', error);
      if (error.code === '23505') {
        toast.error('Esta chave de seção já existe');
      } else {
        toast.error('Erro ao salvar seção da empresa');
      }
    }
  };

  const handleEdit = (section: CompanySection) => {
    setEditingSection(section);
    setFormData({
      section_key: section.section_key,
      title: section.title,
      description: section.description || '',
      alt_text: section.alt_text || '',
      is_active: section.is_active,
      sort_order: section.sort_order.toString(),
    });

    // Set existing image if any
    if (section.image_url) {
      setSectionImage([{
        url: section.image_url,
        alt_text: section.alt_text || section.title,
        sort_order: 1
      }]);
    } else {
      setSectionImage([]);
    }

    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta seção da empresa?')) return;

    try {
      const { error } = await supabaseAdmin
        .from('company_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Seção da empresa removida com sucesso!');
      fetchSections();
    } catch (error) {
      console.error('Error deleting company section:', error);
      toast.error('Erro ao remover seção da empresa');
    }
  };

  const handleToggleActive = async (section: CompanySection) => {
    try {
      const { error } = await supabaseAdmin
        .from('company_sections')
        .update({ is_active: !section.is_active })
        .eq('id', section.id);

      if (error) throw error;
      toast.success(`Seção ${!section.is_active ? 'ativada' : 'desativada'} com sucesso!`);
      fetchSections();
    } catch (error) {
      console.error('Error toggling section status:', error);
      toast.error('Erro ao alterar status da seção');
    }
  };

  const resetForm = () => {
    setFormData({
      section_key: '',
      title: '',
      description: '',
      alt_text: '',
      is_active: true,
      sort_order: '',
    });
    setSectionImage([]);
    setEditingSection(null);
  };

  const getSectionTypeLabel = (sectionKey: string) => {
    switch (sectionKey) {
      case 'estrutura_1': return 'Estrutura 1';
      case 'estrutura_2': return 'Estrutura 2';
      case 'estrutura_3': return 'Estrutura 3';
      case 'visite_loja': return 'Visite Nossa Loja';
      default: return sectionKey;
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
          <h1 className="text-2xl font-bold text-gray-900">Seções da Empresa</h1>
          <p className="text-gray-600">Gerencie as imagens e conteúdo das seções da página Empresa</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Seção
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSection ? 'Editar Seção da Empresa' : 'Nova Seção da Empresa'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="section_key">Chave da Seção</Label>
                  <Input
                    id="section_key"
                    value={formData.section_key}
                    onChange={(e) => setFormData(prev => ({ ...prev, section_key: e.target.value }))}
                    placeholder="estrutura_1, visite_loja, etc."
                    required
                    disabled={!!editingSection}
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
              </div>

              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Estrutura de Ponta"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição detalhada da seção..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="alt_text">Texto Alternativo da Imagem</Label>
                <Input
                  id="alt_text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                  placeholder="Descrição da imagem para acessibilidade"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Image className="h-4 w-4" />
                  Imagem da Seção
                </Label>
                <ImageUpload
                  existingImages={sectionImage}
                  onImagesChange={setSectionImage}
                  maxImages={1}
                  className="border-dashed border-2 border-gray-200 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Esta imagem aparecerá na seção correspondente da página Empresa.
                </p>
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
                  {editingSection ? 'Atualizar' : 'Criar'}
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
              <CardTitle>Seções Configuradas ({sections.filter(s => s.is_active).length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagem</TableHead>
                    <TableHead>Ordem</TableHead>
                    <TableHead>Seção</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sections.map((section) => (
                    <TableRow key={section.id}>
                      <TableCell>
                        {section.image_url ? (
                          <img
                            src={section.image_url}
                            alt={section.alt_text || section.title}
                            className="w-12 h-12 object-cover rounded-lg border"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg border flex items-center justify-center">
                            <Image className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{section.sort_order}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {getSectionTypeLabel(section.section_key)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{section.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {section.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={section.is_active}
                            onCheckedChange={() => handleToggleActive(section)}
                          />
                          <span className={cn(
                            "text-sm",
                            section.is_active ? "text-green-600" : "text-red-600"
                          )}>
                            {section.is_active ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(section)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(section.id)}
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview das Seções</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                Assim ficará exibido na página Empresa:
              </div>

              <div className="space-y-4">
                {sections
                  .filter(s => s.is_active)
                  .slice(0, 4)
                  .map((section) => (
                    <div key={section.id} className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        <span className="text-xs text-blue-600 font-medium">
                          {getSectionTypeLabel(section.section_key)}
                        </span>
                      </div>
                      {section.image_url && (
                        <div className="aspect-video bg-white rounded-lg mb-3 overflow-hidden">
                          <img
                            src={section.image_url}
                            alt={section.alt_text || section.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <h4 className="font-medium text-sm text-gray-900 mb-1">
                        {section.title}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {section.description}
                      </p>
                    </div>
                  ))}
              </div>

              {sections.filter(s => s.is_active).length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Nenhuma seção ativa para exibir
                </div>
              )}
            </CardContent>
          </Card>

          <TechnologyCarousel />

          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">📍 Seções Disponíveis</h4>
                <ul className="space-y-1 text-xs">
                  <li><strong>estrutura_1:</strong> Primeira seção "Estrutura Pronta"</li>
                  <li><strong>estrutura_2:</strong> Segunda seção "Estrutura Pronta"</li>
                  <li><strong>estrutura_3:</strong> Terceira seção "Estrutura Pronta"</li>
                  <li><strong>visite_loja:</strong> Seção "Visite Nossa Loja"</li>
                </ul>
              </div>

              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">🎯 Como Usar</h4>
                <p>Edite as seções existentes ou crie novas. As mudanças aparecerão automaticamente na página Empresa do site.</p>
              </div>

              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">📷 Imagens</h4>
                <p>Use imagens com proporção 16:9 para melhor resultado visual. Formate recomendado: 600x400px ou maior.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanySections;