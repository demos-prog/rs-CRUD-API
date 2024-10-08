describe('testing users:', () => {
  test('Should return 200 OK', async () => {
    const res = await fetch('http://localhost:5000')
    expect(res.ok).toBeTruthy();
  })

  test('Should return an array', async () => {
    const res = await fetch('http://localhost:5000/api/users')
    expect(Array.isArray(await res.json())).toBeTruthy();
  })

  test('Should create a new user and retunt it', async () => {
    const res = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      body: JSON.stringify({
        username: 'SomeName',
        age: 123,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const newUser = await res.json();
    expect(newUser.username).toBe('SomeName');
  })

  test('Should get a user by ID', async () => {
    const res = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      body: JSON.stringify({
        username: 'SomeName',
        age: 123,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const newUser = await res.json();

    const res2 = await fetch(`http://localhost:5000/api/users/${newUser.id}`);
    const user = await res2.json();

    expect(user.username).toBe('SomeName');
  })

  test('Should update a created user', async () => {
    const res = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      body: JSON.stringify({
        username: 'SomeName',
        age: 123,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const newUser = await res.json();

    const res2 = await fetch(`http://localhost:5000/api/users/${newUser.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        username: 'DifferentName',
        age: 123,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const user = await res2.json();

    expect(user.username).toBe('DifferentName');
  })

  test('Should delete a created user', async () => {
    const res = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      body: JSON.stringify({
        username: 'SomeName',
        age: 123,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const newUser = await res.json();

    const res2 = await fetch(`http://localhost:5000/api/users/${newUser.id}`, {
      method: 'DELETE',
    });

    expect(res2.ok).toBeTruthy();
  })

  test('Should try to get a deleted user', async () => {
    const res = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      body: JSON.stringify({
        username: 'SomeName',
        age: 123,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (res.ok) {
      const newUser = await res.json();
      const res2 = await fetch(`http://localhost:5000/api/users/${newUser.id}`, {
        method: 'DELETE',
      });
      if (res2.ok) {
        const res3 = await fetch(`http://localhost:5000/api/users/${newUser.id}`);
        expect(res3.ok).toBeFalsy();
      }
    }
  })
})