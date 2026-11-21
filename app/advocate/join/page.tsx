import { redirect } from 'next/navigation';

export default function AdvocateJoinRedirect() {
  redirect('/advocate/register');
}