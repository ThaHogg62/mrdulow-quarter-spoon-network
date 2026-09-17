import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    attemptedEmail = 'UNAUTHENTICATED_GUEST',
    targetPath = '/admin',
    ip = 'unknown',
    userAgent = 'unknown',
    timestamp = new Date().toISOString(),
    breachType = 'UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT',
  } = req.body || {};

  console.warn(
    `[ADMIN SECURITY ALERT] Unauthorized entry attempt on ${targetPath} by ${attemptedEmail} (IP: ${ip}) at ${timestamp}`
  );

  let forwarded = false;
  try {
    const alertRes = await fetch('https://formspree.io/f/xqarrpvl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        alertType: 'CRITICAL_SECURITY_BREACH_ALERT',
        breachType,
        targetRecipient: 'mrdulow12@gmail.com',
        attemptedEmail,
        targetPath,
        ip,
        userAgent,
        timestamp,
        securityStatus: 'HTTP_403_FORBIDDEN_ENFORCED',
        system: 'Quarter Spoon Umbrella Edge Security Node',
      }),
    });
    forwarded = alertRes.ok;
  } catch (err) {
    console.error('Failed to forward security alert to Formspree:', err);
  }

  return res.status(200).json({
    success: true,
    alertLogged: true,
    forwardedToMrDuLow: forwarded,
    recipient: 'mrdulow12@gmail.com',
  });
}
