const operator = document.getElementById("operator");
const a = document.getElementById("a");
const b = document.getElementById("b");
const calculate = document.getElementById("calculate");
const resultDiv = document.getElementById("result");
const inputsDiv = document.getElementById("inputs");

calculate.addEventListener("click", async () => {
    const valA = a.value;
    const valB = b.value;
    const op = operator.value;

    if (!valA || !valB) {
        alert("Please enter both numbers");
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:3000/calculator/?a=${valA}&b=${valB}&operator=${op}`,
        );
        const result = await response.text();

        // Update the result view
        inputsDiv.style.display = "none";
        resultDiv.style.display = "block";
        resultDiv.innerHTML = `
            <h1>Result</h1>
            <p style="margin-bottom: 2rem; font-size: 1.1rem; color: #94a3b8;">
                <span style="font-size: 2.5rem; font-weight: 800; color: #f8fafc; display: block; margin-top: 1rem; text-align: center;">${result}</span>
            </p>
            <button id="go-back">Calculate Again</button>
        `;

        document.getElementById("go-back").addEventListener("click", () => {
            resultDiv.style.display = "none";
            inputsDiv.style.display = "block";
        });
    } catch (error) {
        console.error("Error fetching result:", error);
        alert("Failed to calculate. Check console for details.");
    }
});
