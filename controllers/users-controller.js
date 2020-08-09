const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Jorge Diaz',
    email: 'jorge@jorge.com',
    password: 'jorge',
  },
];

//Get Users

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

// Creating the signup

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { name, email, password, places } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      'Signing Up failed. Please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already. Please login instead.',
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image:
      'https://cdn.muenchen-p.de/image/fetch/c_lfill,h_335,w_640/http://www.muenchen.de/media/shutterstock-2016/sehenswuerdigkeiten/muenchen-panorama-hp.jpg',
    password,
    places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again.', 500);
    return next(error);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

//Creating the login

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      'Loggin in failed. Please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials. Could not log you in.',
      401
    );
    return next(error);
  }
  res.json({ message: 'Logged in!' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
