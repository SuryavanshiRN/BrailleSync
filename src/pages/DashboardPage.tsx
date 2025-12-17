import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTranslationStats, getTranslations } from '@/db/api';
import type { TranslationStats, Translation } from '@/types';
import { ArrowRight, Type, Image, Music, Mic, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [stats, setStats] = useState<TranslationStats>({
    total: 0,
    byMethod: { text: 0, image: 0, audio: 0, microphone: 0 },
  });
  const [recentTranslations, setRecentTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [statsData, translationsData] = await Promise.all([
        getTranslationStats(),
        getTranslations(5),
      ]);
      setStats(statsData);
      setRecentTranslations(translationsData);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const methodIcons = {
    text: Type,
    image: Image,
    audio: Music,
    microphone: Mic,
  };

  const statCards = [
    {
      title: 'Total Translations',
      value: stats.total,
      icon: FileText,
      color: 'text-primary',
    },
    {
      title: 'Text Input',
      value: stats.byMethod.text,
      icon: Type,
      color: 'text-chart-1',
    },
    {
      title: 'Image Upload',
      value: stats.byMethod.image,
      icon: Image,
      color: 'text-chart-2',
    },
    {
      title: 'Audio Upload',
      value: stats.byMethod.audio,
      icon: Music,
      color: 'text-chart-3',
    },
    {
      title: 'Microphone',
      value: stats.byMethod.microphone,
      icon: Mic,
      color: 'text-chart-4',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your translation activity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Translations</CardTitle>
              <CardDescription>
                Your most recent Braille conversions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground text-center py-8">Loading...</p>
              ) : recentTranslations.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No translations yet. Start by creating your first translation!
                </p>
              ) : (
                <div className="space-y-4">
                  {recentTranslations.map((translation) => {
                    const Icon = methodIcons[translation.input_method];
                    return (
                      <div
                        key={translation.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {translation.input_text}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(translation.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <Button asChild variant="outline" className="w-full mt-4">
                <Link to="/history">
                  View All History
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with common tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start" size="lg">
                <Link to="/translate">
                  <Type className="mr-2 w-5 h-5" />
                  New Translation
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" size="lg">
                <Link to="/history">
                  <FileText className="mr-2 w-5 h-5" />
                  View History
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
