import debug from "debug";

const getLogger = (namespace) => debug(`chat:${namespace}`);

export default getLogger;
