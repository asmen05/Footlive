document.addEventListener("DOMContentLoaded", function () {
    let buttons = document.querySelectorAll(".match-btn");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            document.querySelector(".match-btn.active").classList.remove("active");
            this.classList.add("active");
        });
    });
});
async function fetchMatches() {
    const dateInput = document.querySelector("#STING-WEB-Visitor");
    const dateValue = dateInput.value; 
    const timeZone = dateInput.getAttribute("time");  
    const apiUrl = `https://www.messisporat.com/api/matches/?date=${dateValue}&lang=27&time=${timeZone}`;
    const matchesContainer = document.querySelector(".STING-WEB-Matches-Center");
    matchesContainer.innerHTML = `
        <div class="STING-WEB-Loading-Matches">
            <img src="/assets/images/loading.gif?v=1.0.1" alt="Loading" style=" width: 40px; height: 40px; text-align: center; display: flex; align-items: center; margin: 0 auto; padding: 40px 0; "/>
        </div>
    `;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        matchesContainer.innerHTML = '';
        if (data["STING-WEB-Matches"] && data["STING-WEB-Matches"].length > 0) {
            const cups = {};
            data["STING-WEB-Matches"].forEach(match => {
                const cupId = match["Cup-id"];
                if (!cups[cupId]) {
                    cups[cupId] = {
                        name: match["Cup-Name"],
                        logo: match["Cup-Logo"],
                        matches: []
                    };
                }
                cups[cupId].matches.push(match);
            });
            for (const cupId in cups) {
                const cup = cups[cupId];
                const cupDiv = document.createElement("div");
                cupDiv.className = "STING-WEB-Cup-Matches"; 
                const isCollapsed = localStorage.getItem(`collapsed-${cupId}`) === 'true';
                const isPinned = localStorage.getItem(`pinned-cup-${cupId}`) === "true";
                if (isCollapsed) cupDiv.classList.add("collapsed");
                if (isPinned) cupDiv.classList.add("pinned");
                cupDiv.innerHTML = `
                    <div class="STING-WEB-Cup-Name">
                        <div class="STING-WEB-Cup-Name-Right">
                            <img src="${cup.logo}" alt="${cup.name} Logo"/>
                            <a href="/standings/view/?id=${cupId}"><h3>${cup.name}</h3></a>
                        </div>
                        <div class="STING-WEB-Cup-Name-Left">
                        <a class="STING-WEB-Standing" title="ترتيب الفرق والهدافين ${cup.name}" href="/standings/view/?id=${cupId}">الترتيب</a>
                        <span class="STING-WEB-Cup-Setting_SVG" title="إعدادات البطولة" onclick="toggleDisplayStyle(event, this, ${cupId})"></span>
                        <div class="STING-WEB-Cup-Settings" data-cup-id="${cupId}">
                            <div class="STING-WEB-One-Setting" onclick="toggleMatches('${cupId}')"><div class="STING-WEB-Toggle-Matches-Hide ${isCollapsed ? 'STING-WEB-Show_SVG' : 'STING-WEB-unShow_SVG'}"></div></div>
                            <div class="STING-WEB-One-Setting" onclick="togglePinCup('${cupId}')"><div class="STING-WEB-Pin-Cup_SVG ${isPinned ? 'STING-WEB-Pinned_SVG' : 'STING-WEB-unPinned_SVG'}" data-cup-id="${cupId}"></div></div>
                        </div>
                        </div>
                    </div>
                `;
                cup.matches.forEach(match => {
                    const teamRightGoal = match["Team-Right"].Goal;
                    const teamLeftGoal = match["Team-Left"].Goal;
                    const teamRightName = shortenTeamName(match["Team-Right"].Name);
                    const teamLeftName = shortenTeamName(match["Team-Left"].Name);
                    const matchDiv = document.createElement("div");
                    matchDiv.className = "STING-WEB-Match-div"; 
                    matchDiv.setAttribute("id", `${match["Match-id"]}`);
                    matchDiv.innerHTML = `
                        <a class="STING-WEB-Match-div-Here" href="/match/?id=${match["Match-id"]}" title="مباراة ${match["Team-Right"].Name} و${match["Team-Left"].Name}">
                            <div class="STING-WEB-Match-div-Right">
                                <span class="STING-WEB-Match-div-Team-Name">${teamRightName}</span>
                                <img class="STING-WEB-Match-div-Team-Logo" src="${match["Team-Right"].Logo}" alt="${match["Team-Right"].Name} Logo"/>
                            </div>
                            <div class="STING-WEB-Match-div-Center">
                                <span class="Match-div-Status"></span>
                                <div class="STING-WEB-Time-Descending" data-start="${match["Time-Start"]}" data-end="${match["Time-End"]}"></div>
                                <div class="STING-WEB-Match-div-Goal">
                                    <span class="Goal-Team" style="color: ${teamRightGoal > teamLeftGoal ? '#39dbbf' : teamRightGoal < teamLeftGoal ? 'rgba(255, 255, 255, 0.5)' : '#bfc3d4'};">${teamRightGoal}</span>
                                    <div class="STING-WEB-Progress">
                                         <svg class="STING-WEB-Circular-Progress" viewBox="0 0 36 36" width="55" height="55">
                                            <circle class="STING-WEB-Circular-Progress-Background" cx="18" cy="18" r="15.91549431" fill="#263545" stroke="#263545" stroke-width="1"/>
                                            <text class="STING-WEB-div-Time-Display" x="18" y="18" text-anchor="middle" alignment-baseline="central" font-size="6" fill="#39dbbf">${match["Time-Now"]}</text>
                                            <circle class="STING-WEB-Circular-Progress-Bar" cx="18" cy="18" r="15.91549431" fill="none" stroke="#39dbbf" stroke-width="1" stroke-dasharray="100, 100" stroke-dashoffset="100"/>
                                        </svg>
                                    </div>
                                    <span class="Goal-Team-Part">-</span>
                                    <span class="Goal-Team" style="color: ${teamLeftGoal > teamRightGoal ? '#39dbbf' : teamLeftGoal < teamRightGoal ? 'rgba(255, 255, 255, 0.5)' : '#bfc3d4'};">${teamLeftGoal}</span>
                                </div>
                            </div>
                            <div class="STING-WEB-Match-div-Left">
                                <span class="STING-WEB-Match-div-Team-Name">${teamLeftName}</span>
                                <img class="STING-WEB-Match-div-Team-Logo" src="${match["Team-Left"].Logo}" alt="${match["Team-Left"].Name} Logo"/>
                            </div>
                           <div class="STING-WEB-Match-Event">
                                <span title="التشكيلة" class="STING-WEB-Lineup_SVG"></span>
                                <span title="مباشر" class="STING-WEB-Live_SVG"></span>
                            </div>
                        </a>
                    `;
                    const startTime = new Date(match["Time-Start"]);
                    const endTime = new Date(match["Time-End"]);
                    const now = new Date();
                    const statusElement = matchDiv.querySelector(".Match-div-Status");
                    const timeDisplay = matchDiv.querySelector(".STING-WEB-div-Time-Display");
                    const progressBar = matchDiv.querySelector(".STING-WEB-Circular-Progress-Bar");
                    const EventSVG = matchDiv.querySelector(".STING-WEB-Match-Event");
                    const LineupSVG = matchDiv.querySelector(".STING-WEB-Lineup_SVG");
                    const LiveSVG = matchDiv.querySelector(".STING-WEB-Live_SVG");
                    if (!timeDisplay) {
                        console.error("خطأ: العنصر timeDisplay غير موجود في DOM.");
                        return;
                    }
                    const timeDiff = startTime - now;
                    const diffMinutes = timeDiff / (1000 * 60);
                    if (now < startTime) {
                        const startHours = startTime.getHours() % 12 || 12;
                        const startMinutes = startTime.getMinutes().toString().padStart(2, '0');
                        const ampm = startTime.getHours() >= 12 ? "م" : "ص";
                        statusElement.innerText = `${startHours}:${startMinutes} ${ampm}`;
                        statusElement.classList.add("Not-Start");
                        matchDiv.classList.add("NOT");
                        if (diffMinutes <= 30) {
                            // EventSVG.style.display = "grid";
                            // EventSVG.style.justifyItems = "center";
                            // EventSVG.style.position = "absolute";
                            // EventSVG.style.left = "0";
                            // LineupSVG.style.display = "block"; 
                        }
                    } else if (now >= startTime && now < endTime) {
                        statusElement.innerText = match["Match-Status"];
                        statusElement.classList.add("Live");
                             EventSVG.style.display = "grid";
                             EventSVG.style.justifyItems = "center";
                             EventSVG.style.position = "absolute";
                             EventSVG.style.top = "2px";
                             EventSVG.style.right = "0";
                             LiveSVG.style.display = "grid";
                        matchDiv.classList.add("LIVE");
                        let minutes = parseInt(timeDisplay.textContent) || 0;
                        let seconds = 0;
                        const interval = setInterval(() => {
                            if (minutes < 90) {
                                seconds += 1;
                                if (seconds === 60) {
                                    minutes += 1;
                                    seconds = 0;
                                }
                                timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                                const progressPercentage = (minutes / 90) * 100;
                                progressBar.style.strokeDashoffset = 100 - progressPercentage;
                            } else {
                                clearInterval(interval);
                                timeDisplay.classList.add("ExtraTime");
                                progressBar.style.stroke = "#ff3131";
                            }
                        }, 1000);
                    } else {
                        statusElement.innerText = "إنتهت المباراة";
                        matchDiv.classList.add("END");
                        statusElement.classList.add("Ended");
                    }
                    cupDiv.appendChild(matchDiv);
                });
                matchesContainer.appendChild(cupDiv);
            }
        } else {
            matchesContainer.innerHTML = `
                <p style="text-align: center;padding: 80px 0;color: #ddddddb5;width: 93%;margin: 0 auto;border-radius: 8px;">
                    لا توجد مباريات هامة في هذا اليوم
                </p>
            `;
        }
    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
    }
}
function toggleDisplayStyle(event, button, cupId) {
    var cupSettings = document.querySelector(`.STING-WEB-Cup-Settings[data-cup-id="${cupId}"]`);
    if (cupSettings.style.display === 'flex') {
        cupSettings.style.display = 'none';
    } else {
        cupSettings.style.display = 'flex';
    }
    event.stopPropagation();
}
document.addEventListener('click', function(event) {
    var openSettings = document.querySelectorAll('.STING-WEB-Cup-Settings');
    openSettings.forEach(function(cupSettings) {
        var cupButton = cupSettings.previousElementSibling;
        var cupId = cupSettings.getAttribute('data-cup-id');
        if (!cupSettings.contains(event.target) && event.target !== cupButton) {
            cupSettings.style.display = 'none';
        }
    });
});
function togglePinCup(cupId) {
    const isPinned = localStorage.getItem(`pinned-cup-${cupId}`) === "true";
    if (isPinned) {
        localStorage.removeItem(`pinned-cup-${cupId}`);
    } else {
        localStorage.setItem(`pinned-cup-${cupId}`, "true");
    }
    fetchMatches(); 
}
function toggleMatches(cupId) {
    const cupElement = document.querySelector(`[data-cup-id="${cupId}"]`).closest(".STING-WEB-Cup-Matches");
    cupElement.classList.toggle("collapsed");
    document.querySelector(`.STING-WEB-Cup-Settings[data-cup-id="${cupId}"]`).style.display = 'none';
    const toggleButton = cupElement.querySelector(".STING-WEB-Toggle-Matches-Hide");
    if (cupElement.classList.contains("collapsed")) {
        toggleButton.classList.remove('STING-WEB-unShow_SVG');
        toggleButton.classList.add('STING-WEB-Show_SVG');
        localStorage.setItem(`collapsed-${cupId}`, 'true');
    } else {
        toggleButton.classList.remove('STING-WEB-Show_SVG');
        toggleButton.classList.add('STING-WEB-unShow_SVG');
        localStorage.setItem(`collapsed-${cupId}`, 'false');
    }
}
document.addEventListener("DOMContentLoaded", fetchMatches);