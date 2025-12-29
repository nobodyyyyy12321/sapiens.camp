(async ()=>{
  try {
    const registerRes = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'autotest', email: 'autotest+1@example.com', password: 'Password123!' })
    });
    const jr = await registerRes.json();
    console.log('REGISTER_RESPONSE', JSON.stringify(jr, null, 2));
    if (jr.verificationUrl) {
      console.log('Calling verification URL:', jr.verificationUrl);
      const vres = await fetch(jr.verificationUrl);
      const jv = await vres.json();
      console.log('VERIFY_RESPONSE', JSON.stringify(jv, null, 2));
    } else {
      console.log('No verificationUrl returned (SMTP likely configured or verification email sent).');
    }
  } catch (e) {
    console.error('ERR', e);
    process.exit(1);
  }
})();
