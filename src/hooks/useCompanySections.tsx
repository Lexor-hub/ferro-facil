import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CompanySection {
  id: string;
  section_key: string;
  title: string;
  description: string | null;
  image_url: string | null;
  alt_text: string | null;
  is_active: boolean;
  sort_order: number;
}

export const useCompanySections = () => {
  const [sections, setSections] = useState<CompanySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('company_sections')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setSections(data || []);
    } catch (err) {
      console.error('Error fetching company sections:', err);
      setError('Failed to load company sections');
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const getSectionByKey = (sectionKey: string): CompanySection | undefined => {
    return sections.find(section => section.section_key === sectionKey);
  };

  const getStructureSections = (): CompanySection[] => {
    return sections.filter(section =>
      section.section_key.startsWith('estrutura_')
    ).sort((a, b) => a.sort_order - b.sort_order);
  };

  const getVisitStoreSections = (): CompanySection[] => {
    return sections.filter(section =>
      section.section_key === 'visite_loja'
    );
  };

  return {
    sections,
    loading,
    error,
    getSectionByKey,
    getStructureSections,
    getVisitStoreSections,
    refetch: fetchSections
  };
};