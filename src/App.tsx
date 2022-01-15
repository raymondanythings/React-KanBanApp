import { useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { IToDoState, saveToDos, toDoState } from "./atoms";
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
  justify-content: center;
  flex-wrap: wrap;
  /* overflow-x: auto; */
  gap: 10px;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source, draggableId, type } = info;
    if (!destination) return;
    let newToDos;
    if (destination.droppableId.includes("trash")) {
      if (type === "board") {
        setToDos((allBoards) => {
          const keys = Object.keys(allBoards);
          keys.splice(source.index, 1);
          console.log(allBoards);
          const myObj = new Map();
          keys.forEach((m) => {
            myObj.set(m, allBoards[m]);
          });
          const result = Object.fromEntries(myObj);
          return result;
        });
        return;
      } else {
        setToDos((allBoards) => {
          const boardCopy = [...allBoards[source.droppableId]];
          boardCopy.splice(source.index, 1);
          newToDos = { ...allBoards, [source.droppableId]: boardCopy };
          return newToDos;
        });
      }
      return;
    }
    if (destination.droppableId === "Boards") {
      setToDos((allBoards) => {
        const keys = Object.keys(allBoards);
        keys.splice(source.index, 1);
        keys.splice(destination.index, 0, draggableId);
        const newBoardList: IToDoState = {};
        keys.forEach((key) => {
          newBoardList[key] = allBoards[key];
        });
        return newBoardList;
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
        return newToDos;
      });
      return;
    }
  };
  useEffect(() => {
    saveToDos(toDos);
  }, [toDos]);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <CreateBoard />
        <Droppable droppableId="Boards" type="board" direction="horizontal">
          {(provided) => (
            <Boards ref={provided.innerRef} {...provided.droppableProps}>
              {Object.keys(toDos).map((boardId, index) => {
                return (
                  <Board
                    key={boardId}
                    boardId={boardId}
                    toDos={toDos[boardId]}
                    index={index}
                  />
                );
              })}
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
