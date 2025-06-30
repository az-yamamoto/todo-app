import type { Todo } from "@/types/types";
import { useEffect, useState } from "react";
import { AddTodoDialog } from "./components/AddTodoDialog";
import { TodoStatusArea } from "./components/TodoStatusArea";

const STORAGE_KEY = "todos";

export const TodoTemplate = () => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored && stored.length > 0) {
			setTodos(JSON.parse(stored));
		}
		setIsInitialized(true);
	}, []);

	useEffect(() => {
		if (isInitialized) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
		}
	}, [todos, isInitialized]);

	const addTodo = (name: string, detail: string) => {
		const sortedTodos = [...todos].sort((a, b) => a.id - b.id);
		const lastId = sortedTodos.length > 0 ? sortedTodos[sortedTodos.length - 1].id : 0;
		const newTodo: Todo = {
			id: lastId + 1,
			name,
			status: "not-started",
			detail: detail,
		};
		setTodos((prevTodos) => [...prevTodos, newTodo]);
		localStorage.setItem(STORAGE_KEY, JSON.stringify([...todos, newTodo]));
	};

	const updateStatus = (id: number, newStatus: Todo["status"]) => {
		setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, status: newStatus } : todo)));
	};

	const updateTodo = (id: number, name: string, detail?: string) => {
		setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, name, detail: detail } : todo)));
	};

	const deleteTodo = (id: number) => {
		setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
	};

	const todoNotStarted = todos.filter((todo) => todo.status === "not-started");
	const todoDoing = todos.filter((todo) => todo.status === "doing");
	const todoDone = todos.filter((todo) => todo.status === "done");

	return (
		<div className="flex flex-col p-4 max-h-full w-full">
			<AddTodoDialog onAdd={addTodo} />
			<div className="flex gap-1 justify-center flex-1 mt-4 overflow-hidden">
				<TodoStatusArea
					todos={todoNotStarted}
					status="not-started"
					updateStatus={updateStatus}
					updateTodo={updateTodo}
					deleteTodo={deleteTodo}
				/>
				<TodoStatusArea
					todos={todoDoing}
					status="doing"
					updateStatus={updateStatus}
					updateTodo={updateTodo}
					deleteTodo={deleteTodo}
				/>
				<TodoStatusArea
					todos={todoDone}
					status="done"
					updateStatus={updateStatus}
					updateTodo={updateTodo}
					deleteTodo={deleteTodo}
				/>
			</div>
		</div>
	);
};
