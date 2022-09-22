// 시간 데이터 가져오기
let date = new Date();

// 달력 그리기
const renderCalendar = () => {
    const viewYear = date.getFullYear();
    const viewMonth = date.getMonth();

    // year-month 채우기
    document.querySelector(".year-month").textContent = `${viewMonth + 1}월 ${viewYear}`;

    // 지난 달 마지막 Date, 이번 달 마지막 Date
    const prevLast = new Date(viewYear, viewMonth, 0);
    const thisLast = new Date(viewYear, viewMonth + 1, 0);

    const PLDate = prevLast.getDate();
    const PLDay = prevLast.getDay();

    const TLDate = thisLast.getDate();
    const TLDay = thisLast.getDay();

    // Dates 기본 배열들
    const prevDates = [];
    const thisDates = [...Array(TLDate + 1).keys()].slice(1);
    const nextDates = [];

    // prevDates 계산
    if (PLDay !== 6) {
        for (let i = 0; i < PLDay + 1; i++) {
            prevDates.unshift(PLDate - i);
        }
    }

    // nextDates 계산
    for (let i = 1; i < 7 - TLDay; i++) {
        nextDates.push(i);
    }

    const today = new Date();

    // Dates 합치기
    const dates = prevDates.concat(thisDates, nextDates);

    // Dates 정리
    const firstDateIndex = dates.indexOf(1);
    const lastDateIndex = dates.lastIndexOf(TLDate);

    // 오늘날짜의 인덱스를 정확하게 알기위해 해당월 날짜를 제외한 값은 0으로 변경 한다.
    for (let i = 0; i < firstDateIndex; i++) {
        dates[i] = 0;
    }
    for (let i = lastDateIndex + 1; i < dates.length; i++) {
        dates[i] = 0;
    }
    const todayDateIndex = dates.indexOf(today.getDate());

    dates.forEach((date, idx) => {
        // 현재월 조건문
        if (viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
            let choiceDt = String(viewYear);
            choiceDt += viewMonth < 9 ? "0" + String(viewMonth + 1) : String(viewMonth + 1);
            choiceDt += date < 10 ? "0" + String(date) : String(date);

            if (idx >= firstDateIndex && idx < todayDateIndex) {
                condition = "pastday";
                dates[idx] = `<div class="date"><span class="${condition}">${date}</span></div>`;
            } else if (idx < firstDateIndex || idx > lastDateIndex) {
                condition = "other";
                dates[idx] = `<div class="date"><span class="${condition}">${date}</span></div>`;
            } else {
                condition = "this";
                dates[idx] = `<div class="date" data-dateinfo="${choiceDt}" onclick="choiceDay(this)"><span class="${condition}">${date}</span></div>`;
            }
            return;
        }

        // 과거해 조건문
        if (viewYear < today.getFullYear()) {
            if (idx < firstDateIndex || idx > lastDateIndex) {
                condition = "other";
                dates[idx] = `<div class="date"><span class="${condition}">${date}</span></div>`;
            } else {
                condition = "pastday";
                dates[idx] = `<div class="date"><span class="${condition}">${date}</span></div>`;
            }
            return;
        }
        // 과거월 조건문
        if (viewMonth < today.getMonth() && viewYear === today.getFullYear()) {
            if (idx < firstDateIndex || idx > lastDateIndex) {
                condition = "other";
                dates[idx] = `<div class="date"><span class="${condition}">${date}</span></div>`;
            } else {
                condition = "pastday";
                dates[idx] = `<div class="date"><span class="${condition}">${date}</span></div>`;
            }
            return;
        }
        // 미래 조건문
        if (viewMonth > today.getMonth() || viewYear > today.getFullYear()) {
            console.log("미래해 맞나요?", viewYear);

            let choiceDt = String(viewYear);
            choiceDt += viewMonth < 9 ? "0" + String(viewMonth + 1) : String(viewMonth + 1);
            choiceDt += date < 10 ? "0" + String(date) : String(date);
            if (idx < firstDateIndex || idx > lastDateIndex) {
                condition = "other";
                dates[idx] = `<div class="date"><span class="${condition}">${date}</span></div>`;
            } else {
                condition = "this";
                dates[idx] = `<div class="date" data-dateInfo="${choiceDt}" onclick="choiceDay(this)" ><span class="${condition}">${date}</span></div>`;
            }
            return;
        }
    });

    // Dates 그리기
    document.querySelector(".dates").innerHTML = dates.join("");

    // 현재일자 표시
    if (viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
        for (let date of document.querySelectorAll(".this")) {
            if (+date.innerText === today.getDate()) {
                date.classList.add("today");
                break;
            }
        }
    }
};
renderCalendar();

// 지난월 이동
const prevMonth = () => {
    date.setMonth(date.getMonth() - 1);

    renderCalendar();
};

// 다음월 이동
const nextMonth = () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
};

// 현재월 이동
const goToday = () => {
    date = new Date();
    renderCalendar();
};

// 시작일
let startChoiceDay;
// 마지막일
let lastChoiceDay;
// 선택일 카운터
let choiceCount = 0;

// 트립일정 선택
function choiceDay(obj) {
    if (startChoiceDay === null || startChoiceDay === undefined) {
        startChoiceDay = obj.dataset.dateinfo;
        choiceCount++;
    } else if (lastChoiceDay === null || lastChoiceDay === undefined) {
        if (Number(startChoiceDay) + Number(30) <= Number(obj.dataset.dateinfo)) {
            alert("최대 30일 입니다.");
        } else {
            lastChoiceDay = obj.dataset.dateinfo;
            choiceCount++;
        }
    } else {
        startChoiceDay = obj.dataset.dateinfo;
        lastChoiceDay = null;
        choiceCount = 1;
    }
    console.log("선택된 날짜", startChoiceDay);
    console.log("선택된 마지막날짜", lastChoiceDay);
    console.log("선택되고 있는 카운트", choiceCount);
}
