import { useEffect, useState } from "react";
import { Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/utils/api";

interface Bookmark {
  _id: string;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  createdAt: string;
}

interface BookmarkListProps {
  refreshKey: number;
}

export function BookmarkList({ refreshKey }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  useEffect(() => {
    if (refreshKey > 0) {
      void fetchBookmarks();
    }
  }, [refreshKey]);

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${BACKEND_URL}/api/v1/bookmarks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch bookmarks");

      const result = await response.json();
      setBookmarks(result.data);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      toast.error("Failed to load bookmarks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bookmark?")) return;

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `${BACKEND_URL}/api/v1/bookmarks/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete bookmark");

      toast.success("Bookmark deleted successfully");
      fetchBookmarks(); // Refresh list
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      toast.error("Failed to delete bookmark");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading bookmarks...</div>;
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-2">No bookmarks yet</p>
        <p className="text-sm text-gray-400">
          Click "Add Bookmark" to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark._id}
          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg truncate flex-1">
              {bookmark.title}
            </h3>
            <div className="flex gap-1 ml-2">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => window.open(bookmark.url, "_blank")}
                aria-label="Open link"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => handleDelete(bookmark._id)}
                aria-label="Delete bookmark"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>

          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline truncate block mb-2"
          >
            {bookmark.url}
          </a>

          {bookmark.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {bookmark.description}
            </p>
          )}

          {bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {bookmark.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="text-xs text-gray-400 mt-3">
            {new Date(bookmark.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
