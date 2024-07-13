import React, { useState, useRef, useEffect } from 'react';
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
  const [loader, setLoader] = useState(true);
  const [name, setName] = useState({ val: '', error: false });
  const [email, setEmail] = useState({ val: '', error: false });
  const [columnWidths, setColumnWidths] = useState(initialWidths);
  const [columns, setColumns] = useState(['ID', 'Name', 'Age', 'Gender', 'Email', 'Date']);
  const [sortOrder, setSortOrder] = useState(true) // true for ascending - false for descending

  useEffect(() => {
    fetchTableData()
  }, [page])

  const fetchTableData = async () => {
    try {
      setLoader(true)
      const res = await fetch(`https://randomuser.me/api/?results=1000`);
      const jsonData = await res.json();

      if (!jsonData.hasOwnProperty('error')) {
        const formattedData = jsonData.results.map(user => ({
          id: user.login.uuid.split('-')[0] || '---',
          name: `${user.name.title}. ${user.name.first} ${user.name.last}`,
          age: user.dob.age,
          gender: user.gender,
          email: user.email,
          date: user.dob.date,
          thumbnail: user.picture.thumbnail
        }));

        displayData(formattedData, page);
        setLoader(false)
      } else {
        setLoader(false)
        setData(jsonData.error)
      }
    } catch (e) {
      console.log(e)
    }
  };

  const displayData = (incomingData, pageNum) => {
    const startIndex = (pageNum - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = incomingData.slice(startIndex, endIndex);
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
  
    if (query === '') {
      fetchTableData();
      return;
    }
  
    let temp = [...data];
    temp = temp.filter(val => val.name.toLowerCase().includes(query.toLowerCase()));
  
    if (temp.length > 0) {
      setData(temp);
    } else {
      setName({ ...name, val: query, error: true });
    }
  };

  const filterEmail = query => {
    setEmail({ ...email, val: query, error: false });

    if (query === '') {
      fetchTableData();
      return;
    }

    let temp = [...data];
    temp = temp.filter(val => val.email.toLowerCase().includes(query.toLowerCase()));

    if (temp.length > 0) {
      setData(temp);
    } else {
      setEmail({ ...email, val: query, error: true });
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
        return convertDateFormat(row.date);
      default:
        return null;
    }
  };

  const convertDateFormat = (isoDateString) => {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <React.Fragment>
      <div className='grid grid-cols-12 gap-4 px-4 md:px-20 pt-4'>
        <div className='col-span-12 md:col-span-6'>
          <input
            type='text'
            value={name.val}
            placeholder='Search Name...'
            onChange={e => filterName(e.target.value)}
            className='w-full border-[1px] border-gray-500 p-2 font-qsand'
          />
          {name.error ? <p className='font-qsand text-sm text-red-500'>No records found for the specified query..!!</p> : null}
        </div>

        <div className='col-span-12 md:col-span-6'>
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
              {columns.map((header, index) => (
                <th
                  key={header}
                  style={{ width: `${columnWidths[header]}%` }}
                  className="border px-4 py-2 relative font-qsand"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                >
                  <div className='flex justify-between items-center cursor-move'>
                    <span>{header}</span>
                    <div className='flex flex-col space-y-1 cursor-pointer'>
                      {!sortOrder
                        ? header === 'ID' || header === 'Age'
                          ? <TbSortAscendingNumbers size={20} onClick={() => toggleSort(header)} />
                          : <TbSortAscendingLetters size={20} onClick={() => toggleSort(header)} />
                        : header === 'ID' || header === 'Age'
                          ? <TbSortDescendingNumbers size={20} onClick={() => toggleSort(header)} />
                          : <TbSortDescendingLetters size={20} onClick={() => toggleSort(header)} />
                      }
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {!loader ? (
            <tbody className='dark:bg-neutral-700'>
              {typeof data != 'string' ? (
                data?.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className='p-4 border font-qsand relative dark:text-white'
                        style={{ width: `${columnWidths[column]}%` }}
                      >
                        {renderColumnContent(row, column)}
                        <div
                          className='absolute top-0 right-0 h-full w-1 cursor-col-resize'
                          onMouseDown={(e) => handleMouseDown(e, column)}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr >
                  <td colSpan={6} className="border px-4 py-2 font-qsand text-red-500 dark:text-yellow-500 text-center">{data}</td></tr>
              )}
            </tbody>
          ) : (
            <tbody className='dark:bg-neutral-700'>
              {Array(5).fill(0).map((_, id) => (
                <tr key={id}>
                  <td className="border px-4 py-2 font-qsand dark:text-white">
                    <div className="h-6 bg-gray-300 rounded-md relative overflow-hidden">
                      <div className="absolute inset-0 bg-gray-200 animate-wave"></div>
                    </div>
                  </td>
                  <td className="border px-4 py-2 font-qsand dark:text-white">
                    <div className="h-6 bg-gray-300 rounded-md relative overflow-hidden">
                      <div className="absolute inset-0 bg-gray-200 animate-wave"></div>
                    </div>
                  </td>
                  <td className="border px-4 py-2 font-qsand dark:text-white">
                    <div className="h-6 bg-gray-300 rounded-md relative overflow-hidden">
                      <div className="absolute inset-0 bg-gray-200 animate-wave"></div>
                    </div>
                  </td>
                  <td className="border px-4 py-2 font-qsand dark:text-white">
                    <div className="h-6 bg-gray-300 rounded-md relative overflow-hidden">
                      <div className="absolute inset-0 bg-gray-200 animate-wave"></div>
                    </div>
                  </td>
                  <td className="border px-4 py-2 font-qsand dark:text-white">
                    <div className="h-6 bg-gray-300 rounded-md relative overflow-hidden">
                      <div className="absolute inset-0 bg-gray-200 animate-wave"></div>
                    </div>
                  </td>
                  <td className="border px-4 py-2 font-qsand dark:text-white">
                    <div className="h-6 bg-gray-300 rounded-md relative overflow-hidden">
                      <div className="absolute inset-0 bg-gray-200 animate-wave"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      <div className="mt-4 mb-12 flex items-center justify-center">
        <div className="text-green-500 pr-5 cursor-pointer dark:text-red-500" onClick={prevPage}>
          <IoChevronBackCircleOutline />
        </div>

        <div className='is1000:flex hidden'>
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
        </div>

        <div className="flex is1000:hidden">
          <p className='font-qsand border-blue-500 border px-5 rounded-lg dark:border-yellow-500 dark:text-white dark:bg-stone-800'>{page} / {Math.ceil(1000 / itemsPerPage)}</p>
        </div>

        <div className="text-green-500 pl-5 cursor-pointer dark:text-red-500" onClick={nextPage}>
          <IoChevronForwardCircleOutline />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ResizableTable;
