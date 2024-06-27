const categories = ['Frontend', 'Backend', 'Talent', 'Full Stack'];
const states = [
    { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik'] },
    { name: 'Delhi', cities: ['New Delhi', 'Dwarka', 'Rohini', 'Saket'] },
    { name: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Mangalore', 'Hubli'] },
    { name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Salem'] },
    { name: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'] },
    { name: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'] },
    { name: 'Punjab', cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'] },
    { name: 'West Bengal', cities: ['Kolkata', 'Darjeeling', 'Siliguri', 'Howrah'] },
    { name: 'Uttar Pradesh', cities: ['Lucknow', 'Kanpur', 'Varanasi', 'Agra'] },
    { name: 'Bihar', cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'] },
];
const mockData = [
    { id: 1, businessName: 'Hitachi', category: 'Category A', address: '1st Floor, Kothrud', city: 'Pune', state: 'MH', zip: '411038' },
    { id: 2, businessName: 'Wipro', category: 'Category B', address: '3rd Floor, Dwarka', city: 'Delhi', state: 'DL', zip: '110014' },
];
let employees = mockData;
const employeeTableBody = document.querySelector('#employee-table tbody');
const employeeFormContainer = document.querySelector('#employee-form');
const employeeForm = employeeFormContainer.querySelector('form');
const addNewBtn = document.getElementById('add-new-btn');
const cancelBtn = document.getElementById('cancel-btn');
const categorySelect = document.getElementById('category');
const stateSelect = document.getElementById('state');
const citySelect = document.getElementById('city');
let editingEmployeeId = null;
function populateDropdown(selectElement, options) {
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        selectElement.appendChild(opt);
    });
}
function populateStates() {
    states.forEach(state => {
        const opt = document.createElement('option');
        opt.value = state.name;
        opt.textContent = state.name;
        stateSelect.appendChild(opt);
    });
}
function handleStateChange() {
    const selectedState = stateSelect.value;
    const state = states.find(state => state.name === selectedState);
    if (state) {
        citySelect.innerHTML = '<option value="">Select City</option>';
        populateDropdown(citySelect, state.cities);
    }
}
function renderTable() {
    employeeTableBody.innerHTML = '';
    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.businessName}</td>
            <td>${employee.category}</td>
            <td>${employee.address}</td>
            <td>${employee.city}</td>
            <td>${employee.state}</td>
            <td>${employee.zip}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-success edit-btn" data-id="${employee.id}">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${employee.id}">Delete</button>
            </td>
        `;
        employeeTableBody.appendChild(row);
    });
}
function showForm() {
    employeeFormContainer.classList.remove('d-none');
}
function hideForm() {
    employeeFormContainer.classList.add('d-none');
    employeeForm.reset();
    editingEmployeeId = null;
}
function addOrUpdateEmployee(event) {
    event.preventDefault();
    if (!validateForm())
        return;
    const formData = new FormData(employeeForm);
    const newEmployee = {
        id: editingEmployeeId || Date.now(),
        businessName: formData.get('business-name'),
        category: formData.get('category'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        zip: formData.get('zip'),
    };
    if (editingEmployeeId) {
        employees = employees.map(employee => employee.id === editingEmployeeId ? newEmployee : employee);
    }
    else {
        employees.push(newEmployee);
    }
    renderTable();
    hideForm();
}
function handleEditClick(event) {
    const target = event.target;
    if (!target.classList.contains('edit-btn'))
        return;
    const id = Number(target.dataset.id);
    const employee = employees.find(emp => emp.id === id);
    if (!employee)
        return;
    editingEmployeeId = id;
    document.getElementById('business-name').value = employee.businessName;
    document.getElementById('category').value = employee.category;
    document.getElementById('address').value = employee.address;
    document.getElementById('city').value = employee.city;
    document.getElementById('state').value = employee.state;
    document.getElementById('zip').value = employee.zip;
    showForm();
}
function handleDeleteClick(event) {
    const target = event.target;
    if (!target.classList.contains('delete-btn'))
        return;
    const id = Number(target.dataset.id);
    employees = employees.filter(employee => employee.id !== id);
    renderTable();
}
function validateForm() {
    const businessName = document.getElementById('business-name').value.trim();
    const category = document.getElementById('category').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const zip = document.getElementById('zip').value.trim();
    const businessNameRegex = /^[A-Za-z\s]+$/;
    if (!businessName || !businessNameRegex.test(businessName) || businessName.length > 15) {
        alert('Please provide a valid business name within 1 to 15 characters. Only alphabets and spaces are allowed.');
        return false;
    }
    const addressRegex = /[a-zA-Z]+/;
    if (!address || !addressRegex.test(address) || address.length > 40) {
        alert('Please provide a valid address within 1 to 40 characters. Only numbers are not allowed.');
        return false;
    }
    const zipRegex = /^\d{6}$/;
    if (!zip || !zipRegex.test(zip)) {
        alert('Please provide a valid 6-digit zip code.');
        return false;
    }
    return true;
}
addNewBtn.addEventListener('click', showForm);
cancelBtn.addEventListener('click', hideForm);
employeeForm.addEventListener('submit', addOrUpdateEmployee);
employeeTableBody.addEventListener('click', handleEditClick);
employeeTableBody.addEventListener('click', handleDeleteClick);
stateSelect.addEventListener('change', handleStateChange);
populateDropdown(categorySelect, categories);
populateStates();
renderTable();
