document.addEventListener("DOMContentLoaded", function() {
    let offset = 0;
    const months = [
        "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", 
        "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    function getDate(offset = 0) {
        let today = new Date();
        today.setDate(today.getDate() + offset);
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = today.getMonth();
        const yyyy = today.getFullYear();
        const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
        const dayName = days[today.getDay()];
        const monthName = months[mm];

        return { dayName, monthName, dd, mm, yyyy };
    }
    const visitorInput = document.querySelector("#STING-WEB-Visitor");
    const currentDate = getDate();
    visitorInput.value = `${currentDate.yyyy}-${String(currentDate.mm + 1).padStart(2, "0")}-${currentDate.dd}`;
    function updateDateDisplay({ dd, monthName, yyyy }) {
        document.querySelector(".STING-WEB-Date-Here").textContent = `${dd} ${monthName} ${yyyy}`;
    }
    updateDateDisplay(currentDate);
    document.querySelector(".STING-WEB-Today-Name").textContent = currentDate.dayName;
    visitorInput.addEventListener("change", function() {
        const selectedDate = new Date(visitorInput.value);
        const selectedDay = selectedDate.getDate();
        const selectedMonth = selectedDate.getMonth();
        const selectedYear = selectedDate.getFullYear();
        const selectedDayName = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"][selectedDate.getDay()];
        document.querySelector(".STING-WEB-Today-Name").textContent = selectedDayName;
        updateDateDisplay({ dd: String(selectedDay).padStart(2, "0"), monthName: months[selectedMonth], yyyy: selectedYear });
        fetchMatches();
    });
    document.querySelector(".STING-WEB-Yesterday_SVG").addEventListener("click", function() {
        offset -= 1;
        const newDate = getDate(offset);
        visitorInput.value = `${newDate.yyyy}-${String(newDate.mm + 1).padStart(2, "0")}-${newDate.dd}`;
        updateDateDisplay(newDate);
        document.querySelector(".STING-WEB-Today-Name").textContent = newDate.dayName;
        fetchMatches();
    });
    document.querySelector(".STING-WEB-Tomorrow_SVG").addEventListener("click", function() {
        offset += 1;
        const newDate = getDate(offset);
        visitorInput.value = `${newDate.yyyy}-${String(newDate.mm + 1).padStart(2, "0")}-${newDate.dd}`;
        updateDateDisplay(newDate);
        document.querySelector(".STING-WEB-Today-Name").textContent = newDate.dayName;
        fetchMatches();
    });
    function getFormattedTimeZone() {
        const date = new Date();
        const utcOffset = date.getTimezoneOffset();
        const hoursOffset = Math.abs(Math.floor(utcOffset / 60));
        const minutesOffset = Math.abs(utcOffset % 60);
        const sign = utcOffset > 0 ? "-" : "+";
        return `${sign}${String(hoursOffset).padStart(2, '0')}:${String(minutesOffset).padStart(2, '0')}`;
    }
    const formattedTimeZone = getFormattedTimeZone();
    visitorInput.setAttribute("time", formattedTimeZone);
});