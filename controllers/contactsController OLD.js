import { Contact } from '../models/contactModel.js';

import { listContacts, getContactById, addContact, removeContact, updateContact } from '../models/contacts.js';

const getAllContacts = async (_req, res, next) => {
    try {
      const result = await listContacts();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

const getContactById = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const result = await getContactById(contactId);
  
      if(!result) {res.status(404).json({ message: 'Not found' });}
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

const addContact = async (req, res, next) => {
    const { error } = contactValidation.validate(req.body);
    if(error) {res.status(400).json({ message: 'Missing required field' });}
    try {
      const result = await addContact(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

const deleteContact = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const result = await removeContact(contactId);
      if(!result) {res.status(404).json({ message: 'Not found' });}
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

const updateContact = async (req, res, next) => {
    try {
      const result = await updateContact(req.params.contactId, req.body);
      if(!result) {res.status(404).json({ message: 'Not found' });}
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }


export { getAllContacts, getContactById, addContact, deleteContact, updateContact };