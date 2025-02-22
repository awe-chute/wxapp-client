import { useState, useEffect } from "react";
import axios from "axios"; // Install axios if not already: npm install axios

const API_URL = "http://18.191.198.182:4000/plants"; // Backend URL

export default function PlantTracker() {
    const [plants, setPlants] = useState([]);
    const [plantName, setPlantName] = useState("");
    const [waterAmount, setWaterAmount] = useState("");

    // Fetch plants from the backend
    useEffect(() => {
        axios.get(API_URL)
            .then(response => setPlants(response.data))
            .catch(error => console.error("Error fetching plants:", error));
    }, []);

    // Add a new plant
    const addPlant = async (e) => {
        e.preventDefault();
        if (!plantName || !waterAmount) return;

        try {
            const response = await axios.post(API_URL, { plantName, waterAmount });
            setPlants([...plants, response.data]); // Update state with new plant
            setPlantName("");
            setWaterAmount("");
        } catch (error) {
            console.error("Error adding plant:", error);
        }
    };

    // Remove a plant
    const removePlant = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setPlants(plants.filter((plant) => plant.id !== id));
        } catch (error) {
            console.error("Error deleting plant:", error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Plant Water Tracker</h2>
            <form onSubmit={addPlant} className="space-y-2">
                <input
                    type="text"
                    placeholder="Plant Name"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Water Amount (ml)"
                    value={waterAmount}
                    onChange={(e) => setWaterAmount(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Add Plant</button>
            </form>
            <ul className="mt-4">
                {plants.map((plant) => (
                    <li key={plant.id} className="flex justify-between items-center p-2 border-b">
                        <span>{plant.plantName} - {plant.waterAmount}ml</span>
                        <button onClick={() => removePlant(plant.id)} className="bg-red-500 text-white p-1 rounded">X</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}