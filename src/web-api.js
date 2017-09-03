import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';

@inject(HttpClient)
export class WebAPI {

  constructor(client) {
    let url = window.location.protocol + "//api." + window.location.host;
    client
      .configure(x => {
        x.withBaseUrl(url);
        //x.withHeader('Authorization', 'bearer 123');
      });
    this._client = client;
  }

  get isRequesting() {
    return this._client.isRequesting;
  }

  set isRequesting(bool) {
    this._client.isRequesting = bool;

    return this;
  }

  json(url) {
    return this._client.get(url);
  }
}
