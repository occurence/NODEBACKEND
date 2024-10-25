import express from 'express';
// import { listContacts, getContactById, addContact, removeContact, updateContact } from '../../models/contacts.js';
import { getAllContacts, getContactById, addContact, deleteContact, updateContact, updateStatusContact } from '../../controllers/contactsController.js';
import { authenticateToken } from '../../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/contacts:
 *  get:
 *      summary: Retrieve a list of contacts
 *      tags: [Contacts]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Successfully retrieved list of contacts
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Contact'
 *          400:
 *              description: Unauthorized
 */

router.get('/', authenticateToken, getAllContacts);
router.get('/:contactId', authenticateToken, getContactById);
router.post('/', authenticateToken, addContact);
router.delete('/:contactId', authenticateToken, deleteContact);
router.put('/:contactId', authenticateToken, updateContact);
router.patch('/:contactId/favorite', authenticateToken, updateStatusContact);

export default router;