//switched from axios to fetch to avoid bundler issues and use a public
const API_BASE_URL = "https://official-joke-api.appspot.com";

export async function fetchRandomJoke() {
  const response = await fetch(`${API_BASE_URL}/random_joke`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  // convert API shape to our expected shape
  return { joke: `${data.setup} ${data.punchline}` };
}
