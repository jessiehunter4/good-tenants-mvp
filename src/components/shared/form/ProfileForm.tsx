
import React, { ReactNode } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Import form field components
import { DatePickerField } from "./fields/DatePickerField";
import { CheckboxField } from "./fields/CheckboxField";
import { RadioOption } from "./fields/RadioOption";
import { RadioGroupField } from "./fields/RadioGroupField";

export interface ProfileFormProps {
  title: string;
  description: string;
  form: any;
  onSubmit: (values: any) => Promise<void>;
  isSubmitting: boolean;
  onCancel?: () => void;
  fields: {
    name: string;
    label: string;
    description?: string;
    placeholder?: string;
    type?: string;
    component?: "input" | "textarea" | "custom";
    customComponent?: ReactNode;
  }[];
  submitButtonText?: string;
  cancelButtonText?: string;
}

const ProfileForm = ({
  title,
  description,
  form,
  onSubmit,
  isSubmitting,
  onCancel,
  fields,
  submitButtonText = "Save and Continue",
  cancelButtonText = "Back to Home",
}: ProfileFormProps) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-8">{title}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {fields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        {field.component === "textarea" ? (
                          <Textarea
                            className="min-h-[100px]"
                            placeholder={field.placeholder}
                            {...fieldProps}
                          />
                        ) : field.component === "custom" ? (
                          React.cloneElement(field.customComponent as React.ReactElement, { field: fieldProps })
                        ) : (
                          <Input 
                            type={field.type || "text"} 
                            placeholder={field.placeholder}
                            {...fieldProps}
                          />
                        )}
                      </FormControl>
                      {field.description && field.component !== "custom" && (
                        <FormDescription>{field.description}</FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : submitButtonText}
              </Button>
            </form>
          </Form>
        </CardContent>
        {onCancel && (
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              {cancelButtonText}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

// Export form field components
ProfileForm.DatePicker = DatePickerField;
ProfileForm.Checkbox = CheckboxField;
ProfileForm.RadioOption = RadioOption;
ProfileForm.RadioGroup = RadioGroupField;

export default ProfileForm;
