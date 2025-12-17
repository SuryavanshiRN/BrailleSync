import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TextInput } from '@/components/translation/TextInput';
import { ImageUpload } from '@/components/translation/ImageUpload';
import { AudioUpload } from '@/components/translation/AudioUpload';
import { MicrophoneInput } from '@/components/translation/MicrophoneInput';
import { BrailleDisplay } from '@/components/translation/BrailleDisplay';
import { AudioPlayer } from '@/components/translation/AudioPlayer';
import { textToBraille } from '@/utils/braille';
import { saveTranslation } from '@/db/api';
import { useToast } from '@/hooks/use-toast';
import { Save, Trash2 } from 'lucide-react';

export default function TranslationPage() {
  const [inputText, setInputText] = useState('');
  const [brailleText, setBrailleText] = useState('');
  const [currentMethod, setCurrentMethod] = useState<'text' | 'image' | 'audio' | 'microphone'>('text');
  const { toast } = useToast();

  useEffect(() => {
    if (inputText) {
      const braille = textToBraille(inputText);
      setBrailleText(braille);
    } else {
      setBrailleText('');
    }
  }, [inputText]);

  const handleTextExtracted = (text: string, method: 'image' | 'audio' | 'microphone') => {
    setInputText(text);
    setCurrentMethod(method);
  };

  const handleSave = async () => {
    if (!inputText || !brailleText) {
      toast({
        title: 'Nothing to save',
        description: 'Please enter text first',
        variant: 'destructive',
      });
      return;
    }

    const result = await saveTranslation(inputText, brailleText, currentMethod);
    if (result) {
      toast({
        title: 'Saved',
        description: 'Translation saved to history',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to save translation',
        variant: 'destructive',
      });
    }
  };

  const handleClear = () => {
    setInputText('');
    setBrailleText('');
    setCurrentMethod('text');
    toast({
      title: 'Cleared',
      description: 'All fields have been cleared',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Translation Tool</span>
          </h1>
          <p className="text-muted-foreground">
            Convert text to Braille using multiple input methods
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Input</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="text" onValueChange={(value) => setCurrentMethod(value as any)}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="text">Text</TabsTrigger>
                    <TabsTrigger value="image">Image</TabsTrigger>
                    <TabsTrigger value="audio">Audio</TabsTrigger>
                    <TabsTrigger value="microphone">Mic</TabsTrigger>
                  </TabsList>
                  <TabsContent value="text" className="mt-4">
                    <TextInput value={inputText} onChange={setInputText} />
                  </TabsContent>
                  <TabsContent value="image" className="mt-4">
                    <ImageUpload onTextExtracted={(text) => handleTextExtracted(text, 'image')} />
                  </TabsContent>
                  <TabsContent value="audio" className="mt-4">
                    <AudioUpload onTextExtracted={(text) => handleTextExtracted(text, 'audio')} />
                  </TabsContent>
                  <TabsContent value="microphone" className="mt-4">
                    <MicrophoneInput onTextExtracted={(text) => handleTextExtracted(text, 'microphone')} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <BrailleDisplay brailleText={brailleText} />

            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={!brailleText} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save to History
              </Button>
              <Button onClick={handleClear} variant="outline" disabled={!inputText}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <AudioPlayer text={inputText} />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Input Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[100px] p-4 bg-muted rounded-lg">
                  {inputText ? (
                    <p className="text-sm break-words">{inputText}</p>
                  ) : (
                    <p className="text-muted-foreground text-sm text-center">
                      Input text will appear here...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
