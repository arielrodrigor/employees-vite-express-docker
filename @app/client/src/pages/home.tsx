/* eslint-disable react/require-default-props */
/* eslint-disable react/button-has-type */
import '../app.css';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Modal from '../components/modal';
import {
  addDepartment,
  addEmployee,
  fetchDeparments,
  fetchEmployees,
  updateEmployeeStatus
} from '../util/api';
import { Department, Employee } from '../util/types';

function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
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
  const [modalMessage, setModalMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: Employee[] = await fetchEmployees();
        setEmployees(data);

        const departmentsData: Department[] = await fetchDeparments();
        setDepartments(departmentsData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusToggle = async (id: string) => {
    try {
      const employee = employees.find((e) => e.id === id);
      if (!employee) return;
      const updatedStatus = !employee.active;
      const terminationDate = !updatedStatus
        ? new Date().toISOString()
        : undefined;

      await updateEmployeeStatus(id, updatedStatus);

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id
            ? {
                ...emp,
                active: updatedStatus,
                terminationDate: !updatedStatus ? terminationDate : undefined
              }
            : emp
        )
      );
      setModalMessage({
        type: 'success',
        text: `Employee ${updatedStatus ? 'activated' : 'deactivated'} successfully.`
      });
    } catch (error) {
      setModalMessage({
        type: 'error',
        text: 'Failed to update employee status.'
      });
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/employee/${id}`);
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newEmployee.firstName ||
      !newEmployee.lastName ||
      !newEmployee.departmentId
    ) {
      setModalMessage({
        type: 'error',
        text: 'Please fill out all required fields.'
      });
      return;
    }
    try {
      const addedEmployee = await addEmployee(newEmployee);
      setEmployees((prev) => [...prev, addedEmployee]);
      setIsEmployeeModalOpen(false);
      setModalMessage({
        type: 'success',
        text: 'Employee added successfully.'
      });
    } catch (error) {
      setModalMessage({ type: 'error', text: 'Failed to add employee.' });
    }
  };

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDepartment.name) {
      setModalMessage({
        type: 'error',
        text: 'Department name cannot be empty.'
      });
      return;
    }
    try {
      await addDepartment(newDepartment);
      setIsDepartmentModalOpen(false);
      setModalMessage({
        type: 'success',
        text: 'Department added successfully.'
      });
    } catch (error) {
      setModalMessage({ type: 'error', text: 'Failed to add department.' });
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
              <div className="flex items-center justify-between">
                <img
                  src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${employee.firstName.replaceAll(' ', '')}`}
                  alt="Avatar"
                  className="h-20 w-20 rounded-full border border-gray-300"
                />
                {employee.terminationDate && (
                  <span className="absolute right-2 top-2 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                    Terminated:{' '}
                    {new Date(employee.terminationDate).toLocaleDateString()}
                  </span>
                )}
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
                  Email: {employee.contactInfo?.email ?? 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  Phone: {employee.contactInfo?.phone ?? 'N/A'}
                </p>
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
                  className={`w-24 rounded py-2 text-sm text-white ${
                    employee.active
                      ? 'bg-[#bf6363] hover:bg-red-700'
                      : 'bg-[#62bf63] hover:bg-[#4fa14e]'
                  }`}
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
        message={modalMessage}
        onCloseMessage={() => setModalMessage(null)}
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
          <select
            className="mb-4 w-full rounded border p-2"
            value={newEmployee.departmentId}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, departmentId: e.target.value })
            }
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
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
        message={modalMessage}
        onCloseMessage={() => setModalMessage(null)}
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
