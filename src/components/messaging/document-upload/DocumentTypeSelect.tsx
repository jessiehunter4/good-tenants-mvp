
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const documentTypes = [
  { value: 'income_verification', label: 'Income Verification' },
  { value: 'credit_report', label: 'Credit Report' },
  { value: 'references', label: 'References' },
  { value: 'id_verification', label: 'ID Verification' },
  { value: 'bank_statements', label: 'Bank Statements' },
  { value: 'employment_letter', label: 'Employment Letter' }
];

interface DocumentTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const DocumentTypeSelect: React.FC<DocumentTypeSelectProps> = ({ value, onChange }) => {
  return (
    <div>
      <Label htmlFor="document-type">Document Type</Label>
      <Select value={value} onValueChange={onChange}>
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
  );
};

export default DocumentTypeSelect;
export { documentTypes };
