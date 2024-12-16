// System Level Import
import { Suspense } from 'react'

// Component Level Import
import { VideoComponent } from "@/app/components/protected/VideoComponent";

export default function Home() {
  return (
    <div>
      <Suspense fallback={<p>Loading video...</p>}>
        <VideoComponent prefix="sample-earth-eLz2X4dYzxXZpbRTC0XPzOsrIj2zx0.mp4" />
      </Suspense>
    </div>
  );
}
