/* --------------------
Model to abstract local endpoints
---------------------*/

const constants = {
  apiUrl: 'http://localhost:3001'
};

class Api {
  static async execute(endpoint, options = {}) {
    const response = await fetch(`${constants.apiUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    });
    if (response.status >= 200 && response.status < 300) {
      return await response.json();
    } else {
      throw new Error(`Error fetching: ${endpoint}.`);
    }
  }
  static async addQuote(user, speaker, content) {
    return await Api.execute(
      `/api/user/${user._id}/speakers/${speaker._id}/quotes`,
      {
        method: 'POST',
        body: JSON.stringify({quote: content})
      }
    );
  }
  static async deleteQuote(user, speaker, quote) {
    return await Api.execute(
      `/api/user/${user._id}` +
      `/speakers/${speaker._id}` +
      `/quotes/${quote.id}`,
      {
        method: 'DELETE'
      }
    )
  }
  static async fetchQuotes(user, speaker) {
    return await Api.execute(
      `/api/user/${user._id}/speakers/${speaker._id}/quotes`,
    );
  }
  static async calculatePersonality(user, speaker) {
    return await Api.execute(
      `/api/user/${user._id}` +
      `/speakers/${speaker._id}` +
      `/personality`,
      {
        method: 'POST'
      }
    );
  }
  static async fetchPersonality(user, speaker) {
    return await Api.execute(
      `/api/user/${user._id}` +
      `/speakers/${speaker._id}` +
      `/personality`
    );
  }
}

export {Api as default};