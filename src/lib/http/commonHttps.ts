// import { IAssignShift } from '@/modules/Employee/types/employees.type';
// import { getRequest, postRequest } from './requests';

// export const getAllEmployee = async () => {
//   const response = await getRequest('/select/employees?status=1');
//   return response;
// };

// export const getAllDepartment = async () => {
//   const response = await getRequest('/select/departments');
//   return response;
// };

// export const getAllOrganization = async (params?: {
//   [key: string]: string;
// }) => {
//   const response = await getRequest('/select/organizations?all=1', params);

//   return response;
// };

// export const getAllAllowances = async () => {
//   const response = await getRequest('/select/allowance');
//   return response;
// };

// export const getAllBusinessUnits = async () => {
//   const response = await getRequest('/select/business_units');
//   return response;
// };

// export const getAllLocations = async () => {
//   const response = await getRequest('/select/attend_locations');
//   return response;
// };

// export const getAllCountries = async () => {
//   const response = await getRequest('/manage/countries');
//   return response.data;
// };
// export const getAllLocationsGroup = async () => {
//   const response = await getRequest('/hr/location-group');
//   return response.data;
// };

// export const selectAllTasks = async () => {
//   const response = await getRequest('/select/tasks');
//   return response;
// };
// export const selectAllRoles = async () => {
//   const response = await getRequest('/select/roles');
//   return response;
// };
// export const getAllDestinations = async () => {
//   const response = await getRequest('/select/destination');
//   return response;
// };
// export const getAllRequestTypes = async (params?: any) => {
//   const response = await getRequest('/select/request_types', params);
//   return response;
// };

// export const getAllEmployeeTypes = async () => {
//   const response = await getRequest('/select/employment_types');
//   return response;
// };
// export const getAllJobTitles = async () => {
//   const response = await getRequest('/select/job_titles');
//   return response;
// };

// export const getAllGrades = async () => {
//   const response = await getRequest('/select/grades');
//   return response;
// };

// export const getAllCities = async () => {
//   const response = await getRequest('/select/cities');
//   return response;
// };

// export const getAllBankAccount = async (params?: { [key: string]: string }) => {
//   const response = await getRequest('select/bank_accounts', params);
//   return response;
// };

// export const getAllLoans = async () => {
//   const response = await getRequest('select/loan_types?all=1');
//   return response;
// };

// export const getAllCostTypes = async () => {
//   const response = await getRequest('select/costs_types');
//   return response;
// };
// export const getAllAssets = async () => {
//   const response = await getRequest('select/asset_types');
//   return response;
// };
// export const getAllAssetsId = async (id: string) => {
//   const response = await getRequest(`select/assets?asset_type_id=${id}`);
//   return response;
// };

// export const getAllAreas = async () => {
//   const response = await getRequest('/select/areas');
//   return response;
// };

// export const getAllEmployeeDocuments = async () => {
//   const response = await getRequest('/select/employee_document_types');
//   return response;
// };

// export const getAllAdditions = async () => {
//   const response = await getRequest('/select/additions');
//   return response;
// };

// export const getAllLeaves = async () => {
//   const response = await getRequest('/select/leave_types');
//   return response;
// };

// export const getAllPaymentMethods = async () => {
//   const response = await getRequest('/select/payment_methods');
//   return response;
// };

// export const getAllOutsourceProviders = async () => {
//   const response = await getRequest('/select/outsource_providers');
//   return response;
// };

// export const getAllShifts = async () => {
//   const response = await getRequest('/select/attend_work_shifts');
//   return response;
// };

// export const getAllWorkPlans = async () => {
//   const response = await getRequest('/select/attend_work_plans');
//   return response;
// };
// export const getAllWorkShifts = async () => {
//   const response = await getRequest('/select/work_shifts');
//   return response;
// };
// export const getAllHolidays = async () => {
//   const response = await getRequest('/select/attend_holidays');
//   return response;
// };

// export const getAllFixedHours = async () => {
//   const response = await getRequest('/select/fixed_hours');
//   return response;
// };
// export const getAllPayrollMonths = async () => {
//   const response = await getRequest('/select/payrolls');
//   return response;
// };

// export const getAllAnnualLeaves = async () => {
//   const response = await getRequest('/select/annual_leaves');
//   return response;
// };
// export const assginShiftEmployee = async (body: IAssignShift) => {
//   const response = await postRequest(`/hr/scheduler-publish`, body);
//   return response;
// }

// export const removeShiftEmployee = async (body: IAssignShift) => {
//   const response = await postRequest(`/hr/scheduler-remove`, body);
//   return response;
// }
