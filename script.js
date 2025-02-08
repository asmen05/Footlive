document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("matchDate").valueAsDate = new Date();
    fetchMatches();
});

async function fetchMatches() {
    const date = document.getElementById("matchDate").value;
    const apiUrl = `https://www.messisporat.com/api/matches/?date=${date}&lang=1`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("فشل في جلب البيانات");

        const data = await response.json();
        displayMatches(data["STING-WEB-Matches"]);
    } catch (error) {
        console.error("خطأ:", error);
        document.getElementById("matches").innerHTML = "<p>حدث خطأ أثناء جلب البيانات.</p>";
    }
}

function displayMatches(matches) {
    const container = document.getElementById("matches");
    container.innerHTML = "";

    if (!matches || matches.length === 0) {
        container.innerHTML = "<p>لا توجد مباريات اليوم.</p>";
        return;
    }

    matches.forEach(match => {
        const matchDiv = document.createElement("div");
        matchDiv.classList.add("match");

        matchDiv.innerHTML = `
            <h3>${match["Cup-Name"]}</h3>
            <div class="teams">
                <div>
                    <img src="http://yanb8.com${match["Team-Right"].Logo}" alt="${match["Team-Right"].Name}">
                    <span>${match["Team-Right"].Name}</span>
                </div>
                <span>${match["Team-Right"].Goal} - ${match["Team-Left"].Goal}</span>
                <div>
                    <img src="http://yanb8.com${match["Team-Left"].Logo}" alt="${match["Team-Left"].Name}">
                    <span>${match["Team-Left"].Name}</span>
                </div>
            </div>
            <p>وقت المباراة: ${match["Time-Start"]}</p>
        `;

        container.appendChild(matchDiv);
    });
}