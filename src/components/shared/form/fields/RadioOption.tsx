
import React from "react";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroupItem } from "@/components/ui/radio-group";

interface RadioOptionProps {
  value: string;
  label: string;
}

export const RadioOption = ({ value, label }: RadioOptionProps) => (
  <FormItem className="flex items-center space-x-3 space-y-0">
    <FormControl>
      <RadioGroupItem value={value} />
    </FormControl>
    <FormLabel className="font-normal">
      {label}
    </FormLabel>
  </FormItem>
);
