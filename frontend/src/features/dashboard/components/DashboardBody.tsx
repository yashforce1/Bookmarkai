import { useState } from "react";
import { AddBookmarkDialog } from "./AddBookmarkDialog";
import { BookmarkList } from "./BookmarkList";

export default function DashboardBody() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Bookmarks</h2>
        <AddBookmarkDialog
          onBookmarkAdded={() => setRefreshKey((currentKey) => currentKey + 1)}
        />
      </div>

      <BookmarkList refreshKey={refreshKey} />
    </div>
  );
}
