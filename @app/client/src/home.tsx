/* eslint-disable react/button-has-type */
import './app.css';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ContactInfo {
  email?: string;
  phone?: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  departmentName: string;
  hireDate: string;
  contactInfo: ContactInfo;
  active: boolean;
  terminationDate?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded bg-white p-6 shadow">
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}

function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: '',
    hireDate: ''
  });
  const [newDepartment, setNewDepartment] = useState({ name: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employees');
        const data: Employee[] = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleStatusToggle = async (id: string) => {
    try {
      const employee = employees.find((e) => e.id === id);
      if (!employee) return;
      const updatedStatus = !employee.active;
      await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active: updatedStatus })
      });
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id ? { ...emp, active: updatedStatus } : emp
        )
      );
    } catch (error) {
      console.error('Error toggling employee status:', error);
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/employee/${id}`);
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: newEmployee.firstName,
          lastName: newEmployee.lastName,
          contactInfo: {
            email: newEmployee.email,
            phone: newEmployee.phone
          },
          hireDate: newEmployee.hireDate,
          currentDepartmentId: newEmployee.departmentId
        })
      });
      if (response.ok) {
        const addedEmployee = await response.json();
        setEmployees((prev) => [...prev, addedEmployee]);
        setIsEmployeeModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newDepartment.name })
      });
      if (response.ok) {
        setIsDepartmentModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] p-8">
      <header className="mb-8">
        <h1 className="text-center text-4xl font-bold text-[#bf6363]">
          Employee Management
        </h1>
      </header>

      <div className="mb-6 flex justify-between">
        <button
          type="button"
          className="rounded bg-[#62bf63] px-4 py-2 text-white hover:bg-[#4fa14e]"
          onClick={() => setIsEmployeeModalOpen(true)}
        >
          New Employee
        </button>
        <button
          type="button"
          className="rounded bg-[#6b7280] px-4 py-2 text-white hover:bg-[#565b64]"
          onClick={() => setIsDepartmentModalOpen(true)}
        >
          New Department
        </button>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading employees...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="relative flex flex-col gap-4 rounded-lg bg-white p-6 shadow transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="flex justify-center">
                <img
                  src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${employee.firstName.replaceAll(' ', '')}`}
                  alt="Avatar"
                  className="h-20 w-20 rounded-full border border-gray-300"
                />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">
                  {employee.firstName} {employee.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  Department: {employee.departmentName}
                </p>
                <p className="text-sm text-gray-600">
                  Hire Date: {new Date(employee.hireDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Email: {employee.contactInfo.email ?? 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  Phone: {employee.contactInfo.phone ?? 'N/A'}
                </p>
                {employee.terminationDate && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
                      Termination Date:
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      {new Date(employee.terminationDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-around">
                <button
                  type="button"
                  className="w-24 rounded bg-[#62bf63] py-2 text-sm text-white hover:bg-[#4fa14e]"
                  onClick={() => handleViewDetails(employee.id)}
                >
                  View Details
                </button>
                <button
                  type="button"
                  className="w-24 rounded bg-[#bf6363] py-2 text-sm text-white hover:bg-red-700"
                  onClick={() => handleStatusToggle(employee.id)}
                >
                  {employee.active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
      >
        <h2 className="mb-4 text-lg font-bold">New Employee</h2>
        <form onSubmit={handleAddEmployee}>
          <input
            type="text"
            placeholder="First Name"
            className="mb-4 w-full rounded border p-2"
            value={newEmployee.firstName}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, firstName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Last Name"
            className="mb-4 w-full rounded border p-2"
            value={newEmployee.lastName}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, lastName: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            className="mb-4 w-full rounded border p-2"
            value={newEmployee.email}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, email: e.target.value })
            }
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="mb-4 w-full rounded border p-2"
            value={newEmployee.phone}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, phone: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Department ID"
            className="mb-4 w-full rounded border p-2"
            value={newEmployee.departmentId}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, departmentId: e.target.value })
            }
          />
          <input
            type="date"
            className="mb-4 w-full rounded border p-2"
            value={newEmployee.hireDate}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, hireDate: e.target.value })
            }
          />
          <button
            type="submit"
            className="w-full rounded bg-[#62bf63] py-2 text-white"
          >
            Add Employee
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isDepartmentModalOpen}
        onClose={() => setIsDepartmentModalOpen(false)}
      >
        <h2 className="mb-4 text-lg font-bold">New Department</h2>
        <form onSubmit={handleAddDepartment}>
          <input
            type="text"
            placeholder="Department Name"
            className="mb-4 w-full rounded border p-2"
            value={newDepartment.name}
            onChange={(e) => setNewDepartment({ name: e.target.value })}
          />
          <button
            type="submit"
            className="w-full rounded bg-[#62bf63] py-2 text-white"
          >
            Add Department
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Home;
