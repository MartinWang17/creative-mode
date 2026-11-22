"use client";

import { useEffect } from "react";
import { WORKSHEET_HTML } from "@/content/worksheet-html";
import { initWorksheet } from "@/lib/worksheet-init";

// Renders the worksheet markup, then hands over to the page script (rows, autosave, copy, start over).
export default function Worksheet() {
  useEffect(() => {
    initWorksheet();
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: WORKSHEET_HTML }} />;
}
