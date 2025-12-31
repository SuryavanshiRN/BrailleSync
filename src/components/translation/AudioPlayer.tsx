import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Download, Loader2 } from 'lucide-react';
import { textToSpeech } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AudioPlayerProps {
  text: string;
}

export const AudioPlayer = ({ text }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const generateAudio = async () => {
    if (!text) {
      toast({
        title: 'No text',
        description: 'Please enter text first',
        variant: 'destructive',
      });
      return null;
    }

    setIsLoading(true);
    try {
      const audioBlob = await textToSpeech(text);
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      const newAudio = new Audio(url);
      newAudio.onended = () => setIsPlaying(false);
      setAudio(newAudio);
      
      return newAudio;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate audio',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = async () => {
    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
    } else {
      let audioToPlay = audio;
      if (!audioToPlay) {
        audioToPlay = await generateAudio();
      }
      
      if (audioToPlay) {
        audioToPlay.play();
        setIsPlaying(true);
      }
    }
  };

  const handleDownload = async () => {
    let urlToDownload = audioUrl;
    
    if (!urlToDownload) {
      const newAudio = await generateAudio();
      if (!newAudio) return;
      urlToDownload = audioUrl;
    }

    if (urlToDownload) {
      const link = document.createElement('a');
      link.href = urlToDownload;
      link.download = 'braille-audio.mp3';
      link.click();
      toast({
        title: 'Success',
        description: 'Audio downloaded successfully',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Audio Playback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={handlePlay}
            disabled={!text || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Play
              </>
            )}
          </Button>
          <Button
            onClick={handleDownload}
            disabled={!text || isLoading}
            variant="outline"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
