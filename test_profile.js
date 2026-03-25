async function test() {
  const loginRes = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
  });
  
  let token;
  if (!loginRes.ok) {
    const regRes = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser_prof', email: 'test@example.com', password: 'password123' })
    });
    const regData = await regRes.json();
    token = regData.token;
  } else {
    const loginData = await loginRes.json();
    token = loginData.token;
  }

  console.log("Token:", token ? "Got token" : "Failed");
  
  const putRes = await fetch('http://localhost:5001/api/auth/profile', {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ bio: 'test bio' })
  });
  
  console.log("Status:", putRes.status);
  const responseData = await putRes.text();
  console.log("Response:", responseData);
}
test();
