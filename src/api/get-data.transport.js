const endpoint = `https://pristine-kobuk-valley-96802.herokuapp.com`;

export class GetDataTransport {
  static getData(type, start, end) {
    return fetch(`${endpoint}/${type}?start=${start}&end=${end}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((response) => response.data)
      .catch(console.error);
  }
}
