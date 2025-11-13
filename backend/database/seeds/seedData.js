module.exports = {
  users: [
    {
      name: 'Alice Admin',
      email: 'admin@example.com',
      password: 'Password123!',
      role: 'admin'
    },
    {
      name: 'Sam Support',
      email: 'support@example.com',
      password: 'Password123!',
      role: 'support'
    },
    {
      name: 'Uma User',
      email: 'user@example.com',
      password: 'Password123!',
      role: 'user'
    }
  ],
  categories: [
    { name: 'Software', description: 'Issues with software applications and services.' },
    { name: 'Hardware', description: 'Physical device requests or problems.' },
    { name: 'Network', description: 'Connectivity, VPN, and internet issues.' }
  ],
  tickets: [
    {
      title: 'Can’t install VPN client',
      description: 'Installer fails midway with unknown error.',
      priority: 'high',
      status: 'open',
      attachment: null,
      categoryName: 'Network',
      ownerEmail: 'user@example.com',
      assignedEmail: 'support@example.com'
    },
    {
      title: 'Laptop battery drains fast',
      description: 'New battery still loses charge within an hour.',
      priority: 'medium',
      status: 'in_progress',
      attachment: null,
      categoryName: 'Hardware',
      ownerEmail: 'user@example.com',
      assignedEmail: 'support@example.com'
    },
    {
      title: 'Request new IDE license',
      description: 'Need IntelliJ Ultimate license renewal.',
      priority: 'low',
      status: 'resolved',
      attachment: null,
      categoryName: 'Software',
      ownerEmail: 'user@example.com',
      assignedEmail: 'support@example.com'
    },
    {
      title: 'VPN disconnects frequently',
      description: 'VPN drops every hour while working remotely.',
      priority: 'high',
      status: 'in_progress',
      attachment: null,
      categoryName: 'Network',
      ownerEmail: 'user@example.com',
      assignedEmail: 'support@example.com'
    },
    {
      title: 'New monitor setup',
      description: 'Need a dual-monitor configuration at office.',
      priority: 'medium',
      status: 'open',
      attachment: null,
      categoryName: 'Hardware',
      ownerEmail: 'user@example.com',
      assignedEmail: null
    },
    {
      title: 'Email client stuck syncing',
      description: 'Outlook continuously syncs and never completes.',
      priority: 'medium',
      status: 'closed',
      attachment: null,
      categoryName: 'Software',
      ownerEmail: 'user@example.com',
      assignedEmail: 'support@example.com'
    }
  ],
  comments: [
    {
      ticketTitle: 'Can’t install VPN client',
      authorEmail: 'support@example.com',
      body: 'Investigating installer logs, will update shortly.',
      parentBody: null
    },
    {
      ticketTitle: 'Can’t install VPN client',
      authorEmail: 'user@example.com',
      body: 'Thanks! Let me know if you need more info.',
      parentBody: 'Investigating installer logs, will update shortly.'
    },
    {
      ticketTitle: 'Laptop battery drains fast',
      authorEmail: 'support@example.com',
      body: 'Ordered replacement battery; expect delivery tomorrow.',
      parentBody: null
    }
  ]
};

