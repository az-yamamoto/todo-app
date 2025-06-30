import type { Todo } from "@/types/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { TodoBox } from ".";

describe("TodoBox描画", () => {
	test("初期値確認", async () => {
		const todo = {
			id: 1,
			name: "Test Todo",
			status: "not-started",
			detail: "This is a test todo detail.",
		} as Todo;
		const updateTodo = () => {};
		const deleteTodo = () => {};

		render(<TodoBox todo={todo} updateTodo={updateTodo} deleteTodo={deleteTodo} />);
		expect(screen.getByText("Test Todo")).toBeInTheDocument();
	});
	test("ドラッグの確認", async () => {
		const todo = {
			id: 2,
			name: "Draggable Todo",
			status: "not-started",
			detail: "This todo can be dragged.",
		} as Todo;
		const updateTodo = () => {};
		const deleteTodo = () => {};

		render(<TodoBox todo={todo} updateTodo={updateTodo} deleteTodo={deleteTodo} />);
		const todoBox = screen.getByText("Draggable Todo");
		fireEvent.dragStart(todoBox, {
			dataTransfer: {
				setData: (type: string, value: string) => {
					expect(type).toBe("text/plain");
					expect(value).toBe(String(todo.id));
				},
			},
		});
	});
});
