import type { Todo } from "@/types/types";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { DetailTodoDialog } from "./index";

describe("DetailTodoDialog描画", () => {
	test("初期値確認", async () => {
		const todo = {
			id: 1,
			name: "Test Todo",
			status: "not-started",
			detail: "This is a test todo detail.",
		} as Todo;
		const onOpenChange = () => {};
		const onUpdate = () => {};
		const onDelete = () => {};
		render(
			<DetailTodoDialog
				todo={todo}
				isOpen={true}
				onOpenChange={onOpenChange}
				onDelete={onDelete}
				onUpdate={onUpdate}
			/>,
		);

		expect(screen.getByLabelText("Todo Name")).toHaveDisplayValue("Test Todo");
		expect(screen.getByLabelText("Todo Detail")).toHaveDisplayValue("This is a test todo detail.");
	});

	test("detailが空", async () => {
		const todo = {
			id: 2,
			name: "Test Todo Without detail",
			status: "not-started",
			detail: "",
		} as Todo;
		const onOpenChange = () => {};
		const onUpdate = () => {};
		const onDelete = () => {};
		render(
			<DetailTodoDialog
				todo={todo}
				isOpen={true}
				onOpenChange={onOpenChange}
				onDelete={onDelete}
				onUpdate={onUpdate}
			/>,
		);
		expect(screen.getByLabelText("Todo Detail")).toHaveDisplayValue("");
	});

	test("更新ボタン押下", async () => {
		const todo = {
			id: 3,
			name: "Test Todo Save",
			status: "not-started",
			detail: "This is a test todo detail.",
		} as Todo;
		const onOpenChange = () => {};
		const onUpdate = vi.fn();
		const onDelete = () => {};
		render(
			<DetailTodoDialog
				todo={todo}
				isOpen={true}
				onOpenChange={onOpenChange}
				onDelete={onDelete}
				onUpdate={onUpdate}
			/>,
		);

		const saveButtton = screen.getByRole("button", { name: "更新" });
		const nameInput = screen.getByLabelText("Todo Name");
		const detailInput = screen.getByLabelText("Todo Detail");
		expect(nameInput).toHaveDisplayValue("Test Todo Save");
		expect(detailInput).toHaveDisplayValue("This is a test todo detail.");

		await userEvent.clear(nameInput);
		await userEvent.clear(detailInput);
		expect(nameInput).toHaveDisplayValue("");
		expect(detailInput).toHaveDisplayValue("");

		await userEvent.type(screen.getByLabelText("Todo Name"), "Updated Todo");
		await userEvent.type(screen.getByLabelText("Todo Detail"), "Updated detail");
		await userEvent.click(saveButtton);
		expect(onUpdate).toHaveBeenCalledWith(3, "Updated Todo", "Updated detail");
	});

	test("更新ボタン押下後、ダイアログが閉じる", async () => {
		const todo = {
			id: 5,
			name: "Test Todo Close",
			status: "not-started",
			detail: "This is a test todo detail.",
		} as Todo;
		const onOpenChange = vi.fn();
		const onUpdate = () => {};
		const onDelete = () => {};
		render(
			<DetailTodoDialog
				todo={todo}
				isOpen={true}
				onOpenChange={onOpenChange}
				onDelete={onDelete}
				onUpdate={onUpdate}
			/>,
		);

		const saveButtton = screen.getByRole("button", { name: "更新" });
		await userEvent.click(saveButtton);
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	test("削除ボタン押下", async () => {
		const todo = {
			id: 4,
			name: "Test Todo Delete",
			status: "not-started",
			detail: "This is a test todo detail.",
		} as Todo;
		const onOpenChange = () => {};
		const onUpdate = () => {};
		const onDelete = vi.fn();
		render(
			<DetailTodoDialog
				todo={todo}
				isOpen={true}
				onOpenChange={onOpenChange}
				onDelete={onDelete}
				onUpdate={onUpdate}
			/>,
		);

		const deleteButton = screen.getByRole("button", { name: "削除" });
		await userEvent.click(deleteButton);
		expect(onDelete).toHaveBeenCalledWith(4);
	});

	test("削除ボタン押下後、ダイアログが閉じる", async () => {
		const todo = {
			id: 6,
			name: "Test Todo Delete Close",
			status: "not-started",
			detail: "This is a test todo detail.",
		} as Todo;
		const onOpenChange = vi.fn();
		const onUpdate = () => {};
		const onDelete = vi.fn();
		render(
			<DetailTodoDialog
				todo={todo}
				isOpen={true}
				onOpenChange={onOpenChange}
				onDelete={onDelete}
				onUpdate={onUpdate}
			/>,
		);

		const deleteButton = screen.getByRole("button", { name: "削除" });
		await userEvent.click(deleteButton);
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});
});
