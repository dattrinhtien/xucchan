import { getSessions } from '@/app/actions/get-sessions';
import { ComparisonContent } from './comparison-content';

export const dynamic = 'force-dynamic';

export default async function SoSanhPage() {
  const { sessions } = await getSessions(100, 0);

  return <ComparisonContent availableSessions={sessions || []} />;
}
