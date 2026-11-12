import React, { Suspense } from 'react';
import LexDraftGeneratorClient from './LexDraftGeneratorClient';

async function LexDraftTemplateContent({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const resolvedParams = await params;
  return <LexDraftGeneratorClient templateId={resolvedParams.templateId} />;
}

export default function LexDraftTemplatePage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-bold text-slate-500">
          Loading LexDraft Legal Form...
        </div>
      }
    >
      <LexDraftTemplateContent params={params} />
    </Suspense>
  );
}