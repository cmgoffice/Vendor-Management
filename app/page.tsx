import Workspace from './workspace';
import {getChatGPTUser,chatGPTSignInPath,chatGPTSignOutPath} from './chatgpt-auth';
export const dynamic='force-dynamic';
type PageProps={searchParams?:Promise<{flow?:string}>};
export default async function Page({searchParams}:PageProps){
 const [user,params]=await Promise.all([getChatGPTUser(),searchParams]);
 const initialAuthMode=user&&params?.flow==='register'?'register':'login';
 return <Workspace user={user?{name:user.displayName,email:user.email}:null} signIn={chatGPTSignInPath('/')} registerSignIn={chatGPTSignInPath('/?flow=register')} signOut={chatGPTSignOutPath('/')} initialAuthMode={initialAuthMode}/>;
}