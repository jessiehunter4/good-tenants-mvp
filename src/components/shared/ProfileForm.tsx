
import { ReactNode } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProfileFormProps {
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
                          <textarea
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[100px]"
                            placeholder={field.placeholder}
                            {...fieldProps}
                          />
                        ) : field.component === "custom" ? (
                          field.customComponent
                        ) : (
                          <Input 
                            type={field.type || "text"} 
                            placeholder={field.placeholder}
                            {...fieldProps}
                          />
                        )}
                      </FormControl>
                      {field.description && (
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

export default ProfileForm;
