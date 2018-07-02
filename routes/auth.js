const { sha1 } = require('../utils');
const uuid = require('uuid');
const moment = require('moment');
const { addToken, getEmployees } = require('../model');

module.exports = app => {
  app.post('/auth', (req, res) => {
    const { body: authData } = req;

    if (!authData || !authData.password || !authData.email) {
      res.status(401);
      res.send({ error: 'Please, specify email & password' });
      return;
    }

    const { password, email } = authData;

    const employees = getEmployees();
    const foundUser = employees
      .find(employee => employee.email === email);

    if (!foundUser) {
      res.status(401);
      res.send({ error: 'User not found' });
      return;
    }

    const doesPasswordEqual = sha1(String(password))
      === sha1(String(foundUser.password))

    if (!doesPasswordEqual) {
      res.status(401);
      res.send({ error: 'Wrong password' });
      return;
    }

    const token = uuid(foundUser.email);
    const expirationDate = moment().add('days', 7).unix();

    addToken({ token, expirationDate, userId: foundUser.id });

    res.status(200);
    res.send({
      token,
      user: foundUser
    });
    return;
  });

}
