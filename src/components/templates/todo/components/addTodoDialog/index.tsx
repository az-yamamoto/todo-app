import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";

type AddTodoDialogProps = {
	onAdd: (name: string, detail: string) => void;
};

type FormValues = {
	name: string;
	detail?: string;
};

export const AddTodoDialog = ({ onAdd }: AddTodoDialogProps) => {
	const [open, setOpen] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormValues>({
		defaultValues: {
			name: "",
			detail: "",
		},
		mode: "onSubmit",
	});

	const onSubmit = (data: FormValues) => {
		onAdd(data.name, data.detail || "");
		reset();
		setOpen(false);
	};

	return (
		<>
			<Button onClick={() => setOpen(true)} className="w-max">
				Todo追加
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Todo追加</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="todo_name" className="text-right">
									Todo Name
								</Label>
								<Input
									id="todo_name"
									className="col-span-3"
									{...register("name", { required: "todo nameは必須です" })}
								/>
								<p className="text-red-500 col-span-4">{errors.name?.message}</p>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="todo_detail" className="text-right">
									Todo Detail
								</Label>
								<Input id="todo_detail" className="col-span-3" {...register("detail")} />
							</div>
						</div>
						<DialogFooter>
							<Button type="submit">追加</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};
