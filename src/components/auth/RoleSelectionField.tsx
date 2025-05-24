
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Control } from "react-hook-form";
import { RegisterFormValues } from "./RegisterFormSchema";

interface RoleSelectionFieldProps {
  control: Control<RegisterFormValues>;
}

export const RoleSelectionField = ({ control }: RoleSelectionFieldProps) => {
  return (
    <FormField
      control={control}
      name="role"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>I am a:</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="tenant" />
                </FormControl>
                <FormLabel className="font-normal">
                  Tenant (I'm looking for a home)
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="agent" />
                </FormControl>
                <FormLabel className="font-normal">
                  Real Estate Agent
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="landlord" />
                </FormControl>
                <FormLabel className="font-normal">
                  Landlord/Property Owner
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="admin" />
                </FormControl>
                <FormLabel className="font-normal">
                  Administrator
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
