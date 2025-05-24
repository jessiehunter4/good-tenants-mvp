
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Document {
  id: string;
  document_type: string;
  file_name: string;
  file_url: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  upload_date: string;
  storage_path?: string;
  bucket_id?: string;
  file_size?: number;
}

export const useDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    if (!user) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('application_documents')
        .select('*')
        .eq('tenant_id', user.id)
        .order('upload_date', { ascending: false });

      if (fetchError) throw fetchError;

      setDocuments(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const refetch = () => {
    fetchDocuments();
  };

  return {
    documents,
    loading,
    error,
    refetch
  };
};
