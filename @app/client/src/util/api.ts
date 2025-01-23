export const fetchEmployees = async () => {
  try {
    const response = await fetch('/api/employees');
    return await response.json();
  } catch (error) {
    console.error('Error fetching employees:', error);
    return error;
  }
};

export const fetchDeparments = async () => {
  try {
    const departmentsResponse = await fetch('/api/departments');
    return await departmentsResponse.json();
  } catch (error) {
    console.error('Error fetching departments:', error);
    return error;
  }
};

export const updateEmployeeStatus = async (id: any, updatedStatus: any) => {
  try {
    const response = await fetch(`/api/employees/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ active: updatedStatus })
    });
    if (!response.ok) {
      throw new Error('Failed to toggle employee status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error toggling employee status:', error);
    throw error;
  }
};

export const addEmployee = async (employeeData: {
  firstName: any;
  lastName: any;
  email: any;
  phone: any;
  hireDate: any;
  departmentId: any;
}) => {
  try {
    const response = await fetch('/api/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        contactInfo: {
          email: employeeData.email,
          phone: employeeData.phone
        },
        hireDate: employeeData.hireDate,
        currentDepartmentId: employeeData.departmentId
      })
    });
    if (!response.ok) {
      throw new Error('Failed to add employee');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding employee:', error);
    throw error;
  }
};

export const addDepartment = async (departmentData: { name: any }) => {
  try {
    const response = await fetch('/api/departments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: departmentData.name })
    });
    if (!response.ok) {
      throw new Error('Failed to add department');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding department:', error);
    throw error;
  }
};

export const fetchEmployeeDetails = async (id: any) => {
  try {
    const response = await fetch(`/api/employees/${id}`);
    if (!response.ok) {
      throw new Error('Employee not found');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching employee details:', error);
    throw error;
  }
};

export const fetchDepartmentHistory = async (id: any) => {
  try {
    const response = await fetch(`/api/departments-history/${id}`);
    if (!response.ok) {
      throw new Error('Department history not found');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching department history:', error);
    throw error;
  }
};

export const updateEmployeeDepartment = async (id: any, departmentId: any) => {
  try {
    const response = await fetch(`/api/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentDepartmentId: departmentId
      })
    });
    if (!response.ok) {
      throw new Error('Failed to update department');
    }
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
};
