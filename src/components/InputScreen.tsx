// Use VITE_API_URL for backend base URL
const API_URL = import.meta.env.VITE_API_URL;
import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  ImagePlus,
  Mic,
  Upload,
  ArrowRight,
  Pause,
  Play,
  Square,
  Send,
  Headphones,
  CheckCircle,
  Camera,
  AlertCircle,
  X,
} from "lucide-react";

interface InputScreenProps {
  onNext: (productId: string) => void;
}

export function InputScreen({ onNext }: InputScreenProps) {
  const [mediaPreviews, setMediaPreviews] = useState<string[]>(
    [],
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voiceNoteBlob, setVoiceNoteBlob] = useState<Blob | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // MediaRecorder refs for audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // New text input fields
  const [productTitle, setProductTitle] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [backstory, setBackstory] = useState("");

  // Keywords selection
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  // NEW: camera modal states
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [isMobileCamera, setIsMobileCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Refs for upload & camera
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Handle file uploads
  const handleMediaUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setMediaPreviews((prev) => [
              ...prev,
              e.target?.result as string,
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Recording logic

  // Audio recording logic using MediaRecorder
  const startRecording = async () => {
    setIsRecording(true);
    setIsPaused(false);
    setIsStopped(false);
    setIsSubmitted(false);
    setAudioUrl(null);
    setVoiceNoteBlob(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setVoiceNoteBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        setIsRecording(false);
        setIsPaused(false);
        setIsStopped(true);
        setIsSubmitted(false);
      };

      mediaRecorder.start();
    } catch (err) {
      alert("Could not start audio recording: " + (err as any)?.message);
      setIsRecording(false);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && (mediaRecorderRef.current.state === "recording" || mediaRecorderRef.current.state === "paused")) {
      mediaRecorderRef.current.stop();
    }
  };

  const submitRecording = () => setIsSubmitted(true);

  // Camera logic (desktop modal)
  const openCamera = async () => {
    setCameraError(null);
    
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      setIsMobileCamera(true);
      cameraInputRef.current?.click();
      return;
    }
    
    // Check if camera API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera not supported on this device. Please upload files instead.");
      return;
    }

    // Check camera permissions first
    try {
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      if (permissions.state === 'denied') {
        setCameraError("Camera access is blocked. Please enable camera permissions in your browser settings, then refresh the page and try again.");
        return;
      }
    } catch (permErr) {
      // Permission API not supported, continue with direct camera access
    }
    
    setIsMobileCamera(false);
    setShowCameraModal(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setCameraError(null);
    } catch (err: any) {
      // Don't log the error to console for permission denied - it's expected
      if (err.name !== 'NotAllowedError') {
        console.error("Error accessing camera:", err);
      }
      setShowCameraModal(false);
      
      // Provide user-friendly error messages
      if (err.name === 'NotAllowedError') {
        setCameraError("Camera permission denied. Click the camera icon 🎥 in your browser's address bar to allow access, or use the 'Upload from Device' option instead.");
      } else if (err.name === 'NotFoundError') {
        setCameraError("No camera found on this device. Please use the 'Upload from Device' option instead.");
      } else if (err.name === 'NotSupportedError') {
        setCameraError("Camera not supported on this device. Please use the 'Upload from Device' option instead.");
      } else if (err.name === 'SecurityError') {
        setCameraError("Camera access blocked due to security restrictions. Please ensure you're using HTTPS or use the 'Upload from Device' option instead.");
      } else {
        setCameraError("Unable to access camera. Please use the 'Upload from Device' option instead.");
      }
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    const imgUrl = canvasRef.current.toDataURL("image/png");
    setMediaPreviews((prev) => [...prev, imgUrl]);
    closeCamera();
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCameraModal(false);
    setCameraError(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);


  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // Fetch logged-in user email (from your auth state / context / localStorage)
      const email = localStorage.getItem("userEmail"); // 🔹 adjust if stored differently

      formData.append("email", email || "");
      formData.append("title", productTitle);
      formData.append("description", productDescription);
      formData.append("story", backstory);
      formData.append("keywords", JSON.stringify(selectedKeywords));

      if (voiceNoteBlob) {
        formData.append("voice_note", voiceNoteBlob, "voice_note.webm");
      }

      // Only send the first uploaded image (backend handles one file)
      if (fileInputRef.current?.files?.[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }

  const res = await fetch(`${API_URL}/api/v1/add`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Upload failed");

      console.log("✅ Product added:", data);
      alert("Product uploaded successfully!");
      onNext(data.id || data._id);
    } catch (err: any) {
      console.error("❌ Upload error:", err.message);
      alert("Failed to upload product: " + err.message);
    }
  };



  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: "var(--color-pastel-lavender)",
      }}
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl">
            ✨ AI Marketplace Assistant
          </h1>
          <p className="text-muted-foreground">
            Upload your product and let AI create compelling
            descriptions and stories
          </p>
        </div>

        {/* Upload Product Media */}
        <Card className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImagePlus className="w-5 h-5 text-primary" />
              Upload Product Images / Videos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              {mediaPreviews.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {mediaPreviews.map((preview, idx) =>
                    preview.startsWith("data:video") ? (
                      <video
                        key={idx}
                        src={preview}
                        controls
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <img
                        key={idx}
                        src={preview}
                        alt={`Preview ${idx}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ),
                  )}
                </div>
              ) : (
                <div
                  className="h-48 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border"
                  style={{
                    backgroundColor: "var(--color-pastel-mint)",
                  }}
                >
                  <Upload className="w-12 h-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop or click to upload multiple
                    files
                  </p>
                </div>
              )}
            </div>

            {/* Hidden File Inputs */}
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              ref={fileInputRef}
              onChange={handleMediaUpload}
              style={{ display: "none" }}
              placeholder="Upload product images or videos"
              title="Upload product images or videos"
            />
            <input
              type="file"
              accept="image/*"
              ref={cameraInputRef}
              onChange={handleMediaUpload}
              style={{ display: "none" }}
              title="Upload product images from camera"
              placeholder="Upload product images from camera"
            />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
                Upload from Device
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={openCamera}
              >
                <Camera className="w-4 h-4" />
                Open Camera
              </Button>
            </div>

            {/* Camera Error Message */}
            {cameraError && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border-2 border-red-200">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Camera Access Issue</p>
                  <p className="text-sm text-red-700 mt-1">{cameraError}</p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-red-700 border-red-300 hover:bg-red-100"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Upload Instead
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCameraError(null)}
                      className="text-red-700 hover:bg-red-100"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCameraError(null)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Information */}
        <Card className="border-2 border-primary/20" style={{ backgroundColor: "var(--color-pastel-peach)" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Product Title
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="e.g., Handwoven Odisha Bag"
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20" style={{ backgroundColor: "var(--color-pastel-mint)" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Product Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., Eco-friendly bag crafted by artisans using bamboo and cotton..."
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20" style={{ backgroundColor: "var(--color-pastel-yellow)" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Backstory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., This tradition has been passed down for generations in Odisha..."
              value={backstory}
              onChange={(e) => setBackstory(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Camera Modal */}
        {showCameraModal && !isMobileCamera && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 space-y-4 max-w-lg w-full">
              <video
                ref={videoRef}
                autoPlay
                className="w-64 h-48 object-cover rounded-lg mx-auto"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={closeCamera}>
                  Cancel
                </Button>
                <Button onClick={captureImage}>Capture</Button>
              </div>
            </div>
          </div>
        )}

        {/* Voice Note / Keywords */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-primary" />
              Add Voice Note or Keywords
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 flex-wrap">
              {!isRecording && !isStopped && !isSubmitted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startRecording}
                  className="flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  Start Recording
                </Button>
              )}

              {isRecording && !isPaused && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={pauseRecording}
                    className="flex items-center gap-2"
                  >
                    <Pause className="w-4 h-4" />
                    Pause
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={stopRecording}
                    className="flex items-center gap-2"
                  >
                    <Square className="w-4 h-4" />
                    Stop
                  </Button>
                </>
              )}

              {isRecording && isPaused && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resumeRecording}
                    className="flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Resume
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={stopRecording}
                    className="flex items-center gap-2"
                  >
                    <Square className="w-4 h-4" />
                    Stop
                  </Button>
                </>
              )}

              {isStopped && !isSubmitted && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => {
                      if (audioUrl) {
                        const audio = new Audio(audioUrl);
                        audio.play();
                      }
                    }}
                  >
                    <Headphones className="w-4 h-4" />
                    Listen Recording
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={submitRecording}
                    className="flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Recording
                  </Button>
                </>
              )}
            </div>

            {isSubmitted && (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Record submitted successfully!
              </div>
            )}

            <div className="relative">
              <p className="text-sm text-muted-foreground mb-3">
                Or select keywords that describe your product:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Handmade', 'Eco-friendly', 'Traditional', 'Bag', 'Basket', 
                  'Textile', 'Jewelry', 'Decor', 'Gift', 'Sustainable'
                ].map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => {
                      setSelectedKeywords(prev => 
                        prev.includes(keyword) 
                          ? prev.filter(k => k !== keyword)
                          : [...prev, keyword]
                      );
                    }}
                    className={`px-3 py-2 rounded-full text-sm transition-all duration-200 border-2 ${
                      selectedKeywords.includes(keyword)
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-pastel-mint border-border hover:border-primary/50 text-foreground hover:bg-primary/5'
                    }`}
                    style={{
                      backgroundColor: selectedKeywords.includes(keyword) 
                        ? 'var(--color-primary)' 
                        : 'var(--color-pastel-mint)'
                    }}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
              {selectedKeywords.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-2">Selected keywords:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedKeywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-primary/10 text-primary"
                      >
                        {keyword}
                        <button
                          onClick={() => {
                            setSelectedKeywords(prev => prev.filter(k => k !== keyword));
                          }}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                          title={`Remove ${keyword}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: "var(--color-pastel-yellow)",
              }}
            >
              <p className="text-sm">
                💡 <strong>Tip:</strong> The more details you
                provide, the better AI can create your product
                description and story!
              </p>
            </div>

            {/* Camera Help Section */}
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: "var(--color-pastel-blue)",
              }}
            >
              <p className="text-sm">
                📷 <strong>Camera Issues?</strong> If camera access is denied:
              </p>
              <ul className="text-sm mt-2 space-y-1 ml-4">
                <li>• Click the camera icon in your browser's address bar to allow permissions</li>
                <li>• Try refreshing the page after allowing camera access</li>
                <li>• You can always upload photos from your device instead</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
  onClick={handleSubmit}
  disabled={
  mediaPreviews.length === 0 ||
  !productTitle.trim() ||
  !productDescription.trim() ||
  (selectedKeywords.length === 0 && !isSubmitted)
}

  className="px-8 py-3"
>
  Continue to AI Processing
  <ArrowRight className="w-4 h-4 ml-2" />
</Button>
        </div>
      </div>
    </div>
  );
}