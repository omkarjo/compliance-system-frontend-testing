import FolderCard from "./FolderCard";

export default function FolderList({ folders, folderCounts, currentPrefix, onNavigate }) {
  return (
    <div className="flex flex-wrap gap-5 mb-4">
      {folders.length === 0 && (
        <div className="text-xs text-muted-foreground pl-2">No folders</div>
      )}
      {folders.map((folder) => (
        <FolderCard
          key={folder}
          name={folder.replace(currentPrefix, "").replace(/\/$/, "")}
          count={folderCounts[folder] ?? 0}
          onClick={() => onNavigate(folder)}
        />
      ))}
    </div>
  );
}