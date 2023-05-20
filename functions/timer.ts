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

export function convertClockTextToTime<Number>(text: string) {
    let hours = Number(text.slice(0, 2));
    let minutes = Number(text.slice(2, 4));
    let seconds = Number(text.slice(-2));

    return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
}
