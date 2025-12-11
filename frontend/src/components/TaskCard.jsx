import { useState } from "react";
import api from "../api/axios";

export default function TaskCard({ task, onUpdated, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    setLoading(true);
    try {
      const newStatus = task.status === "pending" ? "completed" : "pending";
      const res = await api.put(`/tasks/${task._id}`, { status: newStatus });
      onUpdated?.(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this task?")) return;
    setLoading(true);
    try {
      await api.delete(`/tasks/${task._id}`);
      onDeleted?.(task._id);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/6 border border-white/8 p-4 rounded-xl backdrop-blur-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{task.title}</h3>
          {task.description && (
            <p className="text-sm opacity-70 mt-1">{task.description}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-md font-medium ${
              task.status === "completed" ? "bg-green-600 text-white" : "bg-yellow-500 text-black"
            }`}
          >
            {task.status}
          </span>

          <div className="flex gap-2">
            <button
              onClick={toggleStatus}
              disabled={loading}
              className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-sm transition"
              title="Toggle status"
            >
              {loading ? "..." : task.status === "pending" ? "Complete" : "Reopen"}
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-sm transition"
              title="Delete task"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-white/60">
        <div>Created: {new Date(task.createdAt).toLocaleString()}</div>
        {task.updatedAt && <div> • Updated: {new Date(task.updatedAt).toLocaleString()}</div>}
      </div>
    </div>
  );
}
