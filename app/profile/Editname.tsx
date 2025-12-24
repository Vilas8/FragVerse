'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UpdateUsername } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface EditableUsernameProps {
  username: string;
  userid: string;
}

const EditableUsername: React.FC<EditableUsernameProps> = ({
  username,
  userid,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(username);
  const [currentName, setCurrentName] = useState(username);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSaveName = async () => {
    if (tempName.length < 4) {
      setError('Username must be more than 3 letters.');
      return;
    }
    if (tempName === currentName) {
      setIsEditing(false);
      return;
    }
    if (tempName.length > 20) {
      setError('Username must be less than 20 letters.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      const result = await UpdateUsername(tempName, userid);
      
      if (result.success) {
        setCurrentName(tempName);
        setIsEditing(false);
        // Refresh the page to show updated username everywhere
        router.refresh();
      } else {
        setError(result.error || 'Failed to update username');
      }
    } catch (error) {
      console.error('Error updating username:', error);
      setError('Failed to update username. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setTempName(currentName);
    setError('');
  };

  return (
    <div className="space-y-2">
      {isEditing ? (
        <>
          <Input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className="text-2xl font-bold"
            aria-label="Edit username"
            maxLength={20}
            disabled={isLoading}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={handleSaveName} size="sm" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm" disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{currentName}</h2>
          <Button onClick={handleEdit} size="sm" variant="outline">
            Edit username
          </Button>
        </>
      )}
    </div>
  );
};

export default EditableUsername;
