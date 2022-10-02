import client from './client';

const endpoint = '/positions?timestamps=';

//Obtener los ultimos 60 min
var timestamp = ~~(new Date().getTime() / 1000);
const times = [];
for (let i = 0; i < 40; i++) {
    times.push(timestamp);
    timestamp = timestamp - 120;
}

const getIssPath = async () => await client.get(endpoint + times.toString());

const opIssPath = { getIssPath };

export default opIssPath;
