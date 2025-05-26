import { auth } from "@/auth";
import { Suspense } from "react";
import Link from "next/link";

async function ToolsContent() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Access Denied
        </h3>
        <p className="text-gray-500">Please log in to access writing tools.</p>
      </div>
    );
  }

  const tools = [
    {
      id: "citation-generator",
      name: "Citation Generator",
      description: "Generate citations in APA, MLA, Chicago, and other formats",
      icon: "📚",
      color: "bg-blue-100 text-blue-800",
      status: "Available",
      href: "/tools/citations",
    },
    {
      id: "plagiarism-checker",
      name: "Plagiarism Checker",
      description: "Check your work for potential plagiarism and similarity",
      icon: "🔍",
      color: "bg-red-100 text-red-800",
      status: "Coming Soon",
      href: "#",
    },
    {
      id: "grammar-checker",
      name: "Grammar & Style Checker",
      description: "Improve your writing with advanced grammar and style suggestions",
      icon: "✏️",
      color: "bg-green-100 text-green-800",
      status: "Coming Soon",
      href: "#",
    },
    {
      id: "reference-manager",
      name: "Reference Manager",
      description: "Organize and manage your research references and bibliography",
      icon: "📖",
      color: "bg-purple-100 text-purple-800",
      status: "Coming Soon",
      href: "#",
    },
    {
      id: "word-counter",
      name: "Word Counter & Analytics",
      description: "Count words, characters, and analyze your writing statistics",
      icon: "📊",
      color: "bg-orange-100 text-orange-800",
      status: "Available",
      href: "/tools/word-counter",
    },
    {
      id: "latex-editor",
      name: "LaTeX Editor",
      description: "Write and compile LaTeX documents for academic papers",
      icon: "📝",
      color: "bg-indigo-100 text-indigo-800",
      status: "Coming Soon",
      href: "#",
    },
    {
      id: "collaboration",
      name: "Real-time Collaboration",
      description: "Collaborate with co-authors in real-time on documents",
      icon: "👥",
      color: "bg-pink-100 text-pink-800",
      status: "Coming Soon",
      href: "#",
    },
    {
      id: "templates",
      name: "Document Templates",
      description: "Access templates for various academic document types",
      icon: "📄",
      color: "bg-teal-100 text-teal-800",
      status: "Available",
      href: "/tools/templates",
    },
    {
      id: "export-tools",
      name: "Export Tools",
      description: "Export your work to various formats (PDF, Word, LaTeX)",
      icon: "📤",
      color: "bg-yellow-100 text-yellow-800",
      status: "Available",
      href: "/tools/export",
    },
  ];

  const quickActions = [
    {
      name: "Start New Document",
      description: "Create a new manuscript or document",
      icon: "📝",
      href: "/manuscripts/new",
      color: "bg-blue-900 text-white",
    },
    {
      name: "Import Document",
      description: "Upload and import existing documents",
      icon: "📁",
      href: "/tools/import",
      color: "bg-gray-700 text-white",
    },
    {
      name: "Writing Assistant",
      description: "Get AI-powered writing suggestions",
      icon: "🤖",
      href: "/tools/ai-assistant",
      color: "bg-purple-700 text-white",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className={`flex items-center p-4 rounded-lg hover:opacity-90 transition-opacity ${action.color}`}
            >
              <span className="text-2xl mr-3">{action.icon}</span>
              <div>
                <p className="font-medium">{action.name}</p>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Writing Tools Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Writing Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${tool.color}`}>
                  <span className="text-2xl">{tool.icon}</span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tool.status === "Available"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tool.status}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {tool.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">
                {tool.description}
              </p>
              
              <div className="flex justify-between items-center">
                {tool.status === "Available" ? (
                  <Link
                    href={tool.href}
                    className="text-blue-900 hover:text-blue-700 font-medium text-sm"
                  >
                    Open Tool →
                  </Link>
                ) : (
                  <span className="text-gray-400 text-sm">Coming Soon</span>
                )}
                
                <button className="text-gray-400 hover:text-gray-600">
                  <span className="text-lg">ℹ️</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Tools */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recently Used</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🕐</div>
          <p className="text-gray-500">
            Your recently used tools will appear here
          </p>
        </div>
      </div>

      {/* Help & Resources */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Help & Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/help/writing-guide"
            className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
          >
            <span className="text-2xl mr-3">📚</span>
            <div>
              <p className="font-medium text-gray-900">Writing Guide</p>
              <p className="text-sm text-gray-500">Tips and best practices for academic writing</p>
            </div>
          </Link>
          
          <Link
            href="/help/citation-styles"
            className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
          >
            <span className="text-2xl mr-3">📖</span>
            <div>
              <p className="font-medium text-gray-900">Citation Styles</p>
              <p className="text-sm text-gray-500">Learn about different citation formats</p>
            </div>
          </Link>
          
          <Link
            href="/help/tutorials"
            className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
          >
            <span className="text-2xl mr-3">🎥</span>
            <div>
              <p className="font-medium text-gray-900">Video Tutorials</p>
              <p className="text-sm text-gray-500">Watch step-by-step tool tutorials</p>
            </div>
          </Link>
          
          <Link
            href="/help/support"
            className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
          >
            <span className="text-2xl mr-3">💬</span>
            <div>
              <p className="font-medium text-gray-900">Get Support</p>
              <p className="text-sm text-gray-500">Contact our support team</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ToolsLoading() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
      
      <div>
        <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-16 bg-gray-200 rounded w-full mb-4"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <div className="p-8 min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Writing Tools</h1>
        <p className="text-gray-600">
          Powerful tools to enhance your academic writing and research
        </p>
      </div>

      <Suspense fallback={<ToolsLoading />}>
        <ToolsContent />
      </Suspense>
    </div>
  );
}
