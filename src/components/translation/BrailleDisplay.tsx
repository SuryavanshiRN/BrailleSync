import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BrailleDisplayProps {
  brailleText: string;
}

export const BrailleDisplay = ({ brailleText }: BrailleDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(brailleText);
      setCopied(true);
      toast({
        title: 'Copied',
        description: 'Braille text copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy text',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Braille Output</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!brailleText}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="min-h-[150px] p-4 bg-muted rounded-lg">
          {brailleText ? (
            <p className="text-4xl leading-relaxed break-all font-mono">
              {brailleText}
            </p>
          ) : (
            <p className="text-muted-foreground text-center">
              Braille output will appear here...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
