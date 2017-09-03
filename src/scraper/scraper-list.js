import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {WebAPI} from '../web-api';
import {ScraperService} from './scraper-service';

@inject(WebAPI, EventAggregator, ScraperService)
export class ScraperList {
  constructor(api, ea, scraperService) {
    this._api = api;
    this.ea = ea;
    this._scraperService = scraperService;

    this.isScraping = {};
    this.scrapers = [];
  }

  created() {
    this._scraperService.getScrapers().then(r => {
      this.scrapers = JSON.parse(r.response);
    })
  }

  scrape(source) {
    this.isScraping[source.name] = true;
    this._scraperService.getScrape(source).then(r => {
      let scraped = JSON.parse(r.response);
      source.files.unshift(scraped.files[0]);

      this.isScraping[source.name] = false;
      //this.scrapers.push(scraped.files.shift());
      //this.routeConfig.navModel.setTitle(contact.firstName);
      //this.originalContact = JSON.parse(JSON.stringify(contact));
      //this.ea.publish(new ContactUpdated(this.contact));
    });
  }


}