// /pages/api/generateTestCase.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { prompt } = req.body;

    const testCase = `Test case for: ${prompt}`;
    const testScript = `Test script for: ${prompt}`;

    res.status(200).json({ testCase, testScript });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
