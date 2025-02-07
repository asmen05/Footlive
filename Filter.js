document.querySelectorAll('.STING-WEB-Filter div').forEach(function(element) {
    element.addEventListener('click', function() {
        document.querySelector('.ActiveNow').classList.remove('ActiveNow');
        this.classList.add('ActiveNow');
        filterMatches(); 
    });
});
function filterMatches() {
    const filterType = document.querySelector('.ActiveNow').id;
    const allMatches = document.querySelectorAll('.STING-WEB-Match-div');
    allMatches.forEach(match => {
        const isHidden = match.style.display === 'none' || match.closest('.STING-WEB-Cup-Matches.collapsed') !== null;
        if (filterType === "Matches-Live") {
            if (!match.classList.contains('LIVE') || isHidden) {
                match.style.display = 'none';
            } else {
                match.style.display = 'block';
            }
        } else {
            match.style.display = 'block';
        }
    });
}