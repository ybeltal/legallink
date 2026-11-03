import { LEGAL_ARTICLES } from '@/lib/legaltalk-data';
import LegalTalkArticleClient from './LegalTalkArticleClient';

// 1. Tell Next.js at build time all 5 static article routes to generate
export function generateStaticParams() {
  return LEGAL_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

// 2. Server Page resolving the dynamic slug parameter
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <LegalTalkArticleClient slug={slug} />;
}