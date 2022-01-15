import { Droppable } from "react-beautiful-dnd";
import { BsTrash } from "react-icons/bs";
import styled from "styled-components";

const TrashCan = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: black;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  font-size: 2rem;
  transition: all 0.3s ease-in-out;
  &:hover {
    color: black;
    background-color: white;
  }
`;

const TrashTarget = styled.div`
  height: 100px;
  width: 20px;
`;

function Trash() {
  return (
    <TrashCan>
      <Droppable type="card" droppableId="trash-card">
        {(provided) => (
          <TrashTarget ref={provided.innerRef} {...provided.droppableProps}>
            {provided.placeholder}
          </TrashTarget>
        )}
      </Droppable>
      <BsTrash />
      <Droppable type="board" droppableId="trash-board">
        {(provided) => (
          <TrashTarget ref={provided.innerRef} {...provided.droppableProps}>
            {provided.placeholder}
          </TrashTarget>
        )}
      </Droppable>
    </TrashCan>
  );
}

export default Trash;
