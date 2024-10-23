import { Contact } from '../models/contactsModel.js';
import { contactValidation, favoriteValidation } from '../validation/validation.js';

// import { listContacts, getContactById, addContact, removeContact, updateContact } from '../models/contacts.js';

const getAllContacts = async (_req, res, next) => {
    try {
      const result = await Contact.find();// const result = await listContacts();
      res.status(200).json(result);
    } catch (error) {next(error);}
  }

const getContactById = async (req, res, next) => {
    try {
      const { contactId } = req.params;// req.params.contactId
      const result = await Contact.findById(contactId);// const result = await getContactById(contactId);
  
      if(!result) {res.status(404).json({ message: 'Contact ID Not Found' });}
      res.status(200).json(result);
    } catch (error) {next(error);}
  }

const addContact = async (req, res, next) => {
    try {
      const { error } = contactValidation.validate(req.body);
      if(error) {res.status(400).json({ message: 'Missing required name field' });}

      const result = await Contact.create(req.body);// const result = await addContact(req.body);
      res.status(201).json(result);
    } catch (error) {next(error);}
  }

const deleteContact = async (req, res, next) => {
    try {
      const { contactId } = req.params;// req.params.contactId
      const result = await Contact.findByIdAndDelete(contactId);// const result = await removeContact(contactId);
      if(!result) {res.status(404).json({ message: 'Contact deleted' });}
      res.status(200).json(result);
    } catch (error) {next(error);}
  }

const updateContact = async (req, res, next) => {
    try {
      const { error } = contactValidation.validate(req.body);
      if(error) {res.status(400).json({ message: 'Missing field/s' });}

      const { contactId } = req.params;// req.params.contactId
      const result = await Contact.findByIdAndUpdate(contactId, req.body);// const result = await updateContact(contactId, req.body);
      if(!result) {res.status(404).json({ message: 'Not found' });}
      res.status(200).json(result);
    } catch (error) {next(error);}
  }

const updateStatusContact = async (req, res) => {
    try {
      const { error } = favoriteValidation.validate(req.body);
      if(error) {res.status(400).json({ message: 'Missing favorite field' });}
      
      const { contactId } = req.params;// req.params.contactId
      const result = await Contact.findByIdAndUpdate(contactId, req.body, {favorite: true});// const result = await updateContact(contactId, req.body);
      if(!result) {res.status(404).json({ message: 'Not found' });}
      res.status(200).json(result);
    // } catch (error) {next(error);}
    } catch (error) {res.status(500).json({ message: error.message });}
}
export { getAllContacts, getContactById, addContact, deleteContact, updateContact, updateStatusContact };