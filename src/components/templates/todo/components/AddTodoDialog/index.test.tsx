import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { AddTodoDialog } from ".";

describe("AddTodoDialog描画", () => {
	test("Todo追加ボタンが表示される", async () => {
		const onAdd = () => {};
		render(<AddTodoDialog onAdd={onAdd} />);
		expect(screen.getByText("Todo追加")).toBeInTheDocument();
	});

	test("Todo追加ボタン押下後、Todo追加ダイアログが表示される", async () => {
		const onAdd = () => {};
		render(<AddTodoDialog onAdd={onAdd} />);
		const button = screen.getByText("Todo追加");
		expect(screen.queryByText("Todo Name")).not.toBeInTheDocument();

		await userEvent.click(button);
		expect(screen.getByText("Todo Name")).toBeInTheDocument();
	});

	test("Todo追加ダイアログで入力値が反映される", async () => {
		const onAdd = () => {};
		render(<AddTodoDialog onAdd={onAdd} />);
		const button = screen.getByText("Todo追加");
		await userEvent.click(button);
		const nameInput = screen.getByLabelText("Todo Name");
		const detailInput = screen.getByLabelText("Todo Detail");
		await userEvent.type(nameInput, "Test Todo");
		await userEvent.type(detailInput, "This is a test todo detail.");
		expect(nameInput).toHaveValue("Test Todo");
		expect(detailInput).toHaveValue("This is a test todo detail.");
	});

	test("Todo追加ダイアログで追加ボタンを押下", async () => {
		const onAdd = vi.fn();
		render(<AddTodoDialog onAdd={onAdd} />);
		const button = screen.getByText("Todo追加");
		await userEvent.click(button);
		const nameInput = screen.getByLabelText("Todo Name");
		const detailInput = screen.getByLabelText("Todo Detail");
		await userEvent.type(nameInput, "Test Todo");
		await userEvent.type(detailInput, "This is a test todo detail.");
		const addButton = screen.getByRole("button", { name: "追加" });
		await userEvent.click(addButton);
		expect(onAdd).toHaveBeenCalledWith("Test Todo", "This is a test todo detail.");
	});

	test("Todo追加ダイアログで追加ボタンを押下後、入力値がリセットされる", async () => {
		const onAdd = vi.fn();
		render(<AddTodoDialog onAdd={onAdd} />);
		const button = screen.getByText("Todo追加");
		await userEvent.click(button);
		const nameInput = screen.getByLabelText("Todo Name");
		const detailInput = screen.getByLabelText("Todo Detail");
		await userEvent.type(nameInput, "Test Todo");
		await userEvent.type(detailInput, "This is a test todo detail.");
		const addButton = screen.getByRole("button", { name: "追加" });
		await userEvent.click(addButton);
		expect(nameInput).toHaveValue("");
		expect(detailInput).toHaveValue("");
	});

	test("Todo追加ダイアログで追加ボタンを押下後、ダイアログが閉じる", async () => {
		const onAdd = vi.fn();
		render(<AddTodoDialog onAdd={onAdd} />);
		const button = screen.getByText("Todo追加");
		await userEvent.click(button);
		const nameInput = screen.getByLabelText("Todo Name");
		const detailInput = screen.getByLabelText("Todo Detail");
		await userEvent.type(nameInput, "Test Todo");
		await userEvent.type(detailInput, "This is a test todo detail.");
		const addButton = screen.getByRole("button", { name: "追加" });
		await userEvent.click(addButton);
		expect(screen.queryByText("Todo Name")).not.toBeInTheDocument();
	});
});
