import { Metadata } from "next";
import CalendarClient from "./CalendarClient";

export const metadata: Metadata = {
  title: "Global Sacred Calendar — Dancing with Lions",
  description:
    "When is Ramadan? When is Diwali? Lunar New Year? Every sacred festival on one global timeline. The world's traditions, connected by the moon.",
  openGraph: {
    title: "Global Sacred Calendar — Dancing with Lions",
    description:
      "Every sacred festival on one global timeline. Islamic, Chinese, Hindu, Persian, Jewish, Buddhist — connected by the moon.",
  },
};

export default function CalendarPage() {
  return <CalendarClient />;
}
