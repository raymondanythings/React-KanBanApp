import { atom } from "recoil";

export const loadToDos = (): IToDoState | {} => {
  const toDos = localStorage.getItem("toDos");
  if (toDos) return JSON.parse(toDos);
  return {};
};

export const saveToDos = (toDos: IToDoState) => {
  localStorage.setItem("toDos", JSON.stringify(toDos));
};

export interface ITodo {
  id: number;
  text: string;
}
interface IToDoState {
  [key: string]: ITodo[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: loadToDos(),
});
