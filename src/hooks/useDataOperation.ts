
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { PostgrestError } from "@supabase/supabase-js";

interface DataOperationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: PostgrestError) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useDataOperation<T>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<PostgrestError | null>(null);
  const { toast } = useToast();

  const executeOperation = async <D>(
    operation: () => Promise<{ data: D; error: PostgrestError | null }>,
    options?: DataOperationOptions<D>
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await operation();

      if (error) {
        setError(error);
        console.error("Operation error:", error);
        toast({
          title: "Error",
          description: options?.errorMessage || "An error occurred while processing your request.",
          variant: "destructive",
        });
        if (options?.onError) options.onError(error);
        return { data: null, error };
      }

      if (options?.successMessage) {
        toast({
          title: "Success",
          description: options.successMessage,
        });
      }

      if (options?.onSuccess) options.onSuccess(data);

      return { data, error: null };
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return { data: null, error: err as PostgrestError };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    executeOperation,
  };
}
