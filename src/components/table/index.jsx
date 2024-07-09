import React, { useState, useRef, useEffect } from 'react';
import tableData from '../../../mockdata.json';
import { IoChevronBackCircleOutline, IoChevronForwardCircleOutline } from 'react-icons/io5';

const initialWidths = {
  ID: 10,
  Name: 25,
  Age: 10,
  Gender: 15,
  Email: 20,
  Date: 20,
};

const ResizableTable = () => {
  const itemsPerPage = 40;
  const resizableRefs = useRef({});

  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [columnWidths, setColumnWidths] = useState(initialWidths);

  useEffect(() => {
    displayData(page)
  }, [page, tableData])

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

  // generate unique slices based on pagenumber
  const displayData = (pageNum) => {
    const startIndex = (pageNum - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = tableData.slice(startIndex, endIndex);
    setData(paginatedData);
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      displayData(page - 1);
    }
  };

  const nextPage = () => {
    const maxPage = Math.ceil(1000 / itemsPerPage);
    if (page < maxPage) {
      setPage(page + 1);
      displayData(page + 1);
    }
  };

  const displayUniquePage = (newPage) => {
    setPage(newPage);
    displayData(newPage);
  };

  return (
    <React.Fragment>
      <div className="container mx-auto mt-5 h-[580px] overflow-auto">
        <table className="table-auto w-full border-collapse h-96">
          <thead className='bg-blue-500 sticky top-0 z-10'>
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
            {data.map(row => (
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
      <div className="mt-4 mb-12 flex items-center justify-center">
        <div className="text-green-500 pr-5 cursor-pointer dark:text-red-500" onClick={prevPage}>
          <IoChevronBackCircleOutline />
        </div>

        {Array.from({ length: Math.ceil(1000 / itemsPerPage) }, (_, index) => (
          <p
            key={index + 1}
            className={`font-qsand px-2 mr-2 text-[10px] border ${index + 1 === page ? 'bg-blue-500 text-white dark:bg-stone-800' : 'border-blue-500 text-blue-500 dark:text-black dark:border-stone-800'
              } rounded-full cursor-pointer`}
            onClick={() => displayUniquePage(index + 1)}
          >
            {index + 1}
          </p>
        ))}

        <div className="text-green-500 pl-5 cursor-pointer dark:text-red-500" onClick={nextPage}>
          <IoChevronForwardCircleOutline />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ResizableTable;
