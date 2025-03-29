document.addEventListener("DOMContentLoaded", () => {
    fetchItems();
});

// ✅ Fetch all items from MongoDB
const fetchItems = async () => {
    try {
        const response = await fetch("/api/dashboard");
        const items = await response.json();
        
        const tableBody = document.querySelector("#itemsTable tbody");
        tableBody.innerHTML = "";

        items.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item._id}</td>
                <td>${item.name}</td>
                <td>${new Date(item.dateFound).toLocaleDateString()}</td>
                <td>${item.location}</td>
                <td>${item.contact}</td>
                <td>${item.status}</td>
                <td>
                    <button class="retrieve" onclick="markAsRetrieved('${item._id}')">✅ Retrieve</button>
                    <button class="edit" onclick="editItem('${item._id}')">✏️ Edit</button>
                    <button class="delete" onclick="deleteItem('${item._id}')">🗑️ Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("❌ Error fetching items:", error);
    }
};

// ✅ Mark item as retrieved
const markAsRetrieved = async (id) => {
    await fetch(`/api/dashboard/retrieved/${id}`, { method: "PUT" });
    fetchItems();
};

// ✅ Edit item
const editItem = (id) => {
    alert(`Edit item: ${id}`);
};

// ✅ Delete item
const deleteItem = async (id) => {
    await fetch(`/api/dashboard/delete/${id}`, { method: "DELETE" });
    fetchItems();
};

// ✅ Search Functionality
const searchItems = () => {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#itemsTable tbody tr");

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? "" : "none";
    });
};
