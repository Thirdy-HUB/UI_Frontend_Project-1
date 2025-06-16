import React, { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    Internet_Access_at_Home: "Yes",
    Parent_Education_Level: "None",
    Stress_Level: 3,
    Sleep_Hours_per_Night_Entier: 7,
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          Stress_Level: parseInt(formData.Stress_Level),
          Sleep_Hours_per_Night_Entier: parseInt(formData.Sleep_Hours_per_Night_Entier),
        }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Failed to connect to the backend. Is Flask running?");
    }
  };

  return (
    <div className="app-container">
      <h2>Academic Result Predictor</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Internet Access at Home:
          <select name="Internet_Access_at_Home" onChange={handleChange} value={formData.Internet_Access_at_Home}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>

        <label>
          Parent Education Level:
          <select name="Parent_Education_Level" onChange={handleChange} value={formData.Parent_Education_Level}>
            <option value="None">None</option>
            <option value="HighSchool">High School</option>
            <option value="College">College</option>
          </select>
        </label>

        <label>
          Stress Level (1-5):
          <input type="number" name="Stress_Level" min="1" max="5" value={formData.Stress_Level} onChange={handleChange} />
        </label>

        <label>
          Sleep Hours per Night:
          <input type="number" name="Sleep_Hours_per_Night_Entier" min="0" max="24" value={formData.Sleep_Hours_per_Night_Entier} onChange={handleChange} />
        </label>

        <button type="submit">Predict</button>
      </form>

      {error && <div className="error-box">❌ {error}</div>}

      {result && (
        <div className="result-box">
          <h3>🎓 Prediction Result</h3>
          <p><strong>Grade:</strong> {result.Estimated_Grade}</p>
          <p><strong>Probability Passed:</strong> {result.Probability_Passed}</p>
          <p><strong>Result:</strong> {result.Result}</p>
          <p><strong>Sleep Advice:</strong> {result.Recommended_Sleep_Hours}</p>
        </div>
      )}
    </div>
  );
}

export default App;
