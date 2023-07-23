// Function to handle search form submission
document.getElementById("searchForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const searchInput = document.getElementById("searchInput").value.trim();
    if (searchInput) {
        const searchResultDiv = document.getElementById("wordList");
        try {
            const response = await fetch(`/search/?prefix=${searchInput}`);
            const data = await response.json();
            searchResultDiv.innerHTML = "";
            for (const word of data) {
                const listItem = document.createElement("li");
                const anchor = document.createElement("a");
                anchor.href = `/word/${word}`;
                anchor.textContent = word;
                listItem.appendChild(anchor);
                searchResultDiv.appendChild(listItem);
            }
        } catch (error) {
            console.error("Error occurred during search:", error);
        }
    }
});
