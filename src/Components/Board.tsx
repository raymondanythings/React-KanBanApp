import { memo } from "react";
import { useForm } from "react-hook-form";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DragabbleCard from "./DragabbleCard";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
  index: number;
}

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

interface IForm {
  toDo: string;
}

const Wrapper = styled.div<{ isDragging: boolean }>`
  width: 300px;
  padding: 10px 10px;
  background-color: ${(props) =>
    props.isDragging ? props.theme.hoverColor : props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  transition: background-color ${(props) => props.theme.DefaultTransition};
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
  &:hover {
    background-color: #b9bbbf;
  }
`;

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#b2bec3"
      : props.isDraggingFromThis
      ? "#dfe6e9"
      : "transparent"};
  flex-grow: 1;
  transition: background-color ${(props) => props.theme.DefaultTransition};
  padding: 20px;
`;

export const Form = styled.form`
  padding: 0px 20px;
  margin: 0 auto;
  margin-bottom: 5px;
  input {
    border-radius: 5px;
    padding: 10px;
    font-weight: 400;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0);
    transition: all 0.5s ease-in-out;
    font-size: 1rem;
    &:focus {
      border: 1px solid rgba(0, 0, 0, 1);
      background-color: #b8e6f4f5;
      outline: none;
    }
  }
`;

function Board({ toDos, boardId, index }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      const newToDos = {
        ...allBoards,
        [boardId]: [newToDo, ...allBoards[boardId]],
      };
      localStorage.setItem("toDos", JSON.stringify(newToDos));
      return newToDos;
    });
    setValue("toDo", "");
  };
  return (
    <Draggable draggableId={boardId} index={index}>
      {(provided, info) => (
        <Wrapper
          isDragging={info.isDragging}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Title {...provided.dragHandleProps}>
            {boardId.toUpperCase().trim()}
          </Title>
          <Form onSubmit={handleSubmit(onValid)}>
            <input
              type="text"
              placeholder={`Add Task on ${boardId.trim()}`}
              {...register("toDo", {
                required: true,
              })}
            />
          </Form>
          <Droppable droppableId={boardId} type="card">
            {(provided, info) => (
              <Area
                isDraggingOver={info.isDraggingOver}
                isDraggingFromThis={Boolean(info.draggingFromThisWith)}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {toDos.map((toDo, index) => (
                  <DragabbleCard
                    key={toDo.id}
                    toDoId={toDo.id}
                    toDoText={toDo.text}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </Area>
            )}
          </Droppable>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default memo(Board);
