import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import api from "../api/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Validation schema
const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  status: z.enum(["pending", "completed"]).default("pending"),
});

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [taskData, setTaskData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: { status: "pending" },
  });

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Instead of immediately adding, show confirmation modal
  const onAddTask = (data) => {
    setTaskData(data);
    setShowConfirm(true);
  };

  const confirmAdd = async () => {
    setShowConfirm(false);
    if (!taskData) return;

    setAdding(true);
    try {
      const res = await api.post("/tasks", taskData);
      setTasks((prev) => [res.data, ...prev]); // Add at top
      reset();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create task");
    } finally {
      setAdding(false);
      setTaskData(null);
    }
  };

  const cancelAdd = () => {
    setShowConfirm(false);
    setTaskData(null);
  };

  const handleUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
  };

  const handleDeleted = (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Welcome back 👋</h1>

        {/* Add Task Form */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Task</h2>

          <form
            onSubmit={handleSubmit(onAddTask)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm opacity-80">Title</label>
              <input
                {...register("title")}
                className="px-3 py-2 rounded-md bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Task title"
              />
              {errors.title && (
                <p className="text-red-400 text-xs">{errors.title.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm opacity-80">Status</label>
              <select
                {...register("status")}
                className="px-3 py-2 rounded-md bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending" className="text-black">
                  Pending
                </option>
                <option value="completed" className="text-black">
                  Completed
                </option>
              </select>
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm opacity-80">Description</label>
              <textarea
                {...register("description")}
                rows={3}
                className="px-3 py-2 rounded-md bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Task details (optional)"
              />
            </div>

            <button
              type="submit"
              disabled={adding}
              className="md:col-span-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
            >
              {adding ? "Adding..." : "Add Task"}
            </button>
          </form>
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 text-white rounded-xl p-6 w-96 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">
                Are you sure you want to add this task?
              </h3>
              <div className="flex justify-end gap-4">
                <button
                  onClick={cancelAdd}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAdd}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md"
                >
                  Yes, Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task List */}
        <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>

        {loadingTasks ? (
          <p className="opacity-70">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="opacity-60">You have no tasks yet. Create one above!</p>
        ) : (
          <div className="flex flex-col gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdated={handleUpdated}
                onDeleted={handleDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
