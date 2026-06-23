import { useState } from "react";
import { searchMovies } from "../utils/tmdb";

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;

function MoodMatcher({ onResult }) {
  const [moodText, setMoodText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!moodText.trim()) return;

    setLoading(true);
    setError("");

    try {
      // ask groq for a movie title based on mood
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: `Suggest ONE movie based on this mood: "${moodText}". Return ONLY the movie title as a plaintext string, nothing else, no quotes, no explanation.`,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!groqRes.ok) {
        throw new Error("groq request failed");
      }

      const groqData = await groqRes.json();
      const rawTitle = groqData.choices[0].message.content;
      const cleanTitle = rawTitle.trim().replace(/^["']|["']$/g, "");

      // hand that title off to tmdb search
      const tmdbData = await searchMovies(cleanTitle);

      if (tmdbData.results && tmdbData.results.length > 0) {
        onResult(tmdbData.results[0], cleanTitle);
      } else {
        setError(`Got "${cleanTitle}" from AI but couldn't find it on TMDB`);
      }
    } catch (err) {
      console.log("mood matcher error", err);
      setError("Something went wrong matching your mood. Try again?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mood-matcher">
      <h3>Mood Matcher</h3>
      <p className="mood-subtitle">Tell us how you're feeling, get a movie pick</p>
      <form onSubmit={handleSubmit} className="mood-form">
        <input
          type="text"
          value={moodText}
          onChange={(e) => setMoodText(e.target.value)}
          placeholder="e.g. Feeling down, want to watch a romance movie"
          className="mood-input"
        />
        <button type="submit" disabled={loading} className="mood-submit-btn">
          {loading ? "Thinking..." : "Find My Movie"}
        </button>
      </form>
      {error && <p className="mood-error">{error}</p>}
    </div>
  );
}

export default MoodMatcher;
