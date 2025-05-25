"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  content: string;
  sender: "REVIEWER" | "EDITOR" | "AUTHOR";
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface CommunicationPanelProps {
  review: any;
  messages: Message[];
}

export default function CommunicationPanel({ review, messages }: CommunicationPanelProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/reviews/${review.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage.trim(),
          sender: "REVIEWER",
        }),
      });

      if (response.ok) {
        setNewMessage("");
        router.refresh(); // Refresh to show new message
      } else {
        alert("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const getSenderInfo = (sender: string) => {
    switch (sender) {
      case "REVIEWER":
        return { label: "Reviewer", color: "bg-blue-100 text-blue-800", icon: "👨‍🔬" };
      case "EDITOR":
        return { label: "Editor", color: "bg-purple-100 text-purple-800", icon: "✏️" };
      case "AUTHOR":
        return { label: "Author", color: "bg-green-100 text-green-800", icon: "👨‍💼" };
      default:
        return { label: "Unknown", color: "bg-gray-100 text-gray-800", icon: "❓" };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Communication</h2>
        <p className="text-sm text-gray-600">
          Communicate with the editor about this review. Messages are confidential and not shared with the author.
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-auto p-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-600">
              Start a conversation with the editor if you have questions or concerns about this review.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => {
              const senderInfo = getSenderInfo(message.sender);
              const isCurrentUser = message.sender === "REVIEWER";
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-2xl ${isCurrentUser ? "order-2" : "order-1"}`}>
                    <div className="flex items-center mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${senderInfo.color}`}>
                        <span className="mr-1">{senderInfo.icon}</span>
                        {senderInfo.label}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        {message.user.name}
                      </span>
                      <span className="ml-2 text-xs text-gray-400">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <div
                      className={`p-4 rounded-lg ${
                        isCurrentUser
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-4">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message to the editor..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col justify-end">
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <div className="text-yellow-600 mr-2">⚠️</div>
            <div className="text-sm text-yellow-800">
              <strong>Note:</strong> Messages in this panel are confidential communications between you and the editor. 
              They are not shared with the manuscript author. Use this for questions about the review process, 
              concerns about the manuscript, or requests for clarification.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
