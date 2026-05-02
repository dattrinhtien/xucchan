import { saveSession } from './src/app/actions/save-session';

async function run() {
  const input = {
    meridians: [
      { meridianCode: 'TTr', leftTemp: 32, rightTemp: 32 },
      { meridianCode: 'Tam', leftTemp: 32, rightTemp: 32 },
      { meridianCode: '3Tieu', leftTemp: 32, rightTemp: 32 },
      { meridianCode: 'TBL', leftTemp: 32, rightTemp: 32 },
      { meridianCode: 'DTr', leftTemp: 32, rightTemp: 32 },
      { meridianCode: 'Phe', leftTemp: 32, rightTemp: 32 },
      { meridianCode: 'BQ', leftTemp: 32, rightTemp: 32 },
      { meridianCode: 'Than', leftTemp: 32, rightTemp: 32 },
      { meridianCode: 'Dom', leftTemp: 32, rightTemp: 32 },
      { meridianCode: 'Vi', leftTemp: 32, rightTemp: 32 },
      { meridianCode: 'Can', leftTemp: 32, rightTemp: 32 },
      { meridianCode: 'Ty', leftTemp: 32, rightTemp: 32 },
    ],
    measuredAt: new Date().toISOString()
  };
  const res = await saveSession(input as any);
  console.log(res);
}

run();
