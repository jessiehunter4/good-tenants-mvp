
import React from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioOption } from "./RadioOption";

interface RadioOptionType {
  value: string;
  label: string;
}

interface RadioGroupFieldProps {
  field: any;
  options: RadioOptionType[];
}

export const RadioGroupField = ({ field, options }: RadioGroupFieldProps) => (
  <RadioGroup
    onValueChange={field.onChange}
    defaultValue={field.value}
    className="flex flex-col space-y-1"
  >
    {options.map((option) => (
      <RadioOption key={option.value} value={option.value} label={option.label} />
    ))}
  </RadioGroup>
);
