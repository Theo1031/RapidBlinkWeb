async function updateUser(username, wordSpeed, chatSummarizationLimit) {
    const response = await fetch('http://localhost:4003/api/user/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, wordSpeed, chatSummarizationLimit })
    });
  
    if (!response.ok) {
      throw new Error('User data update failed');
    }
  
    return response.json();
  }
  
  async function getUser(username) {
    const response = await fetch(`http://localhost:4003/api/user/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (!response.ok) {
      throw new Error('User data retrieval failed');
    }
  
    return response.json();
  }
  
  export { updateUser, getUser };