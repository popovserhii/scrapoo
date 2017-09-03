class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }
    // or maybe test typeof this.method === undefined

    /**
     * Set/get imported source name
     *
     * Can be file name, api url or other value to source
     *
     * @param string|null $name
     * @return string|self
     */
    if (this.source === 'function') {
      throw new TypeError('Must override method "source(name)"');
    }

    /**
     * Get first column
     *
     * @return int
     */
    if (this.firstColumn === 'function') {
      throw new TypeError('Must override method "firstColumn()"');
    }

    /**
     * Get last column
     *
     * @return int
     */
    if (this.lastColumn === 'function') {
      throw new TypeError('Must override method "lastColumn()"');
    }

    /**
     * Get first row
     *
     * @return int
     */
    if (this.firstRow === 'function') {
      throw new TypeError('Must override method "firstRow()"');
    }

    /**
     * Get last row
     *
     * @return int
     */
    if (this.lastRow === 'function') {
      throw new TypeError('Must override method "lastRow()"');
    }

    /**
     * Read cell
     *
     * @param int $row
     * @param int $column
     * @return mixed Return cell value
     */
    if (this.read === 'function') {
      throw new TypeError('Must override method "read(row, column)"');
    }

    /**
     * Get configuration array
     *
     * @return array
     */
    //if (this.config === 'function') {
    //  throw new TypeError('Must override method "config()"');
    //}
  }
}

module.exports = Abstract;