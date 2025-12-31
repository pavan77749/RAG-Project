"use client";

import FileUpload from "@/components/kokonutui/file-upload";

export default function Home() {
  const uploadToBackend = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("pdf", file); 

      const response = await fetch("http://localhost:5000/upload/pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.text();
      console.log(" Backend response:", result);
    } catch (error) {
      console.error(" Upload error:", error);
    }
  };

  return (
    <div className="min-h-screen w-screen flex">
      <div className="w-[30vw] border-r-2 flex flex-col items-center p-4 gap-4 justify-center">
        <h1 className="font-bold">Upload your PDF / DOC File</h1>

        <FileUpload
          acceptedFileTypes={[
            "application/pdf",
          ]}
          maxFileSize={5 * 1024 * 1024} // 5MB
          onUploadSuccess={(file) => {
            console.log(" File ready for backend:", file);
            uploadToBackend(file);
          }}
          onUploadError={(error) => {
            console.error(" Validation error:", error);
          }}
        />
      </div>

      <div className="w-[70vw] border-l-2 flex items-center justify-center">
        Check browser console
      </div>
    </div>
  );
}
