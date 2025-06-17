export type Todo = {
	id: number;
	name: string;
	status: "not-started" | "doing" | "done";
	detail?: string;
};
