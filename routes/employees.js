const uuid = require('uuid/v1')
const {
  getEmployees,
  addEmployee,
  getEmployee,
  removeEmployee,
  getPositionById,
  getLocationById,
  changeEmployee,
  getEmployeeProjects
} = require('../model.js');

module.exports = app => {
  app.get('/employees', (req, res) =>
    res.send(getEmployees())
  );

  app.post('/employees', (req, res) => {
      const {
        positionId,
        locationId,
        ...employeeData
      } = req.body;
      const id = uuid();

      addEmployee({
        ...employeeData,
        position: getPositionById(positionId),
        positionId,
        location: getLocationById(locationId),
        locationId,
        id
      });
      res.send(getEmployee(id));
  });

  app.delete('/employees/:id', (req, res) => {
      const { id } = req.params;

      removeEmployee(id);
      res.send(getEmployees());
  });

  app.put('/employees/:id', (req, res) => {
      const { id } = req.params;
      const { positionId, locationId, ...employeeData } = req.body;

      changeEmployee({ 
        ...employeeData,
        position: getPositionById(positionId),
        positionId,
        location: getLocationById(locationId),
        locationId,
        id
      });
      res.send(getEmployees());
  });

  app.get('/employees/:id', (req, res) => {
    const { id } = req.params;

    res.send(getEmployee(id));
  });

  app.get('/employees/:id/projects', (req, res) => {
    const { id } = req.params;

    res.send(getEmployeeProjects(id));
  });
}
