import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";
import CreateBoard from "./Components/CreateBoard";

import Trash from "./Components/Trash";

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  padding: 0px 20px;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: flex;
  width: 100%;
  min-height: 300px;
  overflow-x: scroll;
  gap: 10px;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source, draggableId } = info;
    console.log(info);
    if (!destination) return;
    let newToDos;
    if (destination.droppableId === "trash") {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        newToDos = { ...allBoards, [source.droppableId]: boardCopy };
        localStorage.setItem("toDos", JSON.stringify(newToDos));
        return newToDos;
      });
      return;
    }
    if (destination.droppableId === "Boards") {
      setToDos((allBoards) => {
        console.log(allBoards);
        const boardCopy = Object.entries(allBoards);
        const [temp] = boardCopy.splice(source.index, 1);

        boardCopy.splice(destination.index, 0, temp);

        // localStorage.setItem("toDos", JSON.stringify(newToDos));
        return boardCopy.reduce((acc, [key, value]) => {
          console.log(acc);
          return {
            ...acc,
            [key]: value,
          };
        }, {});
      });
      return;
    }

    if (destination.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        newToDos = { ...allBoards, [source.droppableId]: boardCopy };
        localStorage.setItem("toDos", JSON.stringify(newToDos));
        return newToDos;
      });
      return;
    }
    if (destination.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, taskObj);
        newToDos = {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
        localStorage.setItem("toDos", JSON.stringify(newToDos));
        return newToDos;
      });
      return;
    }
  };
  console.log("RENDER");
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <CreateBoard />
        <Droppable droppableId="Boards" type="board" direction="horizontal">
          {(provided) => (
            <Boards ref={provided.innerRef} {...provided.droppableProps}>
              {Object.keys(toDos).map((boardId, index) => (
                <Board
                  key={boardId}
                  boardId={boardId}
                  toDos={toDos[boardId]}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </Boards>
          )}
        </Droppable>
        <Trash />
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
