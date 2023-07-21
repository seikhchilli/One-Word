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

// Function to handle add form submission
document.getElementById("addForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const addWordInput = document.getElementById("addWordInput").value.trim();
    const addDefinitionInput = document.getElementById("addDefinitionInput").value.trim();
    if (addWordInput && addDefinitionInput) {
        try {
            const response = await fetch("/add/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `word=${encodeURIComponent(addWordInput)}&definition=${encodeURIComponent(addDefinitionInput)}`,
            });
            const data = await response.json();
            if (response.ok) {
                alert("Word added successfully.");
                window.location.reload();
            } else {
                alert("Failed to add word. Please try again.");
            }
        } catch (error) {
            console.error("Error occurred during word addition:", error);
        }
    }
});
