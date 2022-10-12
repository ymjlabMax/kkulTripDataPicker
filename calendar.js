// 시간 데이터 가져오기
let date = new Date();
// 트립시작일
let startChoiceDt;
// 트립마지막일
let endChoiceDt;
// 이미 선택된 트립들
let getTripInfoArr;
// 수정하는 트립 배열
let udtTripInfoArr;

// 이미 선택된 트립 가져오기
// function getMsg(data) {
//     try {
//         getTripInfoArr = JSON.parse(data);
//     } catch (err) {
//         return err.message;
//     }
// }
let udtStrDt;
let udtEndDt;

//트립수정하기;
function tripUdt(data, str, end) {
    try {
        let totalDateArr = JSON.parse(data);
        if (str) {
            let getArr = totalDateArr.filter((date) => date.trip_start_dt !== str && date.trip_end_dt !== end);
            let udtArr = totalDateArr.filter((date) => date.trip_start_dt === str && date.trip_end_dt === end);
            getTripInfoArr = getArr;
            udtTripInfoArr = udtArr;
            startChoiceDt = str;
            endChoiceDt = end;
            udtStrDt = str;
            udtEndDt = end;
            renderCalendar();
        } else if (str === null || str === undefined) {
            getTripInfoArr = totalDateArr;
            renderCalendar();
        }
    } catch (err) {
        return err.message;
    }
}
// 트립 수정하기 실행 되었을때
tripUdt('[{"trip_start_dt":"2022-11-11","trip_end_dt":"2022-11-23"}, {"trip_start_dt":"2022-10-10","trip_end_dt":"2022-10-14"}]', "2022-10-10", "2022-10-14");
// tripUdt();

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
            if (udtTripInfoArr === null || udtTripInfoArr === undefined) {
                if (idx >= firstDateIndex && idx < todayDateIndex) {
                    dates[idx] = `<div class="date pastday">${date}</div>`;
                } else if (idx < firstDateIndex || idx > lastDateIndex) {
                    dates[idx] = `<div class="date other">${date}</div>`;
                } else {
                    condition = "this";
                    dates[idx] = `<div class="date this" data-dateinfo="${choiceDt}" onclick="selectChoiceDay(this)">${date}</div>`;
                }
                return;
            } else if (udtTripInfoArr) {
                let formatStartDt = new Date(udtStrDt);
                let formatEndDt = new Date(udtEndDt);
                if (formatStartDt <= new Date(choiceDt) && new Date(choiceDt) <= formatEndDt) {
                    dates[idx] = `<div class="date this" data-dateinfo="${choiceDt}" onclick="selectChoiceDay(this)">${date}</div>`;
                } else if (idx >= firstDateIndex && idx < todayDateIndex && date < formatStartDt.getDate()) {
                    dates[idx] = `<div class="date pastday">${date}</div>`;
                } else if (idx < firstDateIndex || idx > lastDateIndex) {
                    dates[idx] = `<div class="date other">${date}</div>`;
                } else {
                    dates[idx] = `<div class="date this" data-dateinfo="${choiceDt}" onclick="selectChoiceDay(this)">${date}</div>`;
                }
                return;
            }
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

    //트립 일정 정하기
    if (udtTripInfoArr === null || udtTripInfoArr === undefined) {
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
    } else if (udtTripInfoArr) {
        for (let rawdata of document.getElementsByClassName("date")) {
            if (rawdata.getAttribute("data-dateinfo")) {
                // 하루일정 일때
                if (startChoiceDt === endChoiceDt) {
                    if (rawdata.getAttribute("data-dateinfo") === startChoiceDt) {
                        rawdata.classList.add("startDt");
                    }
                    // 하루 일정이 아닐때
                } else if (endChoiceDt === null) {
                    if (rawdata.getAttribute("data-dateinfo") === startChoiceDt) {
                        rawdata.classList.add("startDt");
                    }
                } else {
                    if (rawdata.getAttribute("data-dateinfo") === startChoiceDt) {
                        rawdata.classList.remove("startDt");
                        rawdata.classList.add("startAdd");
                    } else if (rawdata.getAttribute("data-dateinfo") === endChoiceDt) {
                        rawdata.classList.add("lastAdd");
                    } else if (
                        new Date(rawdata.getAttribute("data-dateinfo")) > new Date(startChoiceDt) &&
                        new Date(rawdata.getAttribute("data-dateinfo")) < new Date(endChoiceDt)
                    ) {
                        rawdata.classList.add("range");
                    }
                }
            }
        }
    }

    console.log("시작일", startChoiceDt, "마지막일", endChoiceDt);

    //트립 중복일자 체크
    if (getTripInfoArr) {
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

    // 현재일자 체크
    if (viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
        for (let rawdate of document.getElementsByClassName("date")) {
            if (new Date(rawdate.getAttribute("data-dateinfo")).getDate() === today.getDate()) {
                rawdate.classList.add("today");
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

// 날짜 선택 또는 수정하기 함수
function selectChoiceDay(obj) {
    let udtToday = new Date();

    if (udtTripInfoArr) {
        if (new Date(udtStrDt).getDate() <= new Date(udtToday).getDate()) {
            udtChoiceDay(obj);
            return;
        } else {
            choiceDay(obj);
            return;
        }
    } else {
        choiceDay(obj);
    }
}

// 수정 트립일정 선택
function udtChoiceDay(obj) {
    let udtToday_1 = new Date();
    let formatUdstStartDay = new Date(startChoiceDt);
    let formatUdtEndDay = new Date(obj.dataset.dateinfo);
    formatUdstStartDay.setDate(formatUdstStartDay.getDate() + 30);

    if (getTripInfoArr === undefined || getTripInfoArr === null) {
        if (new Date(startChoiceDt) > new Date(obj.dataset.dateinfo)) {
            alert("이미 시작된 트립은 시작일은 수정 불가 입니다.");
            return;
        } else if (formatUdstStartDay.getTime() <= formatUdtEndDay.getTime()) {
            alert("최대 30일 입니다.");
            return;
        } else if (formatUdtEndDay.getDate() < udtToday_1.getDate()) {
            alert("현재 진행 중인 트립기간이 금일보다 적을 수 없습니다.");
            return;
        } else {
            endChoiceDt = obj.dataset.dateinfo;
            renderCalendar();
            return;
        }
    } else if (getTripInfoArr) {
        for (let i = 0; i < getTripInfoArr.length; i++) {
            if (new Date(startChoiceDt) <= new Date(getTripInfoArr[i].trip_start_dt) && formatUdtEndDay >= new Date(getTripInfoArr[i].trip_end_dt)) {
                alert("중복된 일정 입니다.");
                return;
            } else {
                if (new Date(startChoiceDt) > new Date(obj.dataset.dateinfo)) {
                    alert("시작일은 수정 불가 입니다.");
                    return;
                } else if (formatUdstStartDay.getTime() <= formatUdtEndDay.getTime()) {
                    alert("최대 30일 입니다.");
                    return;
                } else if (formatUdtEndDay.getDate() < udtToday_1.getDate()) {
                    alert("현재 진행 중인 트립기간이 금일보다 적을 수 없습니다.");
                    return;
                } else {
                    endChoiceDt = obj.dataset.dateinfo;
                    renderCalendar();
                    return;
                }
            }
        }
    }
}

// function udtChoiceDay_2(obj) {
//     let endDt = endChoiceDt;

//     // 역순으로 선택했을때
//     if (new Date(startChoiceDt) > new Date(obj.dataset.dateinfo)) {
//         let formatStrDt = new Date(obj.dataset.dateinfo);
//         let formatendDt = new Date(endChoiceDt);
//         formatStrDt.setDate(formatStrDt.getDate() + 30);
//         if (formatStrDt.getTime() <= formatendDt.getTime()) {
//             alert("최대 30일 입니다.");
//         } else if (getTripInfoArr) {
//             for (let i = 0; i < getTripInfoArr.length; i++) {
//                 if (
//                     new Date(obj.dataset.dateinfo) <= new Date(getTripInfoArr[i].trip_start_dt) &&
//                     new Date(endChoiceDt) >= new Date(getTripInfoArr[i].trip_end_dt)
//                 ) {
//                     alert("중복된 일정 입니다.");
//                     return;
//                 }
//             }
//         }
//         startChoiceDt = obj.dataset.dateinfo;
//         endChoiceDt = endDt;
//         renderCalendar();
//         return;
//     } else {
//         // 순서대로 선택했을때
//         let formatStrDt_1 = new Date(startChoiceDt);
//         let formatendDt_2 = new Date(obj.dataset.dateinfo);
//         formatStrDt_1.setDate(formatStrDt_1.getDate() + 30);
//         if (formatStrDt_1.getTime() <= formatendDt_2.getTime()) {
//             alert("최대 30일 입니다.");
//             return;
//         } else if (getTripInfoArr) {
//             for (let i = 0; i < getTripInfoArr.length; i++) {
//                 if (
//                     new Date(startChoiceDt) <= new Date(getTripInfoArr[i].trip_start_dt) &&
//                     new Date(obj.dataset.dateinfo) >= new Date(getTripInfoArr[i].trip_end_dt)
//                 ) {
//                     alert("중복된 일정 입니다.");
//                     return;
//                 }
//             }
//         }
//         endChoiceDt = obj.dataset.dateinfo;
//         renderCalendar();
//         return;
//     }
// }

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
                // startChoiceDt = null;
                // endChoiceDt = null;
                alert("최대 30일 입니다.");
                return;
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
                            // endChoiceDt = null;
                            // startChoiceDt = null;
                            alert("중복된 일정 입니다.");
                            return;
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
                // startChoiceDt = null;
                endChoiceDt = null;
                alert("최대 30일 입니다.");
                return;
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
                            // startChoiceDt = null;
                            alert("중복된 일정 입니다.");
                            return;
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
