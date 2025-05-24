
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tables } from "@/integrations/supabase/types";
import DocumentTypeSelect from "./document-upload/DocumentTypeSelect";
import FileUploadInput from "./document-upload/FileUploadInput";
import DocumentList from "./document-upload/DocumentList";
import { useDocumentUpload } from "./document-upload/useDocumentUpload";

type Document = Tables<'application_documents'>;

interface DocumentUploadAreaProps {
  documents: Document[];
  onDocumentUploaded?: () => void;
}

const DocumentUploadArea: React.FC<DocumentUploadAreaProps> = ({ 
  documents, 
  onDocumentUploaded 
}) => {
  const {
    uploading,
    selectedType,
    setSelectedType,
    handleFileUpload
  } = useDocumentUpload(onDocumentUploaded);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Application Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Section */}
        <div className="space-y-3">
          <DocumentTypeSelect 
            value={selectedType} 
            onChange={setSelectedType} 
          />
          <FileUploadInput 
            selectedType={selectedType}
            uploading={uploading}
            onFileUpload={handleFileUpload}
          />
        </div>

        {/* Documents List */}
        <DocumentList documents={documents} />
      </CardContent>
    </Card>
  );
};

export default DocumentUploadArea;
