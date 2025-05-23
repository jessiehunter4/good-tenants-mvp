
import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, File, Check, X, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const documentTypes = [
  { value: 'income_verification', label: 'Income Verification' },
  { value: 'credit_report', label: 'Credit Report' },
  { value: 'references', label: 'References' },
  { value: 'id_verification', label: 'ID Verification' },
  { value: 'bank_statements', label: 'Bank Statements' },
  { value: 'employment_letter', label: 'Employment Letter' }
];

interface Document {
  id: string;
  document_type: string;
  file_name: string;
  file_url: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  upload_date: string;
}

interface DocumentUploadAreaProps {
  documents: Document[];
  onDocumentUploaded?: () => void;
}

const DocumentUploadArea: React.FC<DocumentUploadAreaProps> = ({ 
  documents, 
  onDocumentUploaded 
}) => {
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

      // For demo purposes, we'll create a mock file URL
      // In a real app, you'd upload to Supabase Storage
      const mockFileUrl = `https://example.com/documents/${user.id}/${file.name}`;

      const { error } = await (supabase as any)
        .from('application_documents')
        .insert({
          tenant_id: user.id,
          document_type: selectedType,
          file_name: file.name,
          file_url: mockFileUrl,
          file_size: file.size
        });

      if (error) throw error;

      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded and is pending verification.",
      });

      setSelectedType("");
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <Check className="h-4 w-4 text-green-600" />;
      case 'rejected': return <X className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Application Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Section */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="document-type">Document Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="file-upload">Upload File</Label>
            <div className="flex gap-2">
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                disabled={!selectedType || uploading}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="flex-1"
              />
              <Button 
                disabled={!selectedType || uploading} 
                variant="outline"
                className="px-3"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Accepted formats: PDF, DOC, DOCX, JPG, PNG (max 10MB)
            </p>
          </div>
        </div>

        {/* Documents List */}
        {documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Uploaded Documents</h4>
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{doc.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {documentTypes.find(t => t.value === doc.document_type)?.label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(doc.verification_status)}
                  <Badge className={getStatusColor(doc.verification_status)}>
                    {doc.verification_status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUploadArea;
