# بوکمارکلت برنامه کلاسی گلستان
اگر دانشگاه شما هم از سامانه گلستان برای پرتال دانشجویی استفاده می‌کنه احتمالا چالش گرفتن برنامه کلاسی خودتون و وارد کردنش داخل کلندر موبایل یا گوگل کلندرتون رو داشتید.

با اضافه کردن این بوکمارکلت به مرورگرتون میتونید داخل صفحه نمایش برنامه کلاسی با یه کلیک فایل iCal برنامه کلاسیتون رو دریافت کنید.

کد بوکمارکلت که باید به جای آدرس بوکمارک بزارید:

```
javascript:(()=>{const t=/\s*درس\((?<type>.)\):\s+(?<year>[۰-۹]+)\/(?<month>[۰-۹]+)\/(?<day>[۰-۹]+)\s+(?<start_hour>[۰-۹]+):(?<start_minute>[۰-۹]+)-(?<end_hour>[۰-۹]+):(?<end_minute>[۰-۹]+)\s*(مکان+:\s+(?<location>.+)\s*)?/,n=/امتحان\((?<year>[۰-۹]+)\/(?<month>[۰-۹]+)\/(?<day>[۰-۹]+)\)\s+ساعت\s*:\s*(?<start_hour>[۰-۹]+):(?<start_minute>[۰-۹]+)-(?<end_hour>[۰-۹]+):(?<end_minute>[۰-۹]+)/;function e(t){return parseInt(t.split("").map((t=>t.charCodeAt(0)-"۰".charCodeAt(0))).join(""))}function a(t){return t.toISOString().replace(/[-:]/g,"").split(".")[0]+"Z"}const r=`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Golestan//EN\nX-WR-TIMEZONE:Asia/Tehran\nBEGIN:VTIMEZONE\nTZID:Asia/Tehran\nX-LIC-LOCATION:Asia/Tehran\nBEGIN:STANDARD\nTZOFFSETFROM:+0330\nTZOFFSETTO:+0330\nTZNAME:GMT+3:30\nDTSTART:19700101T000000\nEND:STANDARD\nEND:VTIMEZONE\n\n${Array.from(document.querySelectorAll("#Table3 tr")).map((e=>({name:e.children[2].textContent,group:e.children[1].textContent,schedule:e.children[7].textContent.split("،").map((e=>t.test(e)?{type:"کلاس",data:e.match(t)?.groups}:n.test(e)?{type:"امتحان",data:e.match(n)?.groups}:{type:"unknown",data:e}))}))).flatMap((t=>t.schedule.map((n=>function(t,n,r){const[o,s,d]=function(t,n,e){var a,r,o,s,d;for(r=400*~~((d=365*(t+=1595)-355668+8*~~(t/33)+~~((t%33+3)/4)+e+(n<7?31*(n-1):30*(n-7)+186))/146097),(d%=146097)>36524&&(r+=100*~~(--d/36524),(d%=36524)>=365&&d++),r+=4*~~(d/1461),(d%=1461)>365&&(r+=~~((d-1)/365),d=(d-1)%365),s=d+1,a=[0,31,r%4==0&&r%100!=0||r%400==0?29:28,31,30,31,30,31,31,30,31,30,31],o=0;o<13&&s>a[o];o++)s-=a[o];return[r,o,s]}(e(r.data.year),e(r.data.month),e(r.data.day)),[i,c,u,T]=[e(r.data.start_hour),e(r.data.end_hour),e(r.data.start_minute),e(r.data.end_minute)],E=new Date(o,s-1,d,i,u,0),l=new Date(o,s-1,d,c,T,0);return`BEGIN:VEVENT\nUID:${Math.random().toString(36).slice(2,9)}@golestan.ir\nDTSTAMP:${a(new Date)}\nDTSTART:${a(E)}\nDTEND:${a(l)}\nSUMMARY: ${r.type} درس ${t} کد ${n.split("_")[0]} گروه ${n.split("_")[1]}\nEND:VEVENT\n`}(t.name,t.group,n))))).join("\n\n")}\n\nEND:VCALENDAR\n`,o=new Blob([r],{type:"text/calendar;charset=utf-8"}),s=window.URL.createObjectURL(o),d=document.createElement("a");d.href=s,d.download="برنامه دانشگاه.ics",d.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})),setTimeout((()=>{window.URL.revokeObjectURL(s),d.remove()}),100)})();
```
