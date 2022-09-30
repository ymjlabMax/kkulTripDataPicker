// 시간 데이터 가져오기
let date = new Date();
// 트립시작일
let startChoiceDt;
// 트립마지막일
let endChoiceDt;
// 이미 선택된 트립들
let getTripInfoArr;

// 수정요청 트립 시작하는 날짜
let tripUdtStartDt;
// 수정요청 트립 마지막 날짜
let tripUdtEndDt;

// 이미 선택된 트립 가져오기
function getMsg(data) {
    try {
        getTripInfoArr = JSON.parse(data);
    } catch (err) {
        return err.message;
    }
}

// 테스트용 데이터
getMsg(
    '[{"trip_end_dt":"2022-10-03","trip_start_dt":"2022-10-02"}, {"trip_end_dt":"2022-09-01","trip_start_dt":"2022-08-30"}, {"trip_end_dt":"2022-09-09","trip_start_dt":"2022-09-07"}]'
);

// 트립수정하기
function tripUdt(data) {
    try {
        let tripUdtArr = JSON.parse(data);
        tripUdtStartDt = tripUdtArr[0].trip_start_dt;
        tripUdtEndDt = tripUdtArr[0].trip_end_dt;
    } catch (err) {
        return err.message;
    }
}
// 트립 수정하기 실행 되었을때
tripUdt('[{"trip_start_dt":"2022-09-30", "trip_end_dt":"2022-09-30"}]');

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

    // 달력 기본 배열들
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
                dates[idx] = `<div class="date pastday">${date}</div>`;
            } else if (idx < firstDateIndex || idx > lastDateIndex) {
                dates[idx] = `<div class="date other">${date}</div>`;
            } else {
                condition = "this";
                dates[idx] = `<div class="date this" data-dateinfo="${choiceDt}" onclick="selectChoiceDay(this)">${date}</div>`;
            }
            return;
        }

        // 미래 조건문
        if (viewMonth > today.getMonth() || viewYear > today.getFullYear()) {
            let choiceDt = String(viewYear);
            choiceDt += viewMonth < 9 ? "-0" + String(viewMonth + 1) : "-" + String(viewMonth + 1);
            choiceDt += date < 10 ? "-0" + String(date) : "-" + String(date);
            if (idx < firstDateIndex || idx > lastDateIndex) {
                dates[idx] = `<div class="date other">${date}</div>`;
            } else {
                dates[idx] = `<div class="date this" data-dateInfo="${choiceDt}" onclick="selectChoiceDay(this)" >${date}</div>`;
            }
            return;
        }

        // 과거해 조건문
        if (viewYear < today.getFullYear()) {
            if (idx < firstDateIndex || idx > lastDateIndex) {
                dates[idx] = `<div class="date other">${date}</div>`;
            } else {
                dates[idx] = `<div class="date pastday">${date}</div>`;
            }
            return;
        }
        // 과거월 조건문
        if (viewMonth < today.getMonth() && viewYear === today.getFullYear()) {
            if (idx < firstDateIndex || idx > lastDateIndex) {
                dates[idx] = `<div class="date other">${date}</div>`;
            } else {
                dates[idx] = `<div class="date pastday">${date}</div>`;
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

    //트립 일정 정하기
    if (tripUdtStartDt === null || tripUdtStartDt === undefined) {
        if (startChoiceDt) {
            let startChoiceDate = startChoiceDt.split("-");
            if (Number(startChoiceDate[0]) === viewYear && Number(startChoiceDate[1]) === viewMonth + 1) {
                for (let rawdata of document.getElementsByClassName("date")) {
                    if (rawdata.getAttribute("data-dateinfo") === startChoiceDt) {
                        rawdata.classList.add("startDt");
                        break;
                    }
                }
            }
        }
        // 마지막날이 선택되면 range 그리기
        if (endChoiceDt) {
            for (let rawdata of document.getElementsByClassName("date")) {
                if (rawdata.getAttribute("data-dateinfo")) {
                    // 시작일과 마지막일이 같을때 (1박 여행)
                    if (rawdata.getAttribute("data-dateinfo") === startChoiceDt && rawdata.getAttribute("data-dateinfo") === endChoiceDt) {
                        rawdata.classList.add("startDt");
                        break;
                    }
                    if (rawdata.getAttribute("data-dateinfo") === endChoiceDt) {
                        rawdata.classList.add("lastAdd");
                    } else if (rawdata.getAttribute("data-dateinfo") === startChoiceDt) {
                        rawdata.classList.remove("startDt");
                        rawdata.classList.add("startAdd");
                    } else if (
                        new Date(rawdata.getAttribute("data-dateinfo")) > new Date(startChoiceDt) &&
                        new Date(rawdata.getAttribute("data-dateinfo")) < new Date(endChoiceDt)
                    ) {
                        rawdata.classList.add("range");
                    }
                }
            }
        }
    } else if (tripUdtEndDt && tripUdtStartDt) {
        for (let rawdata of document.getElementsByClassName("date")) {
            if (rawdata.getAttribute("data-dateinfo")) {
                // 하루일정 일때
                if (tripUdtStartDt === tripUdtEndDt) {
                    if (rawdata.getAttribute("data-dateinfo") === tripUdtStartDt) {
                        rawdata.classList.add("startDt");
                    }
                } else {
                    if (rawdata.getAttribute("data-dateinfo") === tripUdtStartDt) {
                        rawdata.classList.add("startAdd");
                    } else if (rawdata.getAttribute("data-dateinfo") === tripUdtEndDt) {
                        rawdata.classList.add("lastAdd");
                    } else if (
                        new Date(rawdata.getAttribute("data-dateinfo")) > new Date(tripUdtStartDt) &&
                        new Date(rawdata.getAttribute("data-dateinfo")) < new Date(tripUdtEndDt)
                    ) {
                        rawdata.classList.add("range");
                    }
                }
            }
        }
    }

    // 수정하기 일때

    console.log("시작일", startChoiceDt, "마지막일", endChoiceDt, "수정시작일", tripUdtStartDt, "수정 마지막일", tripUdtEndDt);

    //트립 중복일자 체크
    if (getTripInfoArr !== undefined || getTripInfoArr !== null) {
        for (let i = 0; i < getTripInfoArr.length; i++) {
            for (let selectedDate of document.getElementsByClassName("date")) {
                if (
                    new Date(selectedDate.getAttribute("data-dateinfo")) >= new Date(getTripInfoArr[i].trip_start_dt) &&
                    new Date(selectedDate.getAttribute("data-dateinfo")) <= new Date(getTripInfoArr[i].trip_end_dt)
                ) {
                    selectedDate.onclick = null;
                    selectedDate.classList.add("selectedDay");
                }
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

// 날짜 선택 또는 수정하기 함수
function selectChoiceDay(obj) {
    if (tripUdtStartDt === null || tripUdtStartDt === undefined) {
        choiceDay(obj);
    } else {
        udtChoiceDay(obj);
    }
}

// 수정 트립일정 선택
function udtChoiceDay(obj) {
    let formatUdstStartDay = new Date(tripUdtStartDt);
    let formatUdtEndDay = new Date(obj.dataset.dateinfo);
    formatUdstStartDay.setDate(formatUdstStartDay.getDate() + 30);
    if (new Date(tripUdtStartDt) > new Date(obj.dataset.dateinfo)) {
        alert("시작일은 수정 불가 입니다.");
    } else if (formatUdstStartDay.getTime() <= formatUdtEndDay.getTime()) {
        alert("최대 30일 입니다.");
    } else if (getTripInfoArr !== null || getTripInfoArr !== undefined) {
        for (let i = 0; i < getTripInfoArr.length; i++) {
            if (new Date(tripUdtStartDt) <= new Date(getTripInfoArr[i].trip_start_dt) && formatUdtEndDay >= new Date(getTripInfoArr[i].trip_end_dt)) {
                alert("중복된 일정 입니다.");
                break;
            } else {
                tripUdtEndDt = obj.dataset.dateinfo;
                renderCalendar();
            }
        }
    } else {
        tripUdtEndDt = obj.dataset.dateinfo;
        renderCalendar();
    }
}

// 기본 트립일정 선택
function choiceDay(obj) {
    // 선택일자 없을때
    if (startChoiceDt === null || startChoiceDt === undefined) {
        startChoiceDt = obj.dataset.dateinfo;
        renderCalendar();
        return;
        // 시작일만 있을때
    } else if (endChoiceDt === null || endChoiceDt === undefined) {
        let startDay = new Date(startChoiceDt);
        let selectEndDay = new Date(obj.dataset.dateinfo);
        // 트립을 역순으로 선택 했을때
        if (startDay > selectEndDay) {
            let formatStartDay = selectEndDay;
            let formatLastDay = startDay;
            formatStartDay.setDate(formatStartDay.getDate() + 30);
            if (formatStartDay.getTime() <= formatLastDay.getTime()) {
                startChoiceDt = null;
                endChoiceDt = null;
                alert("최대 30일 입니다.");
            } else {
                let changeStartDay = obj.dataset.dateinfo;
                let changeLastDay = startChoiceDt;
                startChoiceDt = changeStartDay;
                endChoiceDt = changeLastDay;
                if (getTripInfoArr === null || getTripInfoArr === undefined) {
                    renderCalendar();
                    return;
                } else {
                    for (let i = 0; i < getTripInfoArr.length; i++) {
                        if (
                            new Date(startChoiceDt) <= new Date(getTripInfoArr[i].trip_start_dt) &&
                            new Date(endChoiceDt) >= new Date(getTripInfoArr[i].trip_end_dt)
                        ) {
                            endChoiceDt = null;
                            startChoiceDt = null;
                            alert("중복된 일정 입니다.");
                        }
                    }
                }
                renderCalendar();
                return;
            }
            // 트립을 순차적으로 선택 했을때
        } else {
            startDay.setDate(startDay.getDate() + 30);
            if (startDay.getTime() <= selectEndDay.getTime()) {
                startChoiceDt = null;
                endChoiceDt = null;
                alert("최대 30일 입니다.");
            } else {
                endChoiceDt = obj.dataset.dateinfo;
                if (getTripInfoArr === null || getTripInfoArr === undefined) {
                    renderCalendar();
                    return;
                } else {
                    for (let i = 0; i < getTripInfoArr.length; i++) {
                        if (
                            new Date(startChoiceDt) <= new Date(getTripInfoArr[i].trip_start_dt) &&
                            new Date(endChoiceDt) >= new Date(getTripInfoArr[i].trip_end_dt)
                        ) {
                            endChoiceDt = null;
                            startChoiceDt = null;
                            alert("중복된 일정 입니다.");
                        }
                    }
                }
                renderCalendar();
                return;
            }
        }
        // 트립을 다시 선택했을때
    } else {
        startChoiceDt = obj.dataset.dateinfo;
        endChoiceDt = null;
        renderCalendar();
        return;
    }
}
