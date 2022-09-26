// 시간 데이터 가져오기
let date = new Date();
// 트립시작일
let startChoiceDay;
// 트립마지막일
let lastChoiceDay;

// 정해진 시작일 트립 배열
let tripStartDtArr = ["2022-09-28", "2022-10-09", "2022-10-25"];

// 정해진 마지막날 트립 배열
let tripEndDtArr = ["2022-09-29", "2022-10-15", "2022-10-30"];

// 달력 그리기
const renderCalendar = () => {
    const viewYear = date.getFullYear();
    const viewMonth = date.getMonth();

    // year-month 채우기
    document.querySelector(".year-month").textContent = `${viewYear}년 ${viewMonth + 1}월`;

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
                dates[
                    idx
                ] = `<div class="date" data-dateinfo="${choiceDt}" onclick="choiceDay(this, ${date})"><span data-dateinfo="${choiceDt}" class="${condition}">${date}</span></div>`;
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
                ] = `<div class="date" data-dateInfo="${choiceDt}" onclick="choiceDay(this, ${date})" ><span data-dateinfo="${choiceDt}" class="${condition}">${date}</span></div>`;
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
            for (let rawdata of document.getElementsByClassName("date")) {
                if (rawdata.getAttribute("data-dateinfo") === startChoiceDay) {
                    rawdata.classList.add("startDt");
                    break;
                }
            }
        }
    }

    console.log("시작일", startChoiceDay, "마지막일", lastChoiceDay);
    // range 그리기
    if (lastChoiceDay) {
        for (let rawdata of document.getElementsByClassName("date")) {
            if (rawdata.getAttribute("data-dateinfo")) {
                // 시작일과 마지막일이 같을때 (1박 여행)
                if (rawdata.getAttribute("data-dateinfo") === startChoiceDay && rawdata.getAttribute("data-dateinfo") === lastChoiceDay) {
                    rawdata.classList.add("startDt");
                    break;
                }
                if (rawdata.getAttribute("data-dateinfo") === lastChoiceDay) {
                    rawdata.classList.add("lastAdd");
                } else if (rawdata.getAttribute("data-dateinfo") === startChoiceDay) {
                    rawdata.classList.remove("startDt");
                    rawdata.classList.add("startAdd");
                } else if (
                    new Date(rawdata.getAttribute("data-dateinfo")) > new Date(startChoiceDay) &&
                    new Date(rawdata.getAttribute("data-dateinfo")) < new Date(lastChoiceDay)
                ) {
                    rawdata.classList.add("range");
                }
            }
        }
    }

    // 트립 중복일자 체크
    // for (let selectedDate of document.getElementsByClassName("this")) {
    //     if (selectedDate.getAttribute("data-dateinfo")) {
    //         for (let i = 0; i < tripStartDtArr.length; i++) {
    //             if (new Date(selectedDate.getAttribute("data-dateinfo")) >= new Date(tripStartDtArr[i])) {
    //                 selectedDate.classList.remove("this");
    //                 selectedDate.classList.add("pastday");
    //             } else {
    //             }
    //         }
    //     }
    // }

    //트립 중복일자 체크
    for (let i = 0; i < tripStartDtArr.length; i++) {
        for (let selectedDate of document.getElementsByClassName("date")) {
            if (
                new Date(selectedDate.getAttribute("data-dateinfo")) >= new Date(tripStartDtArr[i]) &&
                new Date(selectedDate.getAttribute("data-dateinfo")) <= new Date(tripEndDtArr[i])
            ) {
                selectedDate.classList.add("selectedDay");
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

// 트립일정 선택
function choiceDay(obj, date) {
    // 선택일자 없을때
    if (startChoiceDay === null || startChoiceDay === undefined) {
        startChoiceDay = obj.dataset.dateinfo;
        renderCalendar();
        return;
        // 시작일만 있을때
    } else if (lastChoiceDay === null || lastChoiceDay === undefined) {
        let startDay = new Date(startChoiceDay);
        let choiceDay = new Date(obj.dataset.dateinfo);
        // 트립을 역순으로 선택 했을때
        if (startDay > choiceDay) {
            let formatStartDay = choiceDay;
            let formatLastDay = startDay;
            formatStartDay.setDate(formatStartDay.getDate() + 30);
            if (formatStartDay.getTime() <= formatLastDay.getTime()) {
                alert("최대 30일 입니다.");
            } else {
                let changeStartDay = obj.dataset.dateinfo;
                let changeLastDay = startChoiceDay;
                startChoiceDay = changeStartDay;
                lastChoiceDay = changeLastDay;
                for (let i = 0; i < tripStartDtArr.length; i++) {
                    if (new Date(startChoiceDay) <= new Date(tripStartDtArr[i]) && new Date(lastChoiceDay) >= new Date(tripEndDtArr[i])) {
                        alert("중복된 일정 입니다.");
                        return;
                    }
                }
                renderCalendar();
                return;
            }
            // 트립을 순차적으로 선택 했을때
        } else {
            startDay.setDate(startDay.getDate() + 30);
            if (startDay.getTime() <= choiceDay.getTime()) {
                alert("최대 30일 입니다.");
            } else {
                lastChoiceDay = obj.dataset.dateinfo;
                for (let i = 0; i < tripStartDtArr.length; i++) {
                    if (new Date(startChoiceDay) <= new Date(tripStartDtArr[i]) && new Date(lastChoiceDay) >= new Date(tripEndDtArr[i])) {
                        alert("중복된 일정 입니다.");
                        return;
                    }
                }
                renderCalendar();
                return;
            }
        }

        // 트립을 다시 선택했을때
    } else {
        startChoiceDay = obj.dataset.dateinfo;
        lastChoiceDay = null;
        renderCalendar();
        return;
    }
}

//중복 체크 함수
function checkedTripDate(startDay, choiceDay) {
    for (let i = 0; i < tripStartDtArr.length; i++) {
        console.log("선택된 첫번째 날", new Date(startDay));
        console.log("선택된 마지막날", new Date(choiceDay));
        console.log("일정 잡힌 첫번째 날", new Date(tripStartDtArr[i]));
        console.log("일정 잡힌 마지막날", new Date(tripEndDtArr[i]));
        console.log("조건문", new Date(startDay) <= new Date(tripStartDtArr[i]) && new Date(choiceDay) >= new Date(tripEndDtArr[i]));
        if (new Date(startDay) >= new Date(tripStartDtArr[i]) && new Date(choiceDay) <= new Date(tripEndDtArr[i])) {
            return false;
        }
    }
}
