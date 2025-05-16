
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";

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

// Define custom sub-components
const DatePicker = ({ field, description, minDate, maxDate }) => (
  <>
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-full pl-3 text-left font-normal",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value ? (
              format(field.value, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          disabled={(date) => {
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            return false;
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
    {description && <FormDescription>{description}</FormDescription>}
  </>
);

const CheckboxField = ({ field, label }) => (
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

const RadioOption = ({ value, label }) => (
  <FormItem className="flex items-center space-x-3 space-y-0">
    <FormControl>
      <RadioGroupItem value={value} />
    </FormControl>
    <FormLabel className="font-normal">
      {label}
    </FormLabel>
  </FormItem>
);

const RadioGroupField = ({ field, options }) => (
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
                          field.customComponent
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

// Add custom components as properties to the ProfileForm component
ProfileForm.DatePicker = DatePicker;
ProfileForm.Checkbox = CheckboxField;
ProfileForm.RadioOption = RadioOption;
ProfileForm.RadioGroup = RadioGroupField;

export default ProfileForm;
