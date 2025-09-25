// This page is not used anymore since the user is redirected
// to the pharmacy page directly after login.
// You can repurposed this page in the future for a different purpose if you want.
import { redirect } from 'next/navigation'

export default async function Home({
    params: { lang },
  }: {
    params: { lang: string };
  }) {
    redirect(`/${lang}/pharmacy`)
  }