class MemoryRepo {

  constructor (name) {
    this.name = name;
    this._data = [];
    this._id = 0;
  }

  create (obj) {
    this._id++;
    let newObj = {id: this._id};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = obj[key];
      }
    }
    this._data.push(newObj);
    return Promise.resolve(newObj);
  }

  get (id) {
    for (let obj of this._data) {
      if (obj.id === id) {
        return Promise.resolve(obj);
      }
    }
    return Promise.resolve(null);
  }

  list (params) {
    return Promise.resolve(this._data);
  }

}

module.exports.MemoryRepo = MemoryRepo;
