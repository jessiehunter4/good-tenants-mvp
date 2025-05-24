
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { uploadFile, generateUserFilePath } from "@/utils/storage";

export const useDocumentUpload = (onDocumentUploaded?: () => void) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedType || !user) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);

      // Generate storage path
      const storagePath = generateUserFilePath(user.id, file.name);
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await uploadFile(
        'tenant-documents',
        storagePath,
        file
      );

      if (uploadError) {
        throw uploadError;
      }

      // Insert document record into database
      const { error: dbError } = await supabase
        .from('application_documents')
        .insert({
          tenant_id: user.id,
          document_type: selectedType,
          file_name: file.name,
          file_url: `tenant-documents/${storagePath}`,
          file_size: file.size,
          storage_path: storagePath,
          bucket_id: 'tenant-documents'
        });

      if (dbError) throw dbError;

      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded and is pending verification.",
      });

      setSelectedType("");
      // Clear the file input
      event.target.value = "";
      
      if (onDocumentUploaded) onDocumentUploaded();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  }, [selectedType, user, toast, onDocumentUploaded]);

  return {
    uploading,
    selectedType,
    setSelectedType,
    handleFileUpload
  };
};
