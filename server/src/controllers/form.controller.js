import Form from "../models/form.model.js";

const createForm = async (req, res) => {
  try {
    const { formName, fields } = req.body;
    const newForm = new Form({ formName, fields });
    await newForm.save();
    res.status(201).json(newForm);
  } catch (error) {
    res.status(500).json({ message: "Error creating form", error });
  }
};

const getForms = async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving forms", error });
  }
};

const updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedForm = await Form.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedForm);
  } catch (error) {
    res.status(500).json({ message: "Error updating form", error });
  }
};

const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;
    await Form.findByIdAndDelete(id);
    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting form", error });
  }
};

export { createForm, updateForm, deleteForm, getForms };
