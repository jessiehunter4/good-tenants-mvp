
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormLabel } from "@/components/ui/form";

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupFieldProps {
  field: any;
  options: CheckboxOption[];
}

export const CheckboxGroupField = ({ field, options }: CheckboxGroupFieldProps) => {
  const handleChange = (optionValue: string, checked: boolean) => {
    const currentValues = field.value || [];
    if (checked) {
      // Add value if not already present
      const newValues = currentValues.includes(optionValue) 
        ? currentValues 
        : [...currentValues, optionValue];
      field.onChange(newValues);
    } else {
      // Remove value
      const newValues = currentValues.filter((value: string) => value !== optionValue);
      field.onChange(newValues);
    }
  };

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <div key={option.value} className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value?.includes(option.value) || false}
              onCheckedChange={(checked) => handleChange(option.value, !!checked)}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{option.label}</FormLabel>
          </div>
        </div>
      ))}
    </div>
  );
};
