import { Router, Request, Response } from 'express';
import { dbPromise } from '../db';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;
  
  if (!email && !phoneNumber) {
    return res.status(400).json({ error: 'Email or phoneNumber is required' });
  }

  const db = await dbPromise;

  // Fetch existing contacts
  const existingContacts = await db.all(`
    SELECT * FROM contacts
    WHERE email = ? OR phoneNumber = ?
  `, [email, phoneNumber]);

  let primaryContact = existingContacts.find(contact => contact.linkPrecedence === 'primary');
  let secondaryContacts = existingContacts.filter(contact => contact.linkPrecedence === 'secondary');

  if (!primaryContact && existingContacts.length > 0) {
    primaryContact = existingContacts[0];
    secondaryContacts = existingContacts.slice(1);
  }

  if (!primaryContact) {
    // If there is no existing contact, create a new primary contact
    const result = await db.run(`
      INSERT INTO contacts (email, phoneNumber, linkPrecedence)
      VALUES (?, ?, 'primary')
    `, [email, phoneNumber]);

    primaryContact = {
      id: result.lastID,
      email,
      phoneNumber,
      linkPrecedence: 'primary',
      linkedId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null
    };
  } else {
    // Check if we need to create a new secondary contact
    const hasNewInfo = (email && email !== primaryContact.email) || (phoneNumber && phoneNumber !== primaryContact.phoneNumber);
    if (hasNewInfo) {
      const result = await db.run(`
        INSERT INTO contacts (email, phoneNumber, linkPrecedence, linkedId)
        VALUES (?, ?, 'secondary', ?)
      `, [email, phoneNumber, primaryContact.id]);

      secondaryContacts.push({
        id: result.lastID,
        email,
        phoneNumber,
        linkPrecedence: 'secondary',
        linkedId: primaryContact.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null
      });
    }
  }

  const response = {
    contact: {
      primaryContatctId: primaryContact.id,
      emails: [primaryContact.email, ...secondaryContacts.map(contact => contact.email)].filter(Boolean),
      phoneNumbers: [primaryContact.phoneNumber, ...secondaryContacts.map(contact => contact.phoneNumber)].filter(Boolean),
      secondaryContactIds: secondaryContacts.map(contact => contact.id)
    }
  };

  res.json(response);
});

export default router;
