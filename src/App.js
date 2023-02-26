import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

// cards that include the tasks to be completed
const itemsFromBackend = [
  { id: uuidv4(), content: "Initial Client Meeting" },
  { id: uuidv4(), content: "New Sign up form" },
  { id: uuidv4(), content: "Update Policies" },
  { id: uuidv4(), content: "Homepage Redesign" },
];

// 4 columns for the kanban board
const columnsFromBackend = {
  [uuidv4()]: {
    name: "Prioritized Backlog",
    items: itemsFromBackend,
  },
  [uuidv4()]: {
    name: "Work-In-Progress",
    items: [],
  },
  [uuidv4()]: {
    name: "Validate",
    items: [],
  },
  [uuidv4()]: {
    name: "Complete",
    items: [],
  },
};

const onDragEnd = (result, columns, setColumns) => {
  // nothing will change if card is dropped outside the field
  if (!result.destination) return;
  const { source, destination } = result;
  // moving between columns
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    // move within columns
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function App() {
  const [columns, setColumns] = useState(columnsFromBackend);
  return (
    <div className="board">
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {/* Going to have multiple columns */}
        {Object.entries(columns).map(([id, column]) => {
          return (
            <div className="column">
              <h2>{column.name}</h2>
              <div className="dropoff-container">
                <Droppable droppableId={id} key={id}>
                  {/* have a function  that provides props*/}
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="dropoff-space"
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "white",
                        }}
                      >
                        {/* each item */}
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              // what index we are dropping from and dragging too
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    // To pick up item
                                    {...provided.dragHandleProps}
                                    className="cards"
                                    style={{
                                      userSelect: "none",
                                      backgroundColor: snapshot.isDragging
                                        ? "#a8a4d7"
                                        : "#786ed5",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {/* information in the card */}
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
