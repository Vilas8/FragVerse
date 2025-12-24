import { getAuthUser } from '@/lib/actions';
import { redirect } from 'next/navigation';

export default async function Index() {
  const user = await getAuthUser();
  
  if (user) {
    redirect('/home');
  } else {
    redirect('/sign-in');
  }
}
