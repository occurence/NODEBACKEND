import express from 'express';
// import { listContacts, getContactById, addContact, removeContact, updateContact } from '../../models/contacts.js';
import { getAllContacts, getContactById, addContact, deleteContact, updateContact, updateStatusContact } from '../../controllers/contactsController.js';
import { authenticateToken } from '../../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getAllContacts);
router.get('/:contactId', authenticateToken, getContactById);
router.post('/', authenticateToken, addContact);
router.delete('/:contactId', authenticateToken, deleteContact);
router.put('/:contactId', authenticateToken, updateContact);
router.patch('/:contactId/favorite', authenticateToken, updateStatusContact);

export default router;

// router.get('/', getAllContacts);
// router.get('/:contactId', getContactById);
// router.post('/', addContact);
// router.delete('/:contactId', deleteContact);
// router.put('/:contactId', updateContact);
// router.patch('/:contactId/favorite', authenticateToken, updateStatusContact);