
export const arrayToString = (array) => {
	return array.join();
}

export const stringToArray = (array) => {
    return array.split(',');
}

export const formatDataService = (data, email) => {
    let snapmailData = {};
    let subject       = email;
    let camera_exids  = arrayToString(data.camera_exids);
    let recipients    = arrayToString(data.recipients);
    let notify_days   = arrayToString(data.notify_days);
    let notify_time   = data.notify_time;
    snapmailData = {...snapmailData, camera_exids, recipients, subject, notify_days, notify_time};
    return snapmailData;
}

export const reformatDataService = (data) => {
    data.forEach( (d, i) => {
        let camera_ids    = stringToArray(d.camera_ids).sort();
        let camera_names  = stringToArray(d.camera_names);
        let recipients    = stringToArray(d.recipients);
        let notify_days   = stringToArray(d.notify_days);
        let notify_time   = d.notify_time;
        data[i] = {...data[i], camera_ids, camera_names, recipients, notify_days};
    });
    return data;
}

export const formatToReformatForApi = (data, email) => {
    let reformatData = {};
    reformatData.subject       = email;
    reformatData.camera_exids  = arrayToString(data.camera_ids);
    reformatData.recipients    = arrayToString(data.recipients);
    reformatData.notify_days   = arrayToString(data.notify_days);
    reformatData.notify_time   = data.notify_time;
    reformatData.timezone      = data.timezone;
    return reformatData;

}

export const getCameraNameArray = (cameras) => {
    let cameraNames = [];
    cameras.forEach( camera => {
        cameraNames.push({id:camera.id, url:camera.thumbnail_url});
    });
    return cameraNames;
}

export const reformatDataForEdit = async (data) => {
    data = data[0];
    let camera_exids  = stringToArray(data.camera_ids);
    let recipients    = stringToArray(data.recipients);
    let notify_days   = stringToArray(data.notify_days);
    let notify_time   = data.notify_time;
    let timezone      = data.timezone;

    data = { camera_exids, recipients, notify_days, notify_time, timezone};
    return data;
}