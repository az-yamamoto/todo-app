import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("http://localhost:5173/");
	// todoを追加
	await page.getByRole("button", { name: "Todo追加" }).click();
	await page.getByRole("textbox", { name: "Todo Name" }).click();
	await page.getByRole("textbox", { name: "Todo Name" }).fill("test");
	await page.getByRole("textbox", { name: "Todo Detail" }).click();
	await page.getByRole("textbox", { name: "Todo Detail" }).fill("test detail");
	await page.getByRole("button", { name: "追加" }).click();
	await expect(page.getByRole("button", { name: "test" })).toBeVisible();
});

test.afterEach(async ({ page }) => {
	// テスト後にローカルストレージをクリア
	await page.evaluate(() => {
		localStorage.clear();
	});
});

test("初期画面の確認", async ({ page }) => {
	await expect(page).toHaveTitle("Todo App");
	await expect(page.getByRole("button", { name: "Todo追加" })).toBeVisible();
});

test.describe("todo入力・更新・削除の確認", () => {
	test("Todoの追加", async ({ page }) => {
		await page.getByRole("button", { name: "Todo追加" }).click();
		await page.getByRole("textbox", { name: "Todo Name" }).click();
		await page.getByRole("textbox", { name: "Todo Name" }).fill("test2");
		await page.getByRole("textbox", { name: "Todo Detail" }).click();
		await page.getByRole("textbox", { name: "Todo Detail" }).fill("test detail2");
		await page.getByRole("button", { name: "追加" }).click();
		await expect(page.getByRole("button", { name: "test2" })).toBeVisible();
	});

	test("詳細画面の確認", async ({ page }) => {
		await page.getByRole("button", { name: "test" }).click();
		await expect(page.getByRole("textbox", { name: "Todo Name" })).toHaveValue("test");
		await expect(page.getByRole("textbox", { name: "Todo Detail" })).toHaveValue("test detail");
	});

	test("Todoの更新", async ({ page }) => {
		await page.getByRole("button", { name: "test" }).click();
		await page.getByRole("textbox", { name: "Todo Name" }).click();
		await page.getByRole("textbox", { name: "Todo Name" }).fill("test update");
		await page.getByRole("textbox", { name: "Todo Detail" }).click();
		await page.getByRole("textbox", { name: "Todo Detail" }).fill("test detail update");
		await page.getByRole("button", { name: "更新" }).click();
		await expect(page.getByRole("button", { name: "test update" })).toBeVisible();
	});

	test("Todoの削除", async ({ page }) => {
		await page.getByRole("button", { name: "test" }).click();
		await page.getByRole("button", { name: "削除" }).click();
		await expect(page.getByRole("button", { name: "test" })).not.toBeVisible();
	});
});

test.describe("ローカルストレージに保存されていることの確認", () => {
	test("Todoの追加", async ({ page }) => {
		const todos = await page.evaluate(() => {
			return JSON.parse(localStorage.getItem("todos") || "[]");
		});
		expect(todos.length).toBe(1);
		expect(todos[0].name).toBe("test");
		expect(todos[0].detail).toBe("test detail");

		await page.getByRole("button", { name: "Todo追加" }).click();
		await page.getByRole("textbox", { name: "Todo Name" }).click();
		await page.getByRole("textbox", { name: "Todo Name" }).fill("test2");
		await page.getByRole("textbox", { name: "Todo Detail" }).click();
		await page.getByRole("textbox", { name: "Todo Detail" }).fill("test detail2");
		await page.getByRole("button", { name: "追加" }).click();

		const updatedTodos = await page.evaluate(() => {
			return JSON.parse(localStorage.getItem("todos") || "[]");
		});
		expect(updatedTodos.length).toBe(2);
		expect(updatedTodos[1].name).toBe("test2");
		expect(updatedTodos[1].detail).toBe("test detail2");
	});

	test("Todoの更新", async ({ page }) => {
		await page.getByRole("button", { name: "test" }).click();
		await page.getByRole("textbox", { name: "Todo Name" }).click();
		await page.getByRole("textbox", { name: "Todo Name" }).fill("test update");
		await page.getByRole("textbox", { name: "Todo Detail" }).click();
		await page.getByRole("textbox", { name: "Todo Detail" }).fill("test detail update");
		await page.getByRole("button", { name: "更新" }).click();

		const updatedTodos = await page.evaluate(() => {
			return JSON.parse(localStorage.getItem("todos") || "[]");
		});
		expect(updatedTodos.length).toBe(1);
		expect(updatedTodos[0].name).toBe("test update");
		expect(updatedTodos[0].detail).toBe("test detail update");
	});

	test("Todoの削除", async ({ page }) => {
		await page.getByRole("button", { name: "test" }).click();
		await page.getByRole("button", { name: "削除" }).click();

		const updatedTodos = await page.evaluate(() => {
			return JSON.parse(localStorage.getItem("todos") || "[]");
		});
		expect(updatedTodos.length).toBe(0);
	});
});

test.describe("drag & dropの確認", () => {
	test("Todoのdoingへのドラッグ＆ドロップ", async ({ page }) => {
		await page.getByRole("button", { name: "test" }).dragTo(page.getByTestId("doing"));
		await expect(page.getByTestId("doing").getByRole("button", { name: "test" })).toBeVisible();
		await expect(page.getByTestId("not-started").getByRole("button", { name: "test" })).not.toBeVisible();

		const updatedTodos = await page.evaluate(() => {
			return JSON.parse(localStorage.getItem("todos") || "[]");
		});
		expect(updatedTodos[0].status).toBe("doing");
	});

	test("Todoのdoneへのドラッグ＆ドロップ", async ({ page }) => {
		await page.getByRole("button", { name: "test" }).dragTo(page.getByTestId("done"));
		await expect(page.getByTestId("done").getByRole("button", { name: "test" })).toBeVisible();
		await expect(page.getByTestId("doing").getByRole("button", { name: "test" })).not.toBeVisible();

		const updatedTodos = await page.evaluate(() => {
			return JSON.parse(localStorage.getItem("todos") || "[]");
		});
		expect(updatedTodos[0].status).toBe("done");
	});

	test("Todoのnot-startedへのドラッグ＆ドロップ", async ({ page }) => {
		await page.getByRole("button", { name: "test" }).dragTo(page.getByTestId("doing"));

		await page.getByRole("button", { name: "test" }).dragTo(page.getByTestId("not-started"));
		await expect(page.getByTestId("not-started").getByRole("button", { name: "test" })).toBeVisible();
		await expect(page.getByTestId("doing").getByRole("button", { name: "test" })).not.toBeVisible();

		const updatedTodos = await page.evaluate(() => {
			return JSON.parse(localStorage.getItem("todos") || "[]");
		});
		expect(updatedTodos[0].status).toBe("not-started");
	});
});
