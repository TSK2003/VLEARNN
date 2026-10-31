import React from "react";
import { notFound } from "next/navigation";
import { fetchCourseBySlug } from "@/lib/api";
import { FALLBACK_COURSES } from "@/lib/fallbackData";
import { Course } from "@/types";
import { CourseDetailClient } from "./CourseDetailClient";

export function generateStaticParams() {
  return FALLBACK_COURSES.map((course) => ({
    slug: course.slug,
  }));
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  let course: Course | null = null;

  try {
    course = await fetchCourseBySlug(params.slug);
  } catch (err: any) {
    notFound();
  }

  if (!course || !course.isPublished || course.isArchived) {
    notFound();
  }

  return <CourseDetailClient initialCourse={course} slug={params.slug} />;
}
