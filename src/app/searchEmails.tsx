import { Email } from './types';


export function searchEmails({ query, has_attachments }: { query: string; has_attachments: boolean }): Email[] {
  
  const emails = [
    {
      id: '1',
      subject: 'Meeting Reminder',
      date: '2024-06-18',
      has_attachments: true,
    },
    {
      id: '2',
      subject: 'Project Update',
      date: '2024-06-17',
      has_attachments: false,
    },
    {
      id: '3',
      subject: 'Invoice Attached',
      date: '2024-06-16',
      has_attachments: true,
    },
  ];

 
  return emails.filter(email => {
    const matchesQuery = email.subject.toLowerCase().includes(query.toLowerCase());
    const matchesAttachment = has_attachments ? email.has_attachments : true;
    return matchesQuery && matchesAttachment;
  });
}