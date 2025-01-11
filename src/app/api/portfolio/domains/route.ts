// app/api/portfolio/domains/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { TldParser } from "@onsol/tldparser";

// app/api/portfolio/domains/route.ts
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const account = searchParams.get('account');
    
    if (!account) {
      return NextResponse.json({ domains: [] });
    }

    const connection = new Connection(
      process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com'
    );

    try {
      const pubkey = new PublicKey(account);
      const parser = new TldParser(connection);
      const domains = await parser.getParsedAllUserDomains(pubkey);
      
      return NextResponse.json({
        domains: domains?.map(domain => domain.domain) || []
      });
    } catch (error) {
      console.error('Domain parsing error:', error);
      // Return empty array instead of error
      return NextResponse.json({ domains: [] });
    }
  } catch (error: any) {
    console.error('Domains API error:', error);
    // Return empty array instead of error
    return NextResponse.json({ domains: [] });
  }
}