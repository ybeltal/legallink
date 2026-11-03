import { LEXDRAFT_TEMPLATES } from '@/lib/lexdraft-templates';
import LexDraftGeneratorClient from './LexDraftGeneratorClient';

export function generateStaticParams() {
  return LEXDRAFT_TEMPLATES.map((tpl) => ({
    templateId: tpl.id,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  return <LexDraftGeneratorClient templateId={templateId} />;
}