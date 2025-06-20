import type { Todo } from "@/types/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { TodoStatusArea } from ".";

describe("TodoStatusArea描画", () => {
	test("初期値確認", () => {
		const todos = [
			{ id: 1, name: "Test Todo 1", status: "not-started", detail: "This is a test todo detail." },
			{ id: 2, name: "Test Todo 2", status: "doing", detail: "This is another test todo detail." },
		] as Todo[];
		const status = "not-started";
		const updateStatus = () => {};
		const updateTodo = () => {};
		const deleteTodo = () => {};

		render(
			<TodoStatusArea
				status={status}
				todos={todos}
				updateStatus={updateStatus}
				updateTodo={updateTodo}
				deleteTodo={deleteTodo}
			/>,
		);

		expect(document.querySelector(".text-lg.font-semibold.mb-3")).toHaveTextContent(status);
		expect(screen.getAllByTestId("todoBox")).toHaveLength(todos.length);
	});

	test("onDropの確認", () => {
		const todos = [
			{ id: 1, name: "Test Todo 1", status: "not-started", detail: "This is a test todo detail." },
			{ id: 2, name: "Test Todo 2", status: "doing", detail: "This is another test todo detail." },
		] as Todo[];
		const status = "not-started";
		const updateStatus = vi.fn();
		const updateTodo = () => {};
		const deleteTodo = () => {};

		render(
			<TodoStatusArea
				status={status}
				todos={todos}
				updateStatus={updateStatus}
				updateTodo={updateTodo}
				deleteTodo={deleteTodo}
			/>,
		);

		const todoStatusArea = screen.getByText(status).closest("section");
		if (!todoStatusArea) {
			throw new Error("TodoStatusArea section not found");
		}
		const dataTransfer = {
			getData: vi.fn(() => "1"), // Assuming the ID of the todo being dragged is 1
			setData: vi.fn(),
		};
		fireEvent.drop(todoStatusArea, {
			dataTransfer: dataTransfer,
		});
		expect(dataTransfer.getData).toHaveBeenCalledWith("text/plain");

		expect(updateStatus).toHaveBeenCalledWith(1, status);
	});
});
