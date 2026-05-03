"use client";

import FileUploader from "@/components/upload/FileUploader";
import SectionHeader from "@/components/ui/SectionHeader";

export default function UploadPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Upload"
        description="Drop your syllabus or past papers to generate insights."
      />
      <FileUploader />
    </div>
  );
}