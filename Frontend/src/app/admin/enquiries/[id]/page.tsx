import React from "react";
import { EnquiryDetailClient } from "./EnquiryDetailClient";

export function generateStaticParams() {
  return [{ id: "view" }];
}

export default function EnquiryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <EnquiryDetailClient id={params.id} />;
}
