
import { supabase } from "@/integrations/supabase/client";

export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
): Promise<{ data: any; error: any }> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  return { data, error };
};

export const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

export const deleteFile = async (
  bucket: string,
  path: string
): Promise<{ data: any; error: any }> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  return { data, error };
};

export const listFiles = async (
  bucket: string,
  path?: string
): Promise<{ data: any; error: any }> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(path, {
      limit: 100,
      offset: 0
    });

  return { data, error };
};

// Helper function to generate file path with user ID
export const generateUserFilePath = (userId: string, filename: string): string => {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${userId}/${timestamp}_${sanitizedFilename}`;
};
