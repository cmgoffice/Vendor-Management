import Workspace from './workspace';
import {getChatGPTUser,chatGPTSignInPath,chatGPTSignOutPath} from './chatgpt-auth';
export const dynamic='force-dynamic';
export default async function Page(){const user=await getChatGPTUser();return <Workspace user={user?{name:user.displayName,email:user.email}:null} signIn={chatGPTSignInPath('/')} signOut={chatGPTSignOutPath('/')}/>;}
