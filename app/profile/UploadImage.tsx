'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { getAuthUser } from '@/lib/actions';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function AvatarUpload({
  initialUrl,
  size = 96,
  username,
}: {
  initialUrl: string | null;
  size?: number;
  username?: string;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const handleImageClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const user = await getAuthUser();
      const userid = user?.id;

      if (!userid) {
        throw new Error('User not authenticated');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed.');
      }

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Image size must be less than 2MB');
      }

      // Delete existing files
      const { data: existingFiles, error: listError } = await supabase.storage
        .from('profiles')
        .list(userid + '/');

      if (listError) {
        console.error('Error listing files:', listError);
      } else if (existingFiles && existingFiles.length > 0) {
        const filesToDelete = existingFiles.map(
          (file) => `${userid}/${file.name}`
        );
        const { error: deleteError } = await supabase.storage
          .from('profiles')
          .remove(filesToDelete);

        if (deleteError) {
          console.error('Error deleting old files:', deleteError);
        }
      }

      // Upload new file
      const fileName = `${userid}/${uuidv4()}`;
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);
      const publicURL = publicUrlData.publicUrl;

      // Update user profile
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicURL })
        .eq('id', userid);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setUrl(publicURL);
      
      // Show success message
      toast({
        title: "Success",
        description: "Profile picture updated successfully!",
      });
      
      // Refresh the page to show updated avatar
      router.refresh();
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Error uploading avatar!',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative inline-block group">
      <Avatar
        className="cursor-pointer transition-transform hover:scale-105"
        onClick={handleImageClick}
        style={{ width: size, height: size }}
      >
        <AvatarImage src={url || ''} alt="Profile" />
        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-2xl">
          {username?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <Button
        size="icon"
        className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-lg"
        onClick={handleImageClick}
        aria-label="Upload new image"
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
      </Button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={uploadAvatar}
        className="hidden"
        accept="image/*"
        disabled={uploading}
      />
      
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
    </div>
  );
}
