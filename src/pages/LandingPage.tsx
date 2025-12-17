import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Type, Image, Music, Mic, Volume2, History } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const features = [
    {
      icon: Type,
      title: 'Text Input',
      description: 'Type or paste text directly for instant Braille conversion',
    },
    {
      icon: Image,
      title: 'Image Recognition',
      description: 'Upload images containing text for automatic extraction and conversion',
    },
    {
      icon: Music,
      title: 'Audio Upload',
      description: 'Upload audio files to transcribe and convert to Braille',
    },
    {
      icon: Mic,
      title: 'Voice Recording',
      description: 'Record your voice in real-time for instant transcription',
    },
    {
      icon: Volume2,
      title: 'Audio Playback',
      description: 'Listen to your text with high-quality text-to-speech',
    },
    {
      icon: History,
      title: 'Translation History',
      description: 'Access and manage all your previous translations',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl xl:text-6xl font-bold text-foreground">
            Braille Translator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Convert text to Braille language with multiple input methods and audio feedback
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild size="lg">
              <Link to="/translate">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/dashboard">
                View Dashboard
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 xl:p-12">
            <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Ready to get started?</h2>
                <p className="text-primary-foreground/90">
                  Start converting text to Braille with our easy-to-use translation tool
                </p>
              </div>
              <Button asChild size="lg" variant="secondary">
                <Link to="/translate">
                  Start Translating
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
