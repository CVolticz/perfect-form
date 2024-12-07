// System Level Import
import { Suspense } from 'react'

// Component Level Import
import { VideoComponent } from "../components/VideoComponent";

export default function Home() {
  return (
    <div>
      <Suspense fallback={<p>Loading video...</p>}>
        <VideoComponent prefix="videos/file_example_MP4_480_1_5MG-0kSHLgTDZUL4aPpcfgGdVLV3AEZs1o.mp4" />
      </Suspense>
    </div>
  );
}
