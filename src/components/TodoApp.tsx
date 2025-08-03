import { useState, useCallback, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export const TodoApp = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now(),
      title: newTask.trim(),
      completed: false,
    };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const toggleTask = useCallback((id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const filteredTasks = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.completed);
    if (filter === "completed") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold mb-8">ToDo List</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1 rounded"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Нова задача"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addTask}
        >
          Додати
        </button>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            className={`px-3 py-1 rounded border ${
              filter === f ? "bg-gray-200" : ""
            }`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "Усі" : f === "active" ? "Активні" : "Виконані"}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center border rounded p-2"
          >
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <span
                className={task.completed ? "line-through text-gray-400" : ""}
              >
                {task.title}
              </span>
            </label>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:underline"
            >
              Видалити
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
