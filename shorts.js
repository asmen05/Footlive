function shortenTeamName(teamName) {
    const shortNames = {
        "مانشستر يونايتد": "مان يونايتد",
        "وست هام يونايتد": "وست هام",
        "توتنهام هوتسبر": "توتنهام",
        "باريس سان جيرمان": "باريس",
        "يوكوهاما مارينوس": "مارينوس",
        "سنترال كوست مارينرز": "مارينرز",
        "مانشستر سيتي" :"مان سيتي",
        "النادي الرياضي القسنطيني": "القسنطيني",
        "نادي أوروبا الرياضي": "نادي اوروبا",
        "بايرن ميونيخ": "بايرن",
        "أتلتيكو مدريد": "أتلتيكو",
        "جيل فيسنتي بارسيلوش" :"جيل فيسنتي",
        "بروسيا دورتموند": "دورتموند",
        "توتنهام هوتسبير": "توتنهام",
        "أولمبيك ليون": "ليون",
        "غلاسكو رينجرز": "رينجرز",
        "بوكا جونيورز": "بوكا",
        "ريفر بليت": "ريفر",
        "أياكس أمستردام": "أياكس",
        "غالطة سراي": "غالطة",
    };
    
    if (shortNames[teamName]) {
        return shortNames[teamName];
    }
    return teamName;
}