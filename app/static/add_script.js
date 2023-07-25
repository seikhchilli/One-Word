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