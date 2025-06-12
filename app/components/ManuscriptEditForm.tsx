"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";
import FileUpload from "./FileUpload";

interface ManuscriptEditFormProps {
  manuscript: {
    id: string;
    title: string;
    abstract: string;
    content: string;
    keywords: string;
    uploadedFile: string | null;
    uploadedFileName: string | null;
  };
}

export default function ManuscriptEditForm({ manuscript }: ManuscriptEditFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  
  // State for form fields - initialize with existing manuscript data
  const [title, setTitle] = useState(manuscript.title);
  const [abstract, setAbstract] = useState(manuscript.abstract);
  const [content, setContent] = useState(manuscript.content);
  const [keywords, setKeywords] = useState(manuscript.keywords);
  const [uploadedFile, setUploadedFile] = useState<{url: string; name: string} | null>(
    manuscript.uploadedFile && manuscript.uploadedFileName 
      ? { url: manuscript.uploadedFile, name: manuscript.uploadedFileName }
      : null
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if user is authenticated
  if (!session) {
    return <p>You must be logged in to edit a manuscript.</p>;
  }

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/manuscripts/${manuscript.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          abstract,
          content,
          keywords,
          uploadedFile: uploadedFile?.url,
          uploadedFileName: uploadedFile?.name,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Update failed");
      }
      
      setSuccess("Manuscript updated successfully!");
      
      // Redirect to manuscript details page after successful update
      setTimeout(() => {
        router.push(`/manuscripts/${manuscript.id}`);
      }, 1500);
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update error");
    } finally {
      setSubmitting(false);
    }
  };

  const form = {
    hidden_tag: () => <></>,
    title: (
      <input
        type="text"
        id="title"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 sm:text-sm placeholder-gray-500"
        placeholder="Enter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
    ),
    abstract: (
      <>
        <label
          htmlFor="abstract"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Abstract
        </label>
        <textarea
          id="abstract"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 sm:text-sm placeholder-gray-500"
          placeholder="Enter Abstract"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          required
        />
      </>
    ),
    content: (
      <>
        <label
          htmlFor="content"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Manuscript Content
        </label>
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Enter your manuscript content here. Use the toolbar above to format your text with headings, lists, quotes, and more..."
          className="w-full"
        />
      </>
    ),
    keywords: (
      <>
        <label
          htmlFor="keywords"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Keywords
        </label>
        <input
          type="text"
          id="keywords"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 sm:text-sm placeholder-gray-500"
          placeholder="Enter keywords (comma separated)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          required
        />
      </>
    ),
  };

  return (
    <div className="bg-gray-100 min-h-screen py-6 mt-8">
      <div className="container mx-auto max-w-3xl bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mt-8 mb-4">
        <Link
          href={`/manuscripts/${manuscript.id}`}
          className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
        >
          <i className="mr-2">{"<="}</i>
          Back to Manuscript
        </Link>
        <form
          className="mb-4"
          id="manuscriptForm"
          method="POST"
          onSubmit={handleSubmit}
        >
          {form.hidden_tag()}
          <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">
            Edit Manuscript
          </h1>

          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Title
            </label>
            {form.title}
          </div>

          <div className="mb-4">{form.abstract}</div>

          <div className="mb-4">{form.content}</div>

          <div className="mb-4">{form.keywords}</div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Upload Manuscript File (Optional)
            </label>
            <p className="text-sm text-gray-600 mb-3">
              You can upload a PDF or Word document instead of or in addition to
              typing your content above.
            </p>
            <FileUpload
              onFileUpload={(url, name) => setUploadedFile({ url, name })}
              onFileRemove={() => setUploadedFile(null)}
              uploadedFile={uploadedFile}
              disabled={submitting}
            />
          </div>

          {error && <div className="text-red-600 mb-2">{error}</div>}
          {success && <div className="text-green-600 mb-2">{success}</div>}

          <div className="flex items-center justify-between">
            <Link
              href={`/manuscripts/${manuscript.id}`}
              className="bg-transparent hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded shadow-sm hover:border-transparent"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update Manuscript"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
