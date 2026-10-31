import React, { Suspense } from "react";
import { fetchPublishedCourses, fetchSiteSettings } from "@/lib/api";
import { Course, SiteSettings } from "@/types";
import { ContactPageClient } from "./ContactPageClient";

export default async function ContactPage() {
  let courses: Course[] = [];
  let settings: SiteSettings | null = null;

  try {
    const [c, s] = await Promise.all([
      fetchPublishedCourses().catch(() => []),
      fetchSiteSettings().catch(() => null),
    ]);
    courses = c;
    settings = s;
  } catch (err) {
    console.error("Error loading contact page data:", err);
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ContactPageClient
        initialCourses={courses}
        initialSettings={settings}
      />
    </Suspense>
  );
}
