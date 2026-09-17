import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { validateEmailForMrDuLow } from '../../../lib/validators';
import { ServiceType } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      email,
      name,
      serviceType = 'ON_THA_SPOT_CONSULTING',
      subjectLine = 'New QSE Umbrella Inquiry',
      projectDetails = '',
      customTeeData,
    } = req.body || {};

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Step 1: Strict Email Validation Engine (RFC 5322 + disposable blacklist)
    const emailValidation = validateEmailForMrDuLow(email);
    if (!emailValidation.isValid || !emailValidation.email) {
      return res.status(400).json({ error: emailValidation.error || 'Invalid email address' });
    }

    const cleanEmail = emailValidation.email;

    let localRecordId = '';
    let dbCommitted = false;

    // Step 2: Dual-Commit Commit #1 - PostgreSQL via Prisma (Resilient)
    try {
      const user = await prisma.user.upsert({
        where: { email: cleanEmail },
        update: { name: name || undefined },
        create: {
          email: cleanEmail,
          name: name || cleanEmail.split('@')[0],
          provider: 'credentials',
        },
      });

      // Handle Custom Tee vs Service Request
      if (customTeeData && serviceType === 'OFF_THA_GRID_TEEZ') {
        const order = await prisma.customTeeOrder.create({
          data: {
            userId: user.id,
            designTitle: customTeeData.designTitle || 'Custom QSE Streetwear',
            garmentSize: customTeeData.garmentSize || 'XL',
            fabricColor: customTeeData.fabricColor || 'Obsidian Black',
            customText: customTeeData.customText || null,
            details: projectDetails || 'Custom tee spec requested.',
          },
        });
        localRecordId = order.id;
      } else {
        const validServiceType = Object.values(ServiceType).includes(serviceType as ServiceType)
          ? (serviceType as ServiceType)
          : ServiceType.ON_THA_SPOT_CONSULTING;

        const request = await prisma.serviceRequest.create({
          data: {
            userId: user.id,
            serviceType: validServiceType,
            subjectLine: subjectLine,
            projectDetails: projectDetails || 'Initial client contact from landing page.',
          },
        });
        localRecordId = request.id;
      }
      dbCommitted = true;
    } catch (dbErr) {
      console.warn('PostgreSQL database standby/offline. Proceeding to secondary Formspree commit.', dbErr);
    }

    // Step 3: Dual-Commit Commit #2 - Formspree Dispatch to mrdulow12@gmail.com
    let formspreeSuccess = false;
    try {
      const formspreeRes = await fetch('https://formspree.io/f/xqarrpvl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _replyto: cleanEmail,
          email: cleanEmail,
          name: name || cleanEmail.split('@')[0],
          targetRecipient: 'mrdulow12@gmail.com',
          serviceType,
          subjectLine,
          projectDetails,
          prismaRecordId: localRecordId || 'PENDING_OFFLINE_SYNC',
          timestamp: new Date().toISOString(),
          system: 'Quarter Spoon Umbrella Dual-Commit Engine',
        }),
      });
      formspreeSuccess = formspreeRes.ok;
    } catch (dispatchErr) {
      console.error('Formspree secondary dispatch error:', dispatchErr);
    }

    return res.status(200).json({
      success: true,
      dbCommitted,
      localRecordId: localRecordId || 'QUEUED_FORMSPREE',
      forwarded: formspreeSuccess,
      message: 'Dual-commit pipeline processed: Formspree dispatched to mrdulow12@gmail.com and DB sync queued/committed.',
    });
  } catch (error: any) {
    console.error('Dual-commit pipeline exception:', error);
    return res.status(500).json({ error: error.message || 'Server error executing dual-commit' });
  }
}
