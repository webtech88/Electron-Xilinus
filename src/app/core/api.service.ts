import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

const API_URL = "http://10.12.181.210:9200";

@Injectable()
export class APIService {
  constructor(private http: Http) { }

  getDiagramData() {
    const testBody = {
      "size": 0,
      "query": {
        "bool": {
          "must": [
            {
              "terms": {
                "direction.raw": [
                  "OUTGOING"
                ]
              }
            }
          ]
        }
      },
      "aggs": {
        "terms": {
          "terms": {
            "field": "destination_ip.raw",
            "size": 100
          },
          "aggs": {
            "bytes": {
              "sum": {
                "field": "size"
              }
            },
            "top_hit": {
              "top_hits": {
                "_source": {
                  "includes": [
                    "networkType"
                  ]
                },
                "size": 1
              }
            }
          }
        }
      }
    };

    return this.http.post(`${API_URL}/404_netflow/_search `, testBody)
      .map(res => res.json());
  }
}