(() => {
    // Source: https://jdf.scr.ir/
    function jalali_to_gregorian(jy, jm, jd) {
        var sal_a, gy, gm, gd, days;
        jy += 1595;
        days = -355668 + (365 * jy) + (~~(jy / 33) * 8) + ~~(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
        gy = 400 * ~~(days / 146097);
        days %= 146097;
        if (days > 36524) {
            gy += 100 * ~~(--days / 36524);
            days %= 36524;
            if (days >= 365) days++;
        }
        gy += 4 * ~~(days / 1461);
        days %= 1461;
        if (days > 365) {
            gy += ~~((days - 1) / 365);
            days = (days - 1) % 365;
        }
        gd = days + 1;
        sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
        return [gy, gm, gd];
    };

    const classRegex = /\s*درس\((?<type>.)\):\s+(?<year>[۰-۹]+)\/(?<month>[۰-۹]+)\/(?<day>[۰-۹]+)\s+(?<start_hour>[۰-۹]+):(?<start_minute>[۰-۹]+)-(?<end_hour>[۰-۹]+):(?<end_minute>[۰-۹]+)\s*(مکان+:\s+(?<location>.+)\s*)?/;
    const examRegex = /امتحان\((?<year>[۰-۹]+)\/(?<month>[۰-۹]+)\/(?<day>[۰-۹]+)\)\s+ساعت\s*:\s*(?<start_hour>[۰-۹]+):(?<start_minute>[۰-۹]+)-(?<end_hour>[۰-۹]+):(?<end_minute>[۰-۹]+)/

    const data = Array.from(
        document.querySelectorAll("#Table3 tr")
    ).map(
        tr => ({
            name: tr.children[2].textContent,
            group: tr.children[1].textContent,
            schedule: tr.children[7].textContent.split('،').map(
                item => classRegex.test(item) ?
                    { type: "کلاس", data: item.match(classRegex)?.groups } :
                    examRegex.test(item) ? { type: "امتحان", data: item.match(examRegex)?.groups } :
                        { type: "unknown", data: item }
            )
        })
    );

    function convertToNumber(persianNumber) {
        return parseInt(persianNumber.split('').map(digit => digit.charCodeAt(0) - '۰'.charCodeAt(0)).join(''));
    };

    function formatDate(date) {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }

    function toIcal(name, group, scheduleItem) {
        const [year, month, day] = jalali_to_gregorian(
            convertToNumber(scheduleItem.data.year),
            convertToNumber(scheduleItem.data.month),
            convertToNumber(scheduleItem.data.day)
        )
        const [startHour, endHour, startMinute, endMinute] = [
            convertToNumber(scheduleItem.data.start_hour),
            convertToNumber(scheduleItem.data.end_hour),
            convertToNumber(scheduleItem.data.start_minute),
            convertToNumber(scheduleItem.data.end_minute),
        ];

        const startDate = new Date(year, month - 1, day, startHour, startMinute, 0)
        const endDate = new Date(year, month - 1, day, endHour, endMinute, 0)

        return `BEGIN:VEVENT
UID:${Math.random().toString(36).slice(2, 9)}@golestan.ir
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY: ${scheduleItem.type} درس ${name} کد ${group.split('_')[0]} گروه ${group.split("_")[1]}
END:VEVENT
`;
    };

    const icalEvents = data.flatMap(item => item.schedule.map(scheduleItem => toIcal(item.name, item.group, scheduleItem)));


    const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Golestan//EN
X-WR-TIMEZONE:Asia/Tehran
BEGIN:VTIMEZONE
TZID:Asia/Tehran
X-LIC-LOCATION:Asia/Tehran
BEGIN:STANDARD
TZOFFSETFROM:+0330
TZOFFSETTO:+0330
TZNAME:GMT+3:30
DTSTART:19700101T000000
END:STANDARD
END:VTIMEZONE

${icalEvents.join("\n\n")}

END:VCALENDAR
`;

    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'برنامه دانشگاه.ics';

    link.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })
    );

    setTimeout(() => {
        window.URL.revokeObjectURL(url);
        link.remove();
    }, 100);
})();