import React, { useState, useRef } from 'react';
import tableData from '../../../mockdata.json';

const initialWidths = {
  ID: 10,
  Name: 25,
  Age: 10,
  Gender: 15,
  Email: 20,
  Date: 20,
};

const ResizableTable = () => {
  const resizableRefs = useRef({});
  const [columnWidths, setColumnWidths] = useState(initialWidths);

  // Initializes the resizing process when the user clicks and holds on the resizer.
  const handleMouseDown = (e, columnName) => {
    resizableRefs.current[columnName] = { startX: e.clientX, startWidth: columnWidths[columnName] };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Adjusts the column width as the user moves the mouse.
  const handleMouseMove = (e) => {
    const columnName = Object.keys(resizableRefs.current)[0];
    if (columnName) {
      const { startX, startWidth } = resizableRefs.current[columnName];
      const newWidth = startWidth + (e.clientX - startX) / window.innerWidth * 100;
      setColumnWidths(prevWidths => ({
        ...prevWidths,
        [columnName]: Math.max(newWidth, 5), // Ensure a minimum width of 5%
      }));
    }
  };

  // Ends the resizing process when the user releases the mouse button.
  const handleMouseUp = () => {
    resizableRefs.current = {};
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="container mx-auto mt-5">
      <table className="table-auto w-full border-collapse">
        <thead className='bg-blue-500'>
          <tr>
            {Object.keys(initialWidths).map(column => (
              <th
                key={column}
                className="border px-4 py-2 relative font-qsand"
                style={{ width: `${columnWidths[column]}%` }}
              >
                {column}
                <div
                  className="absolute top-0 right-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => handleMouseDown(e, column)}
                ></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.slice(0, 10).map(row => (
            <tr key={row.id}>
              <td className="border px-4 py-2 font-qsand text-center">{row.id}</td>
              <td className="border px-4 py-2 font-qsand text-center">{row.name}</td>
              <td className="border px-4 py-2 font-qsand text-center">{row.age}</td>
              <td className="border px-4 py-2 font-qsand text-center">{row.gender}</td>
              <td className="border px-4 py-2 font-qsand text-center">{row.email}</td>
              <td className="border px-4 py-2 font-qsand text-center">{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResizableTable;
