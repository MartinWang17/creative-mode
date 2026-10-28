import LandingFx from "@/components/LandingFx";
import { homeHtml } from "@/content/home-html";

// Creative Mode home: the wordmark, "by Martin Wang", and one pill to Creator Breakdowns.
export default function Home() {
  return (
    <div className="cm">
      <div dangerouslySetInnerHTML={{ __html: homeHtml }} />
      <LandingFx />
    </div>
  );
}
