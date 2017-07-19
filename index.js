/* eslint-disable no-underscore-dangle */

export default class ParseLoader {

  /**
   * @param {Parse.Query} query 
   * @param {number} limit 
   * @param {number} skip 
   */
  constructor(query, limit, skip) {
    this.query = query;
    this.limit = limit;
    this.skip = skip;

    this.executed = false;
    this._canLoadMore = true;
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
    if (!this.executed) {
      return true;
    }

    return this._canLoadMore;
  }


  /**
   * Returns the first result on the query given
   * @param {any} options
   * @return {Promise<Parse.Object>}
   */
  first(options = {}) {
    return new Promise((resolve, reject) => {
      this.query.find(options).then((result) => {
        this.executed = true;
        this._canLoadMore = !!result;
        resolve(result);
      }, reject);
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
          this.executed = true;
          this._canLoadMore = this.results.length === this.limit;
          resolve(results);
        }, reject);
    });
  }

  /**
   * Reloads the search for the current limit and skip
   * @return {Promise<Parse.Object[]>}
   */
  reload() {
    return this.find();
  }

  /**
   * Finds more elements for the query
   * @return {Promise<Parse.Object[]>}
   */
  findMore() {
    this.skip += this.limit;
    return this.find();
  }

  /**
   * Queries the Parse database, where each execution 
   * returns the next page of results
   * @return {Promise<Parse.Object[]>}
   */
  findInfinite() {
    if(this.executed) {
        this.skip += this.limit;
    }

    return this.find();
  }

  /**
   * Queries the Parse database, where each execution 
   * returns the next page of results
   * @return {Promise<Parse.Object[]>}
   */
  findNext() {
    if(this.executed) {    
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
    if(this.executed) {
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
