
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormLabel } from "@/components/ui/form";

interface CheckboxFieldProps {
  field: any;
  label: string;
}

export const CheckboxField = ({ field, label }: CheckboxFieldProps) => (
  <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
    <FormControl>
      <Checkbox
        checked={field.value}
        onCheckedChange={field.onChange}
      />
    </FormControl>
    <div className="space-y-1 leading-none">
      <FormLabel>{label}</FormLabel>
    </div>
  </div>
);
