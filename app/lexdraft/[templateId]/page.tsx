import React from 'react';
import LexDraftGeneratorClient from './LexDraftGeneratorClient';

export default async function LexDraftTemplatePage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const resolvedParams = await params;
  return <LexDraftGeneratorClient templateId={resolvedParams.templateId} />;
}