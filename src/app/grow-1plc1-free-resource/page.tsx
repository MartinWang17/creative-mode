import type { Metadata } from "next";
import { bricolage } from "@/lib/fonts";
import Worksheet from "@/components/Worksheet";
import "./worksheet.css";

// PLC episode 1 free resource (GROW keyword): the DO, WHY, HOW worksheet.
// Shared as /grow-1PLC1-free-resource; middleware sends any other casing of the path here.

export const metadata: Metadata = {
  title: "The DO, WHY, HOW Worksheet | Creative Mode",
  description: "Break down any viral video and put it in your own niche.",
  robots: { index: false, follow: false },
};

export default function WorksheetPage() {
  return (
    <div className={`dwh ${bricolage.variable}`}>
      <Worksheet />
    </div>
  );
}
