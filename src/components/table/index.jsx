import React, { useState, useRef, useEffect } from 'react';
import tableData from '../../../mockdata.json';
import { IoChevronBackCircleOutline, IoChevronForwardCircleOutline } from 'react-icons/io5';
import { TbSortAscendingLetters, TbSortAscendingNumbers, TbSortDescendingLetters, TbSortDescendingNumbers } from "react-icons/tb";

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
  const dragItem = useRef();
  const dragOverItem = useRef();
  const resizableRefs = useRef({});

  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [name, setName] = useState({ val: '', error: false });
  const [email, setEmail] = useState({ val: '', error: false });
  const [columnWidths, setColumnWidths] = useState(initialWidths);
  const [columns, setColumns] = useState(['ID', 'Name', 'Age', 'Gender', 'Email', 'Date']);
  const [sortOrder, setSortOrder] = useState(true) // true for ascending - false for descending

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

  const toggleSort = (columnToSort) => {
    let temp = [...data];
    setSortOrder(!sortOrder);
    if (sortOrder) {
      if (columnToSort == 'ID') temp.sort((a, b) => b.id - a.id)
      if (columnToSort == 'Age') temp.sort((a, b) => b.age - a.age)
      if (columnToSort == 'Name') temp.sort((a, b) => b.name.localeCompare(a.name))
      else if (columnToSort == 'Email') temp.sort((a, b) => b.email.localeCompare(a.email))
      else if (columnToSort == 'Gender') temp.sort((a, b) => b.gender.localeCompare(a.gender))
      else if (columnToSort == 'Date') temp.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else {
      if (columnToSort == 'ID') temp.sort((a, b) => a.id - b.id)
      if (columnToSort == 'Age') temp.sort((a, b) => a.age - b.age)
      if (columnToSort == 'Name') temp.sort((a, b) => a.name.localeCompare(b.name))
      else if (columnToSort == 'Email') temp.sort((a, b) => a.email.localeCompare(b.email))
      else if (columnToSort == 'Gender') temp.sort((a, b) => a.gender.localeCompare(b.gender))
      else if (columnToSort == 'Date') temp.sort((a, b) => new Date(a.date) - new Date(b.date))
    }
    setData(temp)
  }

  const filterName = query => {
    setName({ ...name, val: query, error: false });
    let temp = [...data];
    temp = temp.filter(val => val.name.toLowerCase().includes(query.toLowerCase()));
    if (query != '' && temp.length > 0) {
      setData(temp)
    } else if (query != '' && temp.length == 0) {
      setName({ ...name, val: query, error: true });
    } else if (query == '') {
      displayData(page)
    }
  }

  const filterEmail = query => {
    setEmail({ ...email, val: query, error: false });
    let temp = [...data];
    temp = temp.filter(val => val.email.toLowerCase().includes(query.toLowerCase()));
    if (query != '' && temp.length > 0) {
      setData(temp)
    } else if (query != '' && temp.length == 0) {
      setEmail({ ...email, val: query, error: true });
    } else if (query == '') {
      displayData(page)
    }
  }

  // Drag and Drop Handlers
  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
    const newColumns = [...columns];
    const draggedItemContent = newColumns[dragItem.current];
    newColumns.splice(dragItem.current, 1);
    newColumns.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = dragOverItem.current;
    dragOverItem.current = null;
    setColumns(newColumns);
  };

  const renderColumnContent = (row, column) => {
    switch (column) {
      case 'ID':
        return row.id;
      case 'Name':
        return row.name;
      case 'Age':
        return row.age;
      case 'Gender':
        return row.gender;
      case 'Email':
        return row.email;
      case 'Date':
        return row.date;
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <div className='grid grid-cols-12 gap-4 px-20 pt-4'>
        <div className='col-span-6'>
          <input
            type='text'
            value={name.val}
            placeholder='Search Name...'
            onChange={e => filterName(e.target.value)}
            className='w-full border-[1px] border-gray-500 p-2 font-qsand'
          />
          {name.error ? <p className='font-qsand text-sm text-red-500'>No records found for the specified query..!!</p> : null}
        </div>

        <div className='col-span-6'>
          <input
            value={email.val}
            type='email'
            placeholder='Search Email...'
            onChange={e => filterEmail(e.target.value)}
            className='w-full border-[1px] border-gray-500 p-2 font-qsand'
          />
          {email.error ? <p className='font-qsand text-sm text-red-500'>No emails found for the specified query..!!</p> : null}
        </div>
      </div>

      <div className="container mx-auto mt-5 h-[580px] overflow-auto">
        <table className="table-auto w-full border-collapse h-96">
          <thead className='bg-blue-500 dark:bg-yellow-500 sticky top-0 z-10'>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column}
                  style={{ width: `${columnWidths[column]}%` }}
                  className="border px-4 py-2 relative font-qsand"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                >
                  <div className='flex justify-between items-center'>
                    {column}
                    {!sortOrder ?
                      (column == 'ID' || column == 'Age' || column == 'Date') ? <TbSortAscendingNumbers className='cursor-pointer' onClick={() => toggleSort(column)} /> : <TbSortAscendingLetters className='cursor-pointer' onClick={() => toggleSort(column)} />
                      : (column == 'ID' || column == 'Age' || column == 'Date') ? <TbSortDescendingNumbers className='cursor-pointer' onClick={() => toggleSort(column)} /> : <TbSortDescendingLetters className='cursor-pointer' onClick={() => toggleSort(column)} />
                    }
                  </div>
                  <div
                    className="absolute top-0 right-0 h-full w-2 cursor-col-resize"
                    onMouseDown={(e) => handleMouseDown(e, column)}
                  ></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='dark:bg-neutral-700'>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="border px-4 py-2 font-qsand dark:text-white">
                    {renderColumnContent(row, column)}
                  </td>
                ))}
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
            className={`font-qsand px-2 mr-2 text-[10px] border ${index + 1 === page ? 'bg-blue-500 text-white dark:bg-stone-800' : 'border-blue-500 text-blue-500 dark:text-white dark:border-stone-800'
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
