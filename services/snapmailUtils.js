
export const arrayToString = (array) => {
	return array.join();
}

export const stringToArray = (array) => {
    return array.split(',');
}

export const formatToString = (data, email) => {
    let snapmailData = {};
    let subject       = email;
    let camera_exids  = data.camera_exids !== null ? arrayToString(data.camera_exids) : '';
    let recipients    = data.recipients   !== null ? arrayToString(data.recipients)   : '';
    let notify_days   = data.notify_days  !== null ? arrayToString(data.notify_days)  : '';
    let notify_time   = data.notify_time;
    snapmailData = {...snapmailData, camera_exids, recipients, subject, notify_days, notify_time};
    return snapmailData;
}

export const formatToArray = (data) => {
    data.forEach( (d, i) => {
        let camera_ids    = d.camera_ids   !== null ? stringToArray(d.camera_ids).sort() : '';
        let camera_names  = d.camera_names !== null ? stringToArray(d.camera_names)      : '';
        let recipients    = d.recipients   !== null ? stringToArray(d.recipients)        : '';
        let notify_days   = d.notify_days  !== null ? stringToArray(d.notify_days)       : '';
        let notify_time   = d.notify_time;
        data[i] = {...data[i], camera_ids, camera_names, recipients, notify_days};
    });
    return data;
}

export const formatApiToString = (data, email) => {
    let reformatData = {};
    reformatData.subject       = email;
    reformatData.camera_exids  = data.camera_ids  !== null ? arrayToString(data.camera_ids)  : '';
    reformatData.recipients    = data.recipients  !== null ? arrayToString(data.recipients)  : '';
    reformatData.notify_days   = data.notify_days !== null ? arrayToString(data.notify_days) : '';
    reformatData.notify_time   = data.notify_time;
    reformatData.timezone      = data.timezone;
    return reformatData;

}

export const getCameraNames = (cameras) => {
    let cameraNames = [];
    cameras.forEach( camera => {
        cameraNames.push({id:camera.id, url:camera.thumbnail_url});
    });
    return cameraNames;
}

export const formatEditRequestToString = async (data) => {
    data = data[0];
    let camera_exids  = data.camera_ids  !== null ? stringToArray(data.camera_ids)  : '';
    let recipients    = data.recipients  !== null ? stringToArray(data.recipients)  : '';
    let notify_days   = data.notify_days !== null ? stringToArray(data.notify_days) : '';
    let notify_time   = data.notify_time;
    let timezone      = data.timezone;

    data = { camera_exids, recipients, notify_days, notify_time, timezone};
    return data;
}