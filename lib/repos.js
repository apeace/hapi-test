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
    let data = this._data.filter(obj => {
      for (let key in params) {
        if (obj[key] !== params[key]) return false;
      }
      return true;
    });
    return Promise.resolve(data);
  }

  update (id, params) {
    params.id = id;
    let newData = [];
    for (let data of this._data) {
      if (data.id === id) {
        newData.push(params);
      } else {
        newData.push(data);
      }
    }
    this._data = newData;
    return Promise.resolve(params);
  }

  remove (id) {
    this._data = this._data.filter(obj => obj.id !== id);
    return Promise.resolve(true);
  }

}

module.exports.MemoryRepo = MemoryRepo;
