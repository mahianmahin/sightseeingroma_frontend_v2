import { useState } from "react";

const TicketCounter = () => {
  const [count, setCount] = useState(3); // Initial ticket count

  const handleScroll = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      setCount(newValue);
    }
  };

  return (
    <div className="ticket-container">
      <h2 className="ticket-title">Ticket count</h2>
      <div className="ticket-picker">
        <input
          type="number"
          min="0"
          max="10"
          value={count}
          onChange={handleScroll}
          className="ticket-input"
        />
      </div>
    </div>
  );
};

export default TicketCounter;
