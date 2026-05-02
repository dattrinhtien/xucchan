import { getSessionDetail } from '@/app/actions/get-session-detail';
import { notFound } from 'next/navigation';
import { ResultContent } from './result-content';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function KetQuaPage({ params }: Props) {
  const { id } = await params;
  const { success, session, values } = await getSessionDetail(id);

  if (!success || !session) {
    notFound();
  }

  return <ResultContent session={session} values={values || []} />;
}
