"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

interface Project {
  id: string;
  name: string;
  userId: string;
}

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  projectId: string;
}

export default function HomePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTodoTitle, setEditTodoTitle] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editProjectName, setEditProjectName] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const projectsQuery = query(
      collection(db, "projects"),
      where("userId", "==", user.uid)
    );

    const unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
      const projectsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      setProjects(projectsList);
      setLoading(false);
    });

    return () => unsubscribeProjects();
  }, [user, router]);

  useEffect(() => {
    if (!selectedProject) return;

    const todosQuery = query(
      collection(db, "todos"),
      where("projectId", "==", selectedProject.id)
    );

    const unsubscribeTodos = onSnapshot(todosQuery, (snapshot) => {
      const todosList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Todo[];
      setTodos(todosList);
    });

    return () => unsubscribeTodos();
  }, [selectedProject]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !user) return;

    try {
      await addDoc(collection(db, "projects"), {
        name: newProjectName,
        userId: user.uid,
        createdAt: new Date(),
      });
      setNewProjectName("");
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim() || !selectedProject) return;

    try {
      await addDoc(collection(db, "todos"), {
        title: newTodoTitle,
        completed: false,
        projectId: selectedProject.id,
        createdAt: new Date(),
      });
      setNewTodoTitle("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const handleToggleTodo = async (todoId: string, completed: boolean) => {
    try {
      await updateDoc(doc(db, "todos", todoId), {
        completed: !completed,
      });
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleEditTodo = async (todo: Todo) => {
    setEditingTodo(todo);
    setEditTodoTitle(todo.title);
  };

  const handleUpdateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo || !editTodoTitle.trim()) return;

    try {
      await updateDoc(doc(db, "todos", editingTodo.id), {
        title: editTodoTitle,
      });
      setEditingTodo(null);
      setEditTodoTitle("");
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      await deleteDoc(doc(db, "todos", todoId));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setEditTodoTitle("");
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setEditProjectName(project.name);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editProjectName.trim()) return;

    try {
      await updateDoc(doc(db, "projects", editingProject.id), {
        name: editProjectName,
      });
      setEditingProject(null);
      setEditProjectName("");
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      // Delete all todos associated with the project
      const todosQuery = query(
        collection(db, "todos"),
        where("projectId", "==", projectId)
      );
      const unsubscribe = onSnapshot(todosQuery, async (snapshot) => {
        const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
      });

      // Delete the project
      await deleteDoc(doc(db, "projects", projectId));

      // If the deleted project was selected, clear the selection
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
      }

      // Cleanup subscription
      unsubscribe();
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const cancelProjectEdit = () => {
    setEditingProject(null);
    setEditProjectName("");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      <nav className="nav">
        <div className="nav-content">
          <h1 className="nav-title">Honey Do list</h1>
          <button onClick={handleLogout} className="btn btn-outline">
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        <section className="projects-section">
          <div className="section-header">
            <h2>My Projects</h2>
          </div>

          <form onSubmit={handleAddProject} className="quick-add-form">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="+ Add new project"
              className="quick-add-input"
            />
          </form>

          <div className="projects-grid">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`project-card ${
                  selectedProject?.id === project.id ? "selected" : ""
                }`}
              >
                {editingProject?.id === project.id ? (
                  <form
                    onSubmit={handleUpdateProject}
                    className="project-edit-form"
                  >
                    <input
                      type="text"
                      value={editProjectName}
                      onChange={(e) => setEditProjectName(e.target.value)}
                      className="project-edit-input"
                      autoFocus
                    />
                    <div className="project-actions">
                      <button type="submit" className="project-action-btn save">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelProjectEdit}
                        className="project-action-btn cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div
                      className="project-content"
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="project-icon">📁</div>
                      <h3 className="project-name">{project.name}</h3>
                    </div>
                    <div className="project-actions">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="project-action-btn edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="project-action-btn delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="todos-section">
          {selectedProject ? (
            <>
              <div className="section-header">
                <h2>{selectedProject.name}</h2>
              </div>

              <form onSubmit={handleAddTodo} className="quick-add-form">
                <input
                  type="text"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  placeholder="+ Add new todo"
                  className="quick-add-input"
                />
              </form>

              <div className="todos-list">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`todo-item ${todo.completed ? "completed" : ""}`}
                  >
                    {editingTodo?.id === todo.id ? (
                      <form
                        onSubmit={handleUpdateTodo}
                        className="todo-edit-form"
                      >
                        <input
                          type="text"
                          value={editTodoTitle}
                          onChange={(e) => setEditTodoTitle(e.target.value)}
                          className="todo-edit-input"
                          autoFocus
                        />
                        <div className="todo-actions">
                          <button
                            type="submit"
                            className="todo-action-btn save"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="todo-action-btn cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() =>
                            handleToggleTodo(todo.id, todo.completed)
                          }
                          className="todo-checkbox"
                        />
                        <span className="todo-title">{todo.title}</span>
                        <div className="todo-actions">
                          <button
                            onClick={() => handleEditTodo(todo)}
                            className="todo-action-btn edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="todo-action-btn delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>Select a project to manage your todos</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
