import { Header } from "./components/atoms/Header";
import { TodoTemplate } from "./components/templates/Todo";

function App() {
	return (
		<div className="flex flex-col h-screen max-h-screen w-screen">
			<Header />
			<main className="flex-1 flex overflow-hidden ">
				<TodoTemplate />
			</main>
		</div>
	);
}

export default App;
