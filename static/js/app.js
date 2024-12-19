document.getElementById("calculateButton").addEventListener("click", function () {
    const initialInvestment = parseFloat(document.getElementById("initialInvestment").value);
    const interestRate = parseFloat(document.getElementById("interestRate").value) / 100;
    const compoundFrequency = parseInt(document.getElementById("compoundFrequency").value);
    const periodicInvestment = parseFloat(document.getElementById("periodicInvestment").value || 0);
    const periodFrequency = parseInt(document.getElementById("periodFrequency").value);
    const investmentYears = parseInt(document.getElementById("investmentYears").value);
    const inflationRate = parseFloat(document.getElementById("inflationRate").value || 0) / 100;
    const taxRate = parseFloat(document.getElementById("taxRate").value || 0) / 100;

    if (isNaN(initialInvestment) || isNaN(interestRate) || isNaN(investmentYears)) {
        alert("Please fill in all required fields.");
        return;
    }

    let results = [];
    let totalAmount = initialInvestment;
    let totalContributions = 0;
    let totalInterest = 0;

    for (let year = 1; year <= investmentYears; year++) {
        let interestEarned = totalAmount * (Math.pow(1 + interestRate / compoundFrequency, compoundFrequency) - 1);
        interestEarned -= interestEarned * taxRate;

        const periodicContribution = periodicInvestment * periodFrequency;
        totalContributions += periodicContribution;
        totalAmount += interestEarned + periodicContribution;

        totalInterest += interestEarned;

        if (inflationRate > 0) {
            totalAmount /= (1 + inflationRate);
        }

        results.push({
            year: year,
            interest: interestEarned.toFixed(2),
            contributions: totalContributions.toFixed(2),
            total: totalAmount.toFixed(2),
        });
    }

    renderResults(results, totalAmount, totalInterest, initialInvestment, totalContributions);
});

function renderResults(results, totalAmount, totalInterest, initialInvestment, totalContributions) {
    const resultsTableBody = document.getElementById("resultsTableBody");
    resultsTableBody.innerHTML = "";

    results.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.year}</td>
            <td>$${row.interest}</td>
            <td>$${row.contributions}</td>
            <td>$${row.total}</td>
        `;
        resultsTableBody.appendChild(tr);
    });

    renderPieChart(totalAmount, totalInterest, initialInvestment, totalContributions);
    renderGrowthChart(results);
    document.getElementById("results").style.display = "block";
}

function renderPieChart(totalAmount, totalInterest, initialInvestment, totalContributions) {
    const ctx = document.getElementById("pieChart").getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Initial Investment", "Contributions", "Interest"],
            datasets: [{
                data: [initialInvestment, totalContributions, totalInterest],
                backgroundColor: ["#007bff", "#ffc107", "#28a745"],
            }],
        },
    });
}

function renderGrowthChart(results) {
    const ctx = document.getElementById("growthChart").getContext("2d");
    const years = results.map(r => r.year);
    const totals = results.map(r => parseFloat(r.total));
    const savings = results.map(r => parseFloat(r.contributions) + parseFloat(r.initialInvestment || 0));

    new Chart(ctx, {
        type: "line",
        data: {
            labels: years,
            datasets: [
                {
                    label: "Total with Interest",
                    data: totals,
                    borderColor: "#007bff",
                    fill: false,
                },
                {
                    label: "Savings Only",
                    data: savings,
                    borderColor: "#ffc107",
                    fill: false,
                },
            ],
        },
    });
}
