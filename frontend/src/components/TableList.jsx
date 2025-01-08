import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table";

import PropTypes from "prop-types";

 function TableList({ tasks, onDeleteTask }) {
  console.log("Renderizando TableList...");
  const taskList = tasks || [];

  return (
    <TableRoot>
      <Table className="bg-gray-800 ">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Id</TableHeaderCell>
            <TableHeaderCell>Tarea</TableHeaderCell>
            <TableHeaderCell className="text-center">
              Completada
            </TableHeaderCell>
            <TableHeaderCell className="text-center">Acciones</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {taskList.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.id}</TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell className="text-center">
                {task.completed ? "✅" : "❌"}
              </TableCell>
              <TableCell className="text-center">
                <button
                  onClick={() => {
                    console.log("Eliminando tarea con ID:", task.id);
                    onDeleteTask(task.id);
                  }}
                  className="bg-red-500 p-1 rounded text-white hover:bg-red-800 duration-300"
                >
                  Eliminar
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableRoot>
  );
}

export default React.memo(TableList);

// Validación de props
TableList.propTypes = {
  tasks: PropTypes.array.isRequired, // Debe ser un array
  onDeleteTask: PropTypes.func.isRequired,
};
