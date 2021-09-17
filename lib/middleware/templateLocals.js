export default function(req, res, next) {
  req.templateLocals = {};
  next();
}

