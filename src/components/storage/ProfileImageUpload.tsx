
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { uploadFile, generateUserFilePath, getPublicUrl } from "@/utils/storage";

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded?: (imageUrl: string) => void;
  className?: string;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  currentImageUrl,
  onImageUploaded,
  className = ""
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPEG, PNG, or WebP image",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);

      // Create preview
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Generate storage path
      const storagePath = generateUserFilePath(user.id, file.name);
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await uploadFile(
        'profile-images',
        storagePath,
        file
      );

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const publicUrl = getPublicUrl('profile-images', storagePath);

      toast({
        title: "Profile image updated",
        description: "Your profile image has been uploaded successfully.",
      });

      // Clear the file input
      event.target.value = "";
      
      if (onImageUploaded) {
        onImageUploaded(publicUrl);
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  }, [user, toast, onImageUploaded]);

  const displayImageUrl = previewUrl || currentImageUrl;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={displayImageUrl} alt="Profile" />
          <AvatarFallback>
            <Camera className="h-8 w-8 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        
        <div className="space-y-2">
          <Label htmlFor="profile-image-upload">Profile Image</Label>
          <div className="flex gap-2">
            <Input
              id="profile-image-upload"
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              accept="image/jpeg,image/png,image/webp"
              className="flex-1"
            />
            <Button 
              disabled={uploading} 
              variant="outline"
              className="px-3"
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Accepted formats: JPEG, PNG, WebP (max 5MB)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageUpload;
