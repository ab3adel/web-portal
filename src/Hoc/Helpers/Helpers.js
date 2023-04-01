export function toFormBody( query ) {
    var formBody = [];
    for (var property in query) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(query[property]);
    formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    return formBody;
}

export function checkMediaType(file) {
    const  fileType = file['type']
    // const validMediaTypes = ['image/gif', 'image/jpeg', 'image/png', 'video/mp4', 'video/ogg']
    // if (!validMediaTypes.includes(fileType)) {
    //     return false
    // }
    if(fileType.split('/')[0] === 'video'){
        return 'video'
    } else if(fileType.split('/')[0] === 'image'){
        return 'image'
    }
    return false
}

export function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}