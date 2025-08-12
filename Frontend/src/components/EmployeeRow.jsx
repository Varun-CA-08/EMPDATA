import React from 'react';
import Swal from 'sweetalert2';

const EmployeeRow = ({ emp, handleEdit, handleDelete }) => {
  const confirmDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the employee.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#90EE90',  // Light green confirm button
      cancelButtonColor: '#FFCCCB',   // Light red cancel button
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) handleDelete(emp);
    });
  };

  return (
    <tr>
      <td style={{ fontFamily: 'monospace' }}>{emp._id}</td>
      <td>{emp.name}</td>
      <td>{emp.email}</td>
      <td>{emp.department}</td>
      <td>
        <button
          className="btn btn-sm me-2"
          style={{ backgroundColor: '#1791d8ff', color: '#000', border: 'none' }}
          onClick={() => handleEdit(emp)}
        >
          Edit
        </button>
        <button
          className="btn btn-sm"
          style={{ backgroundColor: '#ec4a4aff', color: '#000', border: 'none' }}
          onClick={confirmDelete}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default EmployeeRow;
