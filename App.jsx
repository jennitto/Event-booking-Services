import React, { useState, useEffect, useContext, createContext } from "react";
import { motion } from "framer-motion";
import "./App.css"; // custom styles

// Context for services and bookings
const ServiceContext = createContext();

// Mock data
const mockServices = [
  { id: 1, name: "DJ Rockstar", price: 15000, rating: 4.5, category: "DJ", location: "Chennai", availability: ["2025-08-23", "2025-08-30"], reviews: ["Great DJ!", "Loved the vibes"] },
  { id: 2, name: "PhotoClick Studio", price: 20000, rating: 4.8, category: "Photographer", location: "Bangalore", availability: ["2025-08-25", "2025-08-28"], reviews: ["Professional work", "Excellent quality"] },
  { id: 3, name: "Delight Caterers", price: 18000, rating: 4.3, category: "Caterer", location: "Hyderabad", availability: ["2025-08-22", "2025-08-29"], reviews: ["Delicious food", "Timely service"] },
];

// Debounce function
const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
};

export default function App() {
  const [services, setServices] = useState(mockServices);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setServices(
      mockServices.filter((s) =>
        s.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    );
  }, [debouncedSearch]);

  return (
    <ServiceContext.Provider value={{ selected, setSelected }}>
      <div className="container">
        <h1>Event Services</h1>
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid">
          {services.map((service) => (
            <motion.div key={service.id} whileHover={{ scale: 1.05 }}>
              <div className="card" onClick={() => setSelected(service)}>
                <h2>{service.name}</h2>
                <p>₹{service.price}</p>
                <p>⭐ {service.rating}</p>
                <p>{service.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
        {selected && <ServiceDetailModal />}
      </div>
    </ServiceContext.Provider>
  );
}

function ServiceDetailModal() {
  const { selected, setSelected } = useContext(ServiceContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: "",
    guests: "",
    name: "",
    email: "",
  });

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={() => setSelected(null)}>X</button>
        <h2>{selected.name}</h2>

        {step === 1 && (
          <div>
            <h3>Select Date</h3>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <button onClick={handleNext}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <input
              type="number"
              placeholder="Number of Guests"
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
            />
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <button onClick={handlePrev}>Back</button>
            <button onClick={handleNext}>Next</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3>Summary</h3>
            <p>Date: {formData.date}</p>
            <p>Guests: {formData.guests}</p>
            <p>Name: {formData.name}</p>
            <p>Email: {formData.email}</p>
            <button onClick={handlePrev}>Back</button>
            <button className="confirm">Confirm Booking</button>
          </div>
        )}
      </div>
    </div>
  );
}
