import Logger from "./Logger"
import Compiler from "./Compiler";
import Interpreter from "./Interpreter";

class Main
{
    static start(): void
    {
        const compiler = new Compiler();
        const result = compiler.compile(`
            uint data[] = { 0xAu, 0xBu };
uint digest[20];

int sha1digest()
{
  uint databytes = 2u;
  uint W[80];
  uint H[] = {0x67452301u,
                  0xEFCDAB89u,
                  0x98BADCFEu,
                  0x10325476u,
                  0xC3D2E1F0u};
  uint a;
  uint b;
  uint c;
  uint d;
  uint e;
  uint f = 0u;
  uint k = 0u;

  uint idx;
  uint lidx;
  uint widx;
  uint didx = 0u;

  int wcount;
  uint temp;
  uint databits = ((uint)databytes) * 8u;
  uint loopcount = (databytes + 8u) / 64u + 1u;
  uint tailbytes = 64u * loopcount - databytes;
  uint datatail[128];

  datatail[0] = 0x80u;
  datatail[tailbytes - 8u] = (uint) (databits >> 56u & 0xFFu);
  datatail[tailbytes - 7u] = (uint) (databits >> 48u & 0xFFu);
  datatail[tailbytes - 6u] = (uint) (databits >> 40u & 0xFFu);
  datatail[tailbytes - 5u] = (uint) (databits >> 32u & 0xFFu);
  datatail[tailbytes - 4u] = (uint) (databits >> 24u & 0xFFu);
  datatail[tailbytes - 3u] = (uint) (databits >> 16u & 0xFFu);
  datatail[tailbytes - 2u] = (uint) (databits >> 8u & 0xFFu);
  datatail[tailbytes - 1u] = (uint) (databits >> 0u & 0xFFu);


  for (lidx = 0u; lidx < loopcount; lidx++)
  {




    for (widx = 0u; widx <= 15u; widx++)
    {
      wcount = 24;


      while (didx < databytes && (uint)(wcount >= 0))
      {
        W[widx] += (((uint)data[didx]) << (uint)wcount);
        didx++;
        wcount -= 8;
      }

      while (wcount >= 0)
      {
        W[widx] += (((uint)datatail[didx - databytes]) << (uint)wcount);
        didx++;
        wcount -= 8;
      }
    }



     for (widx = 16u; widx <= 31u; widx++)
    {
      W[widx] = ((((W[widx - 3u] ^ W[widx - 8u] ^ W[widx - 14u] ^ W[widx - 16u])) << (1u)) | (((W[widx - 3u] ^ W[widx - 8u] ^ W[widx - 14u] ^ W[widx - 16u])) >> (32u - (1u))));
    }
    for (widx = 32u; widx <= 79u; widx++)
    {
      W[widx] = ((((W[widx - 6u] ^ W[widx - 16u] ^ W[widx - 28u] ^ W[widx - 32u])) << (2u)) | (((W[widx - 6u] ^ W[widx - 16u] ^ W[widx - 28u] ^ W[widx - 32u])) >> (32u - (2u))));
    }


    a = H[0];
    b = H[1];
    c = H[2];
    d = H[3];
    e = H[4];

    for (idx = 0u; idx <= 79u; idx++)
    {
      if (idx <= 19u)
      {
        f = (b & c) | ((~b) & d);
        k = 0x5A827999u;
      }
      else if (idx >= 20u && idx <= 39u)
      {
        f = b ^ c ^ d;
        k = 0x6ED9EBA1u;
      }
      else if (idx >= 40u && idx <= 59u)
      {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8F1BBCDCu;
      }
      else if (idx >= 60u && idx <= 79u)
      {
        f = b ^ c ^ d;
        k = 0xCA62C1D6u;
      }
      temp = (((a) << (5u)) | ((a) >> (32u - (5u)))) + f + e + k + W[idx];
      e = d;
      d = c;
      c = (((b) << (30u)) | ((b) >> (32u - (30u))));
      b = a;
      a = temp;
    }

    H[0] += a;
    H[1] += b;
    H[2] += c;
    H[3] += d;
    H[4] += e;
  }

    for (idx = 0u; idx < 5u; idx++)
    {
        digest[idx * 4u + 0u] = (uint) (H[idx] >> 24u);
        digest[idx * 4u + 1u] = (uint) (H[idx] >> 16u);
        digest[idx * 4u + 2u] = (uint) (H[idx] >> 8u);
        digest[idx * 4u + 3u] = (uint) (H[idx]);
    }

  return 0;
}

sha1digest();
        `);

        const interpreter = new Interpreter(result);
        interpreter.run();

        console.log(result);

        // @ts-ignore
        //console.log(interpreter.memoryRegions.get("var_answer"));
    }
}

Main.start();