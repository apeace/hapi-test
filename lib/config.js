function env (name, required=true, dfault=undefined) {
  let val = process.env[name];
  if (required && val===undefined) {
    if (dfault !== undefined) {
      val = dfault;
    }
    else {
      throw new Error(`Missing environment variable ${name}`);
    }
  }
  return val;
}

module.exports = {
  port: env('PORT', true, 8000)
};
