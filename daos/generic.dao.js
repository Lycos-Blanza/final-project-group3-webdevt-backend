// simple generic DAO helpers
const create = async (Model, data) => {
  const doc = new Model(data);
  return doc.save();
};

const findById = async (Model, id) => Model.findById(id);

const find = async (Model, filter = {}, options = {}) => Model.find(filter, null, options);

const findOne = async (Model, filter = {}) => Model.findOne(filter);

const updateById = async (Model, id, update) => Model.findByIdAndUpdate(id, update, { new: true });

const removeById = async (Model, id) => Model.findByIdAndDelete(id);

module.exports = { create, findById, find, findOne, updateById, removeById };
