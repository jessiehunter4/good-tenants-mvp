
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIntegrationRequests } from "@/hooks/useIntegrationRequests";
import { Plus } from "lucide-react";

const integrationRequestSchema = z.object({
  integration_name: z.string().min(1, "Integration name is required"),
  provider_name: z.string().min(1, "Provider name is required"),
  business_justification: z.string().min(10, "Please provide a detailed justification"),
  priority: z.enum(["low", "medium", "high", "critical"]),
});

type IntegrationRequestForm = z.infer<typeof integrationRequestSchema>;

interface IntegrationRequestModalProps {
  children?: React.ReactNode;
}

const IntegrationRequestModal = ({ children }: IntegrationRequestModalProps) => {
  const [open, setOpen] = useState(false);
  const { createIntegrationRequest, loading } = useIntegrationRequests();

  const form = useForm<IntegrationRequestForm>({
    resolver: zodResolver(integrationRequestSchema),
    defaultValues: {
      integration_name: "",
      provider_name: "",
      business_justification: "",
      priority: "medium",
    },
  });

  const onSubmit = async (data: IntegrationRequestForm) => {
    const success = await createIntegrationRequest(data);
    if (success) {
      setOpen(false);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Request Integration
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request New Integration</DialogTitle>
          <DialogDescription>
            Submit a request for a new API integration or service connection.
            Our team will review and prioritize your request.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="integration_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Integration Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., License Verification API" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provider_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider/Service</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., State Licensing Board" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low - Nice to have</SelectItem>
                      <SelectItem value="medium">Medium - Would help efficiency</SelectItem>
                      <SelectItem value="high">High - Important for operations</SelectItem>
                      <SelectItem value="critical">Critical - Blocking current work</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="business_justification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Justification</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain how this integration would benefit your workflow, what problem it solves, and any specific requirements..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Please provide details about the business need and expected benefits.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationRequestModal;
