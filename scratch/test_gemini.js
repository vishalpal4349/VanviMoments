const key = 'AQ.Ab8RN6LWFxLtr7MAmRQMqRlte-K-TpGDaCqCa-p9iodCpWOOBg';

async function main() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: 'You are Vanvi AI, the intelligent, warm AI companion for VanviMoments with full common sense. Answer this user naturally: "Namaste! Aaj mera mood thoda off hai, kuch accha bolo na please?"'
        }]
      }]
    })
  });
  console.log('HTTP Status:', res.status);
  const data = await res.json();
  if (data.candidates && data.candidates[0]) {
    console.log('Vanvi AI Reply:\n', data.candidates[0].content.parts[0].text);
  } else {
    console.log('Error/Data:', JSON.stringify(data, null, 2));
  }
}

main();

