import {inject} from 'aurelia-framework';
import {WebAPI} from '../web-api';

@inject(WebAPI)
export class ScraperService {

  constructor(api) {
    this._api = api;
  }

  getScrapers() {
    return this._api.json('/api/sources');
  }

  getScrape(source) {
    return this._api.json('/api/sources/' + source.name);
  }
}
