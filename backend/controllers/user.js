exports.createUser = (req, res) => {
    console.log(req.body);
  res.json({user:req.body})
};
