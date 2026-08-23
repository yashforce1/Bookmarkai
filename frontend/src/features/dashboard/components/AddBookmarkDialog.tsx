import { useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BACKEND_URL } from "@/utils/api";
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";


interface AddBookmarkDialogProps {
  onBookmarkAdded: () => void;
}

export function AddBookmarkDialog({ onBookmarkAdded }: AddBookmarkDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // token from localStorage
      const token = localStorage.getItem("auth_token");

      const res = await fetch(`${BACKEND_URL}/api/v1/bookmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          url,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add bookmark");
      }

      onBookmarkAdded();
      toast.success("Bookmark added successfully!");

      // Reset form
      setTitle("");
      setUrl("");
      setDescription("");
      setTags("");

      setOpen(false);
    } catch (error) {
      console.error("Error adding bookmark: ", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add bookmark"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Bookmark
        </Button>
      </DialogTrigger>

      <DialogContent className="sm: max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Bookmark</DialogTitle>
          <DialogDescription>
            Save a new bookmark to your collection. All fields are required
            except tags.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div className="space-y-2">
            <label
              htmlFor="bookmark-title"
              className="text-sm font-medium leading-none"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="bookmark-title"
              type="text"
              placeholder="My Awesome Website"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <label
              htmlFor="bookmark-url"
              className="text-sm font-medium leading-none"
            >
              URL <span className="text-red-500">*</span>
            </label>
            <input
              id="bookmark-url"
              type="url"
              placeholder="https://example.com"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label
              htmlFor="bookmark-description"
              className="text-sm font-medium leading-none"
            >
              Description
            </label>
            <textarea
              id="bookmark-description"
              placeholder="A brief description of this bookmark..."
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={4}
            />
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <label
              htmlFor="bookmark-tags"
              className="text-sm font-medium leading-none"
            >
              Tags
            </label>
            <input
              id="bookmark-tags"
              type="text"
              placeholder="javascript, react, tutorial (comma separated)"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Bookmark"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
