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
    if (this._config === 'function') {
      throw new TypeError('Must override method "source(name)"');
    }

    /**
     * Set/get current sheet
     *
     * In most cases it is tabs from excel in other cases it was only one sheet
     *
     * @param string $name
     * @return string|self
     */
    if (this.sheetName === 'function') {
      throw new TypeError('Must override method setter/getter "sheet()"');
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
     * Get all rows
     *
     * @return array Return collection of plain (json) objects
     */
    if (this.rows === 'function') {
      throw new TypeError('Must override method "rows()"');
    }

    /**
     * Get all indexes of rows
     *
     * If "index" config set to field name then all rows will be indexed by this value
     *
     * @return array Return plain (json) object where property name is field value and property value is index of row
     */
    if (this.index === 'function') {
      throw new TypeError('Must override method "index()"');
    }

    /**
     * Get configuration array
     *
     * @return array
     */
    if (this.config === 'function') {
      throw new TypeError('Must override method "config()"');
    }
  }
}

module.exports = Abstract;