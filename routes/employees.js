const uuid = require('uuid/v1')
const {
  getEmployees,
  addEmployee,
  getEmployee,
  removeEmployee,
  getPositionById,
  changeEmployee,
  getEmployeeProjects
} = require('../model.js');

module.exports = app => {
  app.get('/employees', (req, res) =>
    res.send(getEmployees());
  );

  app.post('/employees', (req, res) => {
      const { positionId, ...employeeData } = req.body;
      const id = uuid();

      addEmployee({
        ...employeeData,
        position: getPositionById(positionId),
        id
      });
      res.send(getEmployee(id));
  });

  app.delete('/employees/:id', (req, res) => {
      const { id } = req.params;

      removeEmployee(Number(id));
      res.send(getEmployees());
  });

  app.put('/employees/:id', (req, res) => {
      const { id } = req.params;
      const { body: employee } = req;

      changeEmployee({ ...employee, id: Number(id) });
      res.send(getEmployees());
  });

  app.get('/employees/:id', (req, res) => {
    const { id } = req.params;

    res.send(getEmployee(Number(id)));
  });

  app.get('/employees/:id/projects', (req, res) => {
    const { id } = req.params;

    res.send(getEmployeeProjects(Number(id)));
  });
}
