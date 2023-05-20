export function convertSecondsToClockText<String>(time: number) {
    time = Math.round((time) / 10) / 100;

    let hours = Math.floor(time / 3600);
    let minutes = Math.floor(time % 3600 / 60);
    let seconds = Math.ceil(time % 60);

    let hoursText = String(hours).padStart(2, '0');
    let minutesText = String(minutes).padStart(2, '0');
    let secondsText = String(seconds).padStart(2, '0');

    return hoursText + minutesText + secondsText;
}

function convertTextToTime() {

}