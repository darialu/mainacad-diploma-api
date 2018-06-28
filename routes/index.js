const setEmployeesRequests = require('./employees');
const setProjectsRequests = require('./projects');
const setAuthRequests = require('./auth');
const setTasksRequests = require('./tasks');

module.exports = app => {
  setAuthRequests(app);
  setTasksRequests(app);
  setEmployeesRequests(app);
  setProjectsRequests(app);
}
