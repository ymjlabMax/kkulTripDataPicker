// 시간 데이터 가져오기
let date = new Date();
// 트립시작일
let startChoiceDay;
// 트립마지막일
let lastChoiceDay;
// 선택일 카운터
let choiceCount = 0;

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
            choiceDt += viewMonth < 9 ? "-0" + String(viewMonth + 1) : "-" + String(viewMonth + 1);
            choiceDt += date < 10 ? "-0" + String(date) : "-" + String(date);

            if (idx >= firstDateIndex && idx < todayDateIndex) {
                condition = "pastday";
                dates[idx] = `<div class="date"><span class="${condition}">${date}</span></div>`;
            } else if (idx < firstDateIndex || idx > lastDateIndex) {
                condition = "other";
                dates[idx] = `<div class="date"><span class="${condition}">${date}</span></div>`;
            } else {
                condition = "this";
                dates[idx] = `<div class="date" data-dateinfo="${choiceDt}" onclick="choiceDay(this, ${date})"><span class="${condition}">${date}</span></div>`;
            }
            return;
        }

        // 미래 조건문
        if (viewMonth > today.getMonth() || viewYear > today.getFullYear()) {
            let choiceDt = String(viewYear);
            choiceDt += viewMonth < 9 ? "-0" + String(viewMonth + 1) : "-" + String(viewMonth + 1);
            choiceDt += date < 10 ? "-0" + String(date) : "-" + String(date);
            if (idx < firstDateIndex || idx > lastDateIndex) {
                condition = "other";
                dates[idx] = `<div class="date"><span class="${condition}">${date}</span></div>`;
            } else {
                condition = "this";
                dates[
                    idx
                ] = `<div class="date" data-dateInfo="${choiceDt}" onclick="choiceDay(this, ${date})" ><span class="${condition}">${date}</span></div>`;
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

    // 선택된 시작날 표시 하기
    if (startChoiceDay) {
        let startChoiceDate = startChoiceDay.split("-");
        if (Number(startChoiceDate[0]) === viewYear && Number(startChoiceDate[1]) === viewMonth + 1) {
            for (let date of document.querySelectorAll(".this")) {
                if (+date.innerText === Number(startChoiceDate[2])) {
                    date.classList.add("startDt");
                    break;
                }
            }
        }
    }

    // 선택된 마지막날 표시 하기
    if (lastChoiceDay) {
        let startChoiceDate = startChoiceDay.split("-");
        let lastChoiceDate = lastChoiceDay.split("-");

        //해당년 && 해당월이 있는 경우
        if (Number(lastChoiceDate[0]) === viewYear && Number(lastChoiceDate[1]) === viewMonth + 1) {
            for (let date of document.querySelectorAll(".this")) {
                if (+date.innerText === Number(lastChoiceDate[2])) {
                    date.classList.add("startDt");
                } else if (Number(date.innerText) > Number(startChoiceDate[2]) && Number(date.innerText) < Number(lastChoiceDate[2])) {
                    date.classList.add("range");
                }
            }
            return;
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

// 트립일정 선택
function choiceDay(obj, date) {
    if (startChoiceDay === null || startChoiceDay === undefined) {
        startChoiceDay = obj.dataset.dateinfo;
        choiceCount++;
        renderCalendar();
        return;
    } else if (lastChoiceDay === null || lastChoiceDay === undefined) {
        let startDay = new Date(startChoiceDay);
        let choiceDay = new Date(obj.dataset.dateinfo);
        let changeStartDay;
        let changeLastDay;

        // 마지막날이 시작일보다 늦을때
        if (startDay > choiceDay) {
            changeStartDay = choiceDay;
            changeLastDay = startDay;
            changeStartDay.setDate(changeStartDay.getDate() + 30);
            if (changeStartDay.getTime() <= changeLastDay.getTime()) {
                alert("최대 30일 입니다.");
            } else {
                let formatStartDay = obj.dataset.dateinfo;
                let formatLastDay = startChoiceDay;
                startChoiceDay = formatStartDay;
                lastChoiceDay = formatLastDay;
                choiceCount++;
                renderCalendar();
                return;
            }
        } else {
            startDay.setDate(startDay.getDate() + 30);
            if (startDay.getTime() <= choiceDay.getTime()) {
                alert("최대 30일 입니다.");
            } else {
                lastChoiceDay = obj.dataset.dateinfo;
                choiceCount++;
                renderCalendar();
                return;
            }
        }
    } else {
        startChoiceDay = obj.dataset.dateinfo;
        lastChoiceDay = null;
        choiceCount = 1;
        renderCalendar();
        return;
    }
}
