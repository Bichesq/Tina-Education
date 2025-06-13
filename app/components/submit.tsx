"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import RichTextEditor from "./RichTextEditor";
import FileUpload from "./FileUpload";

export default function Submit() {
  // State for form fields
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if user is authenticated
  const { data: session } = useSession();
  if (!session) {
    // Handle unauthenticated state
    return (
      <div className="h-40">
        <p className="text-red-600 mb-8">
          You must be logged in to submit a manuscript.
        </p>
      </div>
    );
  }

  // Submit handler
  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/manuscripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          abstract,
          content,
          keywords,
          uploadedFile: uploadedFile?.url,
          uploadedFileName: uploadedFile?.name,
          isDraft,
        }),
      });
      if (!res.ok)
        throw new Error(isDraft ? "Failed to save draft" : "Submission failed");

      setSuccess(
        isDraft
          ? "Draft saved successfully!"
          : "Manuscript submitted successfully!"
      );

      if (!isDraft) {
        // Redirect to manuscripts page after successful submission
        setTimeout(() => {
          window.location.href = "/dashboard/manuscripts";
        }, 1500);
      }

      setTitle("");
      setAbstract("");
      setContent("");
      setKeywords("");
      setUploadedFile(null);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : isDraft
            ? "Failed to save draft"
            : "Submission error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const form = {
    hidden_tag: () => (
      <input type="hidden" name="csrf_token" value="dummy_token" />
    ),
    title: (
      <input
        type="text"
        id="title"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 sm:text-sm placeholder-gray-500"
        placeholder="Enter manuscript title"
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
    submit: () => (
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={submitting}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save as Draft"}
        </button>
        <button
          type="submit"
          onClick={(e) => handleSubmit(e, false)}
          disabled={submitting}
          className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Manuscript"}
        </button>
      </div>
    ),
  };

  return (
    <div className="bg-gray-100 min-h-screen py-6 mt-8">
      <div className="container mx-auto max-w-3xl bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mt-8 mb-4">
        <Link
          href="/dashboard"
          className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
        >
          <i className="mr-2">{"<="}</i>
          Back to Dashboard
        </Link>
        <form
          className="mb-4"
          id="manuscriptForm"
          method="POST"
          onSubmit={(e) => handleSubmit(e, false)}
        >
          {form.hidden_tag()}
          <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">
            Manuscript Submission
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

          <div className="flex items-center justify-end">
            <Link
              href="/guidelines"
              className="bg-transparent hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded shadow-sm hover:border-transparent mr-2"
            >
              Submission Guidelines
            </Link>
            {form.submit()}
          </div>
        </form>
      </div>
    </div>
  );
}
