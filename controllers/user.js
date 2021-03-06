const User = require('../models/user');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');

exports.userById = (req, res, next, id) => {
  User.populate('following', '_id name')
    .populate('followers', '_id name')
    .findById(id)
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: 'User not Found'
        });
      }
      req.profile = user; //adds profile object in req with user info
      console.log(user);
      next();
    });
};

exports.hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.auth && req.profile._id === req.auth._id;
  if (!authorized) {
    return res.status(403).json({
      error: 'User is not authorized to preform this action'
    });
  }
};
exports.allUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    res.json(users);
  }).select('name email updated');
};

exports.getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

// exports.updateUser = (req, res, next) => {
//   let user = req.profile;
//   user = _.extend(user, req.body); // extend - mutate the source object
//   user.updated = Date.now();
//   user.save((err) => {
//     if (err) {
//       return res.status(400).json({
//         error: 'You are not authorized to perform this action'
//       });
//     }
//     user.hashed_password = undefined;
//     user.salt = undefined;
//     res.json({ user });
//   });
// };

exports.updateUser = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Photo could not be uploaded'
      });
    }
    //save user
    let user = req.profile;
    user = _.extend(user, fields);
    user.updated = Date.now();
    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }
    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    });
  });
};

exports.userPhoto = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set(('Content-Type', req.profile.photo.contentType));
    return res.send(req.profile.photo.data);
  }
  console.log(req.profile.photo.data);
  next();
};
exports.deleteUser = (req, res, next) => {
  let user = req.profile;
  user.remove((err, user) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json({ message: 'user deleted sucessfully', user });
  });
};
