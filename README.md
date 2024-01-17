# Shift Management Tool

## Server

- [Live demo](https://calm-pear-crab-fez.cyclic.app/)
- [Repository](https://github.com/LinhNguyenLe2109/ShiftManagementServer)

## Project Description

The Shift Management Tool is a web application designed with the purpose of streamlining managing shifts for employees. It provides an interface for managers to assign shifts to employees, while also allowing for shift reassignment if an employee is unable to go through their shift, managers will have access to performance analytics for each employee. The app also incorporates email notifications to keep everyone informed about shift assignments and changes.

### Key Features:

- **User Roles:**

  - **Manager:** Responsible for assigning and managing shifts, accessing performance analytics, and adjusting employee performance scores via shift reports.
  - **Employee:** Can view and manage their assigned shifts, and pick up available shifts.
  - **Administrator:** Has overall system control and management privileges.

- **Performance Analytics:**

  - Utilizes AI for performance analysis, presenting graphical insights to managers about the performance of all employees under their management.

- **Shift Adjustment Report:**
  - Managers can adjust employee performance scores using a report form associated with each employee's shift.

## Technology Stack

### Web App Front-End

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shuffle/Flowbite](https://flowbite.com)

### Web App Server

- [Express.js](https://expressjs.com/)
- [Firebase](https://firebase.google.com/)

### AI Data Analysis

- [Django](https://www.djangoproject.com/)
- [Kaggle](https://www.kaggle.com/)

### Testing Libraries

- [Jest](https://jestjs.io/)
- [Cypress](https://www.cypress.io/)

## Color Theme

<a ref="https://coolors.co/visualizer/1a1a1d-4e4e50-6f2232-950740-c3073f"><img src="https://github.com/leoschwartz/ShiftManagementTool/assets/74940884/458f0248-c5b2-4399-a5d1-d8db1f06a191" alt="Option 3" width="400" height="300"></a>

## Acceptance Criteria

- Shifts can be assigned to employees.
- Shift reassignment functionality is implemented.
- Email notifications are sent for shift assignments and changes.
- User roles (Manager, Employee, Administrator) are implemented.
- Performance analytics use AI for analysis.
- Managers can adjust employee performance scores using a report form.
- Web app front-end is built using React, Tailwind CSS, and Shuffle/Flowbite.
- Web app server is built using Express.js and Firebase for the database.
- AI data analysis is done using Django and Kaggle for the dataset.
- Testing is implemented using Jest and Cypress.
