
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface FileUploadInputProps {
  selectedType: string;
  uploading: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({ 
  selectedType, 
  uploading, 
  onFileUpload 
}) => {
  return (
    <div>
      <Label htmlFor="file-upload">Upload File</Label>
      <div className="flex gap-2">
        <Input
          id="file-upload"
          type="file"
          onChange={onFileUpload}
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
  );
};

export default FileUploadInput;
