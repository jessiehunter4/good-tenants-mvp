
import { LockIcon } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { RegisterFormValues } from "./RegisterFormSchema";

interface AdminCodeFieldProps {
  control: Control<RegisterFormValues>;
}

export const AdminCodeField = ({ control }: AdminCodeFieldProps) => {
  return (
    <FormField
      control={control}
      name="adminCode"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Admin Registration Code</FormLabel>
          <FormControl>
            <div className="relative">
              <Input type="password" {...field} />
              <LockIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
