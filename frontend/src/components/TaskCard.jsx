export default function TaskCard({ day, task }) {
    return (
      <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
        <h4>Day {day}</h4>
        <p>{task}</p>
      </div>
    );
  }
  