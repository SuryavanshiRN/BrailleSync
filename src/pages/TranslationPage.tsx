import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextInput } from "@/components/translation/TextInput";
import { ImageUpload } from "@/components/translation/ImageUpload";
import { AudioUpload } from "@/components/translation/AudioUpload";
import { MicrophoneInput } from "@/components/translation/MicrophoneInput";
import { FileUpload } from "@/components/translation/FileUpload";
import { BrailleInput } from "@/components/translation/BrailleInput";
import { BrailleDisplay } from "@/components/translation/BrailleDisplay";
import { AudioPlayer } from "@/components/translation/AudioPlayer";
import { textToBraille, brailleToText } from "@/utils/braille";
import { saveTranslation } from "@/db/api";
import { useToast } from "@/hooks/use-toast";
import { Save, Trash2, ArrowRightLeft } from "lucide-react";

export default function TranslationPage() {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as
    | "text"
    | "image"
    | "audio"
    | "microphone"
    | "file"
    | null;

  const [inputText, setInputText] = useState("");
  const [brailleText, setBrailleText] = useState("");
  const [reverseMode, setReverseMode] = useState(false);
  const [currentMethod, setCurrentMethod] = useState<
    "text" | "image" | "audio" | "microphone" | "file" | "braille"
  >(tabFromUrl || "text");
  const { toast } = useToast();

  useEffect(() => {
    if (reverseMode) {
      // Braille to Text mode
      if (brailleText) {
        const text = brailleToText(brailleText);
        setInputText(text);
      } else {
        setInputText("");
      }
    } else {
      // Text to Braille mode
      if (inputText) {
        const braille = textToBraille(inputText);
        setBrailleText(braille);
      } else {
        setBrailleText("");
      }
    }
  }, [inputText, brailleText, reverseMode]);

  const handleTextExtracted = (
    text: string,
    method: "image" | "audio" | "microphone" | "file"
  ) => {
    setInputText(text);
    setCurrentMethod(method);
  };

  const handleBrailleInput = (braille: string) => {
    setBrailleText(braille);
    setCurrentMethod("braille");
  };

  const toggleMode = () => {
    setReverseMode(!reverseMode);
    // Clear both fields when switching modes
    setInputText("");
    setBrailleText("");
    setCurrentMethod(reverseMode ? "text" : "braille");
    toast({
      title: "Mode switched",
      description: reverseMode
        ? "Switched to Text → Braille mode"
        : "Switched to Braille → Text mode",
    });
  };

  const handleSave = async () => {
    if (!inputText || !brailleText) {
      toast({
        title: "Nothing to save",
        description: "Please enter text first",
        variant: "destructive",
      });
      return;
    }

    const result = await saveTranslation(inputText, brailleText, currentMethod);
    if (result) {
      toast({
        title: "Saved",
        description: "Translation saved to history",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save translation",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setInputText("");
    setBrailleText("");
    setCurrentMethod(reverseMode ? "braille" : "text");
    toast({
      title: "Cleared",
      description: "All fields have been cleared",
    });
  };

  return (
    <div className="min-h-screen gradient-mesh relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="mb-10 fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-5xl font-bold mb-3">
                <span className="gradient-text text-shadow-soft">
                  Translation Tool
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                {reverseMode
                  ? "Convert Braille to text using reverse translation"
                  : "Convert text to Braille using multiple input methods"}
              </p>
            </div>
            <Button
              onClick={toggleMode}
              variant="outline"
              size="lg"
              className="gap-3 h-14 px-8 text-base border-2 hover:border-primary/40 hover:shadow-medium transition-all"
            >
              <ArrowRightLeft className="w-5 h-5" />
              {reverseMode ? "Text → Braille" : "Braille → Text"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <Card className="glass-card border-2 hover:border-primary/30 transition-all">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">
                  {reverseMode ? "Braille Input" : "Input"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reverseMode ? (
                  <BrailleInput
                    value={brailleText}
                    onChange={handleBrailleInput}
                  />
                ) : (
                  <Tabs
                    defaultValue={tabFromUrl || "text"}
                    value={currentMethod === "braille" ? "text" : currentMethod}
                    onValueChange={(value) => setCurrentMethod(value as any)}
                  >
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="text">Text</TabsTrigger>
                      <TabsTrigger value="file">File</TabsTrigger>
                      <TabsTrigger value="image">Image</TabsTrigger>
                      <TabsTrigger value="audio">Audio</TabsTrigger>
                      <TabsTrigger value="microphone">Mic</TabsTrigger>
                    </TabsList>
                    <TabsContent value="text" className="mt-4">
                      <TextInput value={inputText} onChange={setInputText} />
                    </TabsContent>
                    <TabsContent value="file" className="mt-4">
                      <FileUpload
                        onTextExtracted={(text) =>
                          handleTextExtracted(text, "file")
                        }
                      />
                    </TabsContent>
                    <TabsContent value="image" className="mt-4">
                      <ImageUpload
                        onTextExtracted={(text) =>
                          handleTextExtracted(text, "image")
                        }
                      />
                    </TabsContent>
                    <TabsContent value="audio" className="mt-4">
                      <AudioUpload
                        onTextExtracted={(text) =>
                          handleTextExtracted(text, "audio")
                        }
                      />
                    </TabsContent>
                    <TabsContent value="microphone" className="mt-4">
                      <MicrophoneInput
                        onTextExtracted={(text) =>
                          handleTextExtracted(text, "microphone")
                        }
                      />
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>

            {reverseMode ? (
              <Card className="glass-card border-2 hover:border-primary/30 transition-all">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Text Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[180px] p-6 bg-gradient-to-br from-muted/50 to-muted rounded-xl border-2 border-border">
                    {inputText ? (
                      <p className="text-xl leading-relaxed break-words">
                        {inputText}
                      </p>
                    ) : (
                      <p className="text-muted-foreground text-center text-lg py-12">
                        Converted text will appear here...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <BrailleDisplay brailleText={brailleText} />
            )}

            <div className="flex gap-4">
              <Button
                onClick={handleSave}
                disabled={!brailleText || !inputText}
                className="btn-gradient flex-1 h-14 text-base shadow-medium hover:shadow-strong transition-all"
              >
                <Save className="w-5 h-5 mr-2" />
                Save to History
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                disabled={!inputText && !brailleText}
                className="h-14 px-8 border-2 hover:border-destructive/40 hover:bg-destructive/10 transition-all"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            {!reverseMode && <AudioPlayer text={inputText} />}

            <Card className="glass-card border-2 hover:border-primary/30 transition-all">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">
                  {reverseMode ? "Braille Preview" : "Input Preview"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[120px] p-6 bg-gradient-to-br from-muted/50 to-muted rounded-xl border-2 border-border">
                  {reverseMode ? (
                    brailleText ? (
                      <p className="text-4xl font-mono leading-relaxed break-all">
                        {brailleText}
                      </p>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Braille input will appear here...
                      </p>
                    )
                  ) : inputText ? (
                    <p className="text-base break-words leading-relaxed">
                      {inputText}
                    </p>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
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
