/* eslint-disable jsx-a11y/label-has-associated-control */
import './app.css';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  contactInfo?: ContactInfo;
  hireDate: string;
  active: boolean;
  currentDepartmentId: string;
  departmentName: string;
}

interface Department {
  id: string;
  name: string;
}

interface DepartmentHistory {
  id: string;
  createdAt: string;
  departmentName: string;
}

function EmployeeDetails() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentHistory, setDepartmentHistory] = useState<
    DepartmentHistory[]
  >([]);
  const [currentDepartment, setCurrentDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const mapEmployeeData = (data: any): Employee => ({
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    employeeId: data.employee_id,
    contactInfo: {
      email: data.contact_info?.email,
      phone: data.contact_info?.phone,
      address: data.contact_info?.address
    },
    hireDate: data.hire_date,
    active: Boolean(data.active),
    currentDepartmentId: data.current_department_id,
    departmentName: data.departmentName
  });

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const employeeResponse = await fetch(`/api/employees/${id}`);
        if (!employeeResponse.ok) throw new Error('Employee not found');
        const employeeData = await employeeResponse.json();
        setEmployee(mapEmployeeData(employeeData));
        setCurrentDepartment(employeeData.current_department_id);

        const departmentsResponse = await fetch('/api/departments');
        const departmentsData: Department[] = await departmentsResponse.json();
        setDepartments(departmentsData);

        const historyResponse = await fetch(`/api/departments-history/${id}`);
        if (!historyResponse.ok)
          throw new Error('Department history not found');
        const historyData: DepartmentHistory[] = await historyResponse.json();
        setDepartmentHistory(historyData);
      } catch (error) {
        setErrorMessage(error.message);
        console.error('Error fetching employee details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  const handleUpdateDepartment = async () => {
    try {
      await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentDepartmentId: currentDepartment
        })
      });
      alert('Department updated successfully');
    } catch (error) {
      setErrorMessage('Failed to update department');
      console.error('Error updating department:', error);
    }
  };

  const handleStatusToggle = async () => {
    try {
      if (!employee) return;
      const updatedStatus = !employee.active;
      await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active: updatedStatus })
      });
      setEmployee((prev) => (prev ? { ...prev, active: updatedStatus } : null));
    } catch (error) {
      setErrorMessage('Failed to update employee status');
      console.error('Error toggling employee status:', error);
    }
  };

  if (isLoading) {
    return (
      <p className="text-center text-gray-500">Loading employee details...</p>
    );
  }

  if (errorMessage) {
    return <p className="text-center text-red-500">{errorMessage}</p>;
  }

  if (!employee) {
    return <p className="text-center text-gray-500">Employee not found</p>;
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] p-8">
      <header className="mb-8 flex items-center justify-between">
        <button
          type="button"
          className="rounded bg-[#6b7280] px-4 py-2 text-white hover:bg-[#565b64]"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
        <h1 className="text-4xl font-bold text-[#bf6363]">Employee Details</h1>
      </header>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center gap-6">
          <img
            src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${employee.firstName}`}
            alt="Avatar"
            className="h-32 w-32 rounded-full border border-gray-300"
          />
          <div>
            <p className="text-lg font-semibold">
              {employee.firstName} {employee.lastName}
            </p>
            <p className="text-sm text-gray-600">
              Employee ID: {employee.employeeId}
            </p>
            <p className="text-sm text-gray-600">
              Department: {employee.departmentName}
            </p>
            <p className="text-sm text-gray-600">
              Email: {employee.contactInfo?.email ?? 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              Phone: {employee.contactInfo?.phone ?? 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              Address: {employee.contactInfo?.address ?? 'N/A'}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor="department"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Update Department
          </label>
          <select
            id="department"
            value={currentDepartment}
            onChange={(e) => setCurrentDepartment(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
          >
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleUpdateDepartment}
            className="mt-4 rounded bg-[#62bf63] px-4 py-2 text-white hover:bg-[#4fa14e]"
          >
            Update
          </button>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleStatusToggle}
            className={`rounded px-4 py-2 text-white ${employee.active ? 'bg-[#bf6363] hover:bg-red-700' : 'bg-[#62bf63] hover:bg-[#4fa14e]'}`}
          >
            {employee.active ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold">Departments History</h2>
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-sm text-gray-600">
                Date
              </th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">
                Department Name
              </th>
            </tr>
          </thead>
          <tbody>
            {departmentHistory.map((entry) => (
              <tr key={entry.id} className="border-t border-gray-300">
                <td className="px-4 py-2 text-sm text-gray-700">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {entry.departmentName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeDetails;
