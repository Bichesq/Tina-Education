"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string | null;
  email: string;
  affiliation: string | null;
  expertise: string | null;
}

interface ReviewerApplicationFormProps {
  user: User;
}

export default function ReviewerApplicationForm({ user }: ReviewerApplicationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    motivation: "",
    expertise: user.expertise || "",
    experience: "",
    qualifications: "",
    availability: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!formData.motivation.trim()) {
      setError("Please provide your motivation for becoming a reviewer");
      setIsLoading(false);
      return;
    }

    if (!formData.expertise.trim()) {
      setError("Please describe your areas of expertise");
      setIsLoading(false);
      return;
    }

    if (!formData.qualifications.trim()) {
      setError("Please provide your qualifications");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/reviewer-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      // Redirect to reviews page with success message
      router.push("/dashboard/reviews?message=Application submitted successfully");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* User Information Display */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Your Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Name:</span>
            <span className="ml-2 text-gray-600">{user.name || "Not provided"}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Email:</span>
            <span className="ml-2 text-gray-600">{user.email}</span>
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-gray-700">Current Affiliation:</span>
            <span className="ml-2 text-gray-600">{user.affiliation || "Not provided"}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          You can update this information in your <a href="/profile" className="text-blue-600 hover:text-blue-500">profile page</a>.
        </p>
      </div>

      {/* Motivation */}
      <div>
        <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-2">
          Motivation for Becoming a Reviewer *
        </label>
        <textarea
          id="motivation"
          name="motivation"
          rows={4}
          required
          value={formData.motivation}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Explain why you want to become a reviewer and how you can contribute to the peer review process..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Describe your motivation and commitment to peer review (minimum 100 characters)
        </p>
      </div>

      {/* Areas of Expertise */}
      <div>
        <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-2">
          Areas of Expertise *
        </label>
        <textarea
          id="expertise"
          name="expertise"
          rows={4}
          required
          value={formData.expertise}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="List your specific areas of expertise, research interests, and fields you are qualified to review..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Be specific about your areas of specialization and research interests
        </p>
      </div>

      {/* Review Experience */}
      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
          Previous Review Experience
        </label>
        <textarea
          id="experience"
          name="experience"
          rows={4}
          value={formData.experience}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Describe any previous experience with peer review, including journals you've reviewed for, number of reviews completed, etc. If you're new to reviewing, mention any relevant experience..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Include any relevant experience, even if you're new to formal peer review
        </p>
      </div>

      {/* Qualifications */}
      <div>
        <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-2">
          Academic and Professional Qualifications *
        </label>
        <textarea
          id="qualifications"
          name="qualifications"
          rows={4}
          required
          value={formData.qualifications}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="List your degrees, certifications, publications, professional positions, and other relevant qualifications..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Include degrees, publications, professional experience, and other relevant credentials
        </p>
      </div>

      {/* Availability */}
      <div>
        <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
          Availability and Commitment
        </label>
        <textarea
          id="availability"
          name="availability"
          rows={3}
          value={formData.availability}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Describe your availability for reviewing manuscripts, typical turnaround time you can commit to, and any scheduling constraints..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Help us understand your capacity and preferred review schedule
        </p>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Reviewer Commitments</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <label className="flex items-start">
            <input
              type="checkbox"
              required
              className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span>I commit to providing timely, thorough, and constructive reviews</span>
          </label>
          <label className="flex items-start">
            <input
              type="checkbox"
              required
              className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span>I will maintain confidentiality of all manuscripts under review</span>
          </label>
          <label className="flex items-start">
            <input
              type="checkbox"
              required
              className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span>I will declare any conflicts of interest and recuse myself when appropriate</span>
          </label>
          <label className="flex items-start">
            <input
              type="checkbox"
              required
              className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span>I understand that reviewer assignments are at the discretion of the editorial team</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <a
          href="/dashboard"
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Submitting Application..." : "Submit Application"}
        </button>
      </div>
    </form>
  );
}
