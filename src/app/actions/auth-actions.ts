// app/actions/auth-actions.ts
'use server';

import { clearAgentData } from '@/utils/agentCookies';

export async function logout() {
    await clearAgentData();
    //redirect('/login'); // Redirect to login page after logout
}