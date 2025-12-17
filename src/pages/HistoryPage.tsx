import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getTranslations, deleteTranslation, searchTranslations } from '@/db/api';
import type { Translation } from '@/types';
import { Type, Image, Music, Mic, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function HistoryPage() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadTranslations = async () => {
    setIsLoading(true);
    const data = await getTranslations(100);
    setTranslations(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadTranslations();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadTranslations();
      return;
    }

    setIsLoading(true);
    const results = await searchTranslations(searchQuery);
    setTranslations(results);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const success = await deleteTranslation(deleteId);
    if (success) {
      setTranslations(translations.filter((t) => t.id !== deleteId));
      toast({
        title: 'Deleted',
        description: 'Translation deleted successfully',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete translation',
        variant: 'destructive',
      });
    }
    setDeleteId(null);
  };

  const methodIcons = {
    text: Type,
    image: Image,
    audio: Music,
    microphone: Mic,
  };

  const methodLabels = {
    text: 'Text Input',
    image: 'Image Upload',
    audio: 'Audio Upload',
    microphone: 'Microphone',
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Translation History</h1>
          <p className="text-muted-foreground">
            View and manage your previous translations
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Search translations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        ) : translations.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">
                {searchQuery ? 'No translations found' : 'No translation history yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {translations.map((translation) => {
              const Icon = methodIcons[translation.input_method];
              return (
                <Card key={translation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            {methodLabels[translation.input_method]}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(translation.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Input:</p>
                          <p className="text-sm text-muted-foreground break-words">
                            {translation.input_text}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Braille:</p>
                          <p className="text-2xl font-mono break-all">
                            {translation.braille_output}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(translation.id)}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Translation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this translation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
