import {env} from 'cloudflare:workers';
export function database():D1Database{if(!env.DB)throw new Error('Vendor database unavailable');return env.DB;}
