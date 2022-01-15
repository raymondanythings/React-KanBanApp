import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { saveToDos, toDoState } from "../atoms";

interface IBoard {
  board: string;
}

function CreateBoard() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<IBoard>();
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onValid = ({ board }: IBoard) => {
    if (Object.keys(toDos).length >= 8) {
      return setError("board", { message: "Board is Full" });
    }
    setToDos((allBoards) => {
      const newBoard = { [board]: [], ...allBoards };
      saveToDos(newBoard);
      return newBoard;
    });
    setValue("board", "");
  };
  return (
    <form onSubmit={handleSubmit(onValid)}>
      <input
        type="text"
        placeholder="ADD BOARD"
        {...register("board", {
          required: true,
        })}
      />
      <ErrorMessage errors={errors} name="board" />
    </form>
  );
}

export default CreateBoard;
