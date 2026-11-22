import localFont from "next/font/local";

// Body font of the PLC freebie pages (Bricolage Grotesque, SIL Open Font License).
// The file lives in the repo because downloading it from Google during the build failed intermittently.
export const bricolage = localFont({
  src: "../fonts/bricolage-grotesque-latin-wght-normal.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
});
