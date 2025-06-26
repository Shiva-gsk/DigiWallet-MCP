
// "use server"
// import { useSearchParams } from 'next/navigation'
// import { depositMoney } from '@/app/actions/depositMoney';
import Redirect from '@/components/payment/Redirect';
// import { Metadata } from 'next';
import { currentUser } from "@clerk/nextjs/server";
// import { redirect } from 'next/navigation';
// interface Props {
//   params: Promise<{ amount: string }>
// }

export default async function Page() {
  const user = await currentUser(); // Gets the ID of the signed-in user

//   const searchParams = useSearchParams()
 
//   const search = searchParams.get('search')

  if (!user) {
    return <div>Please sign in</div>;
  }
  // const { amount } = await params;

  try{
    // const deposit = await depositMoney(user.emailAddresses[0]?.emailAddress, Number(amount));
    // if (deposit) {
    // //   console.log("Deposit successful");
    // //   redirect("/wallet");
    return <Redirect/>

    // } else {
    //   console.log("Deposit failed");

    // }
  } catch (error) {
    console.error(error);
  }

  return (
    <div>
      
    </div>
  );
}
