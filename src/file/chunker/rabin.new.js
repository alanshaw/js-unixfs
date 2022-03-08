import * as API from "./api.js"
import * as Rabin from "rabin-rs"

const AVARAGE = 262144
const WINDOW = 16

/**
 * @typedef {object} Config
 * @property {number} avg
 * @property {number} min
 * @property {number} max
 * @property {number} window
 *
 * @typedef {Rabin.Rabin} Context
 */

/**
 *
 * @returns {Config}
 */
export const defaults = () => configure({ avg: AVARAGE })

/**
 * @param {number} avg
 * @returns {RabinConfig}
 */

/**
 *
 * @param {Partial<Config> & {avg: number}} config
 * @returns
 */
export const configure = ({
  avg,
  min = (avg / 3) | 0,
  max = (avg + avg / 2) | 0,
  window = WINDOW,
}) => ({
  avg,
  min,
  max,
  window,
})

/**
 * @param {Config} config
 * @returns {Promise<API.StatelessChunker<Context>>}
 */
export const create = async (config = defaults()) => ({
  type: "Stateless",
  context: await Rabin.create(
    Math.floor(Math.log2(config.avg)),
    config.min,
    config.max,
    config.window
  ),
  cut,
})

/**
 * @param {BigInt} polynom
 * @param {Config} config
 * @returns {Promise<API.StatelessChunker<Context>>}
 */
export const createWithPolynom = async (polynom, config = defaults()) => ({
  type: "Stateless",
  context: Object.assign(
    await Rabin.createWithPolynom(
      polynom,
      Math.floor(Math.log2(config.avg)),
      config.min,
      config.max,
      config.window
    ),
    config
  ),
  cut,
})

/**
 * @param {Context} rabin
 * @param {Uint8Array} buffer
 * @param {boolean} end
 */
export const cut = (rabin, buffer, end) => Rabin.cut(rabin, buffer, end)
