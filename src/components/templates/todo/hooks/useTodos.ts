import { useState, useCallback } from "react";
import type { Todo } from "@/types/types";

const STORAGE_KEY = "todos";

export function useTodos() {
	const [todos, setTodos] = useState<Todo[]>(() => {
		try {
			const item = window.localStorage.getItem(STORAGE_KEY);
			return item ? JSON.parse(item) : [];
		} catch (error) {
			console.error("Error reading todos from localStorage:", error);
			return [];
		}
	});

	const updateTodos = useCallback(
		(value: Todo[] | ((prevTodos: Todo[]) => Todo[])) => {
			try {
				const newTodos = value instanceof Function ? value(todos) : value;
				setTodos(newTodos);
				window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
			} catch (error) {
				console.error("Error saving todos to localStorage:", error);
			}
		},
		[todos]
	);

	return [todos, updateTodos] as const;
}