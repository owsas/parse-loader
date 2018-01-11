/* eslint-disable no-underscore-dangle */
class ParseLoader {

  query: any;
  limit: number;
  skip: number;
  _hadError: boolean;
  _canLoadMore: boolean;
  executedFind: boolean;
  executedFirst: boolean;

  /**
   * @param {Parse.Query} query 
   * @param {number} limit 
   * @param {number} skip 
   */
  constructor(query, limit = 10, skip = 0) {
    this.query = query;
    this.limit = limit;
    this.skip = skip;
    this._start();
  }

  _start() {
    this._canLoadMore = true;
    this._hadError = false;
    this.executedFind = false;
    this.executedFirst = false;
  }

  setQuery(q) {
    this.query = q;
  }

  setLimit(limit) {
    this.limit = limit;
  }

  setSkip(skip) {
    this.skip = skip;
  }

  /**
   * @return {boolean}
   */
  canLoadMore() {
    if (!this.executedFind) {
      return true;
    }

    return this._canLoadMore;
  }

  /**
   * Returns true if the loading had an error
   * @return {boolean}
   */
  hadError() {
    if (!this.executedFind && !this.executedFirst) {
      return false;
    }

    return this._hadError;
  }

  /**
   * Returns the first result on the query given
   * @param {any} options
   * @return {Promise<Parse.Object>}
   */
  first(options = {}) {
    return new Promise((resolve, reject) => {
      this.query.find(options).then((result) => {
        this.executedFirst = true;
        this._canLoadMore = !!result;
        resolve(result);
      }, e => {
        this._hadError = true;
        reject(e);
      });
    });
  }

  /**
   * Returns the first result on the query given
   * @param {any} options
   * @return {Promise<Parse.Object[]>}
   */
  find(options = {}) {
    return new Promise((resolve, reject) => {
      this.query
        .limit(this.limit)
        .skip(this.skip)
        .find(options).then((results) => {
          this.executedFind = true;
          this._canLoadMore = results.length === this.limit;
          resolve(results);
        },  e => {
          this._hadError = true;
          reject(e);
        });
    });
  }

  /**
   * Restarts skip in 0
   * @return {ParseLoader}
   */
  restart() {
    this.skip = 0;
    this._start();
    return this;
  }

  /**
   * Reloads the search for the current limit and skip
   * @return {Promise<Parse.Object[]>}
   */
  reload() {
    return this.find();
  }

  /**
   * Queries the Parse database, where each execution 
   * returns the next page of results
   * @return {Promise<Parse.Object[]>}
   */
  findNext() {
    if(this.executedFind && !this.hadError()) {
        this.skip += this.limit;
    }

    return this.find();
  }

  /**
   * Queries the Parse database, where each execution 
   * returns the previous page of results
   * @return {Promise<Parse.Object[]>}
   */
  findPrevious() {
    if(this.executedFind) {
      // set to 0 if skip is less than 0
      if(this.skip - this.limit < 0) {
        this.skip = 0;
      } else if(this.skip - this.limit >= 0) {
        this.skip -= this.limit;
      }
    }

    if(this.skip < 0) {
      this.skip = 0;
    }

    return this.find();
  }
}

module.exports = ParseLoader;
