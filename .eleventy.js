const Vibrant = require('node-vibrant');

const keys = {
  vibrant: 'Vibrant',
  muted: 'Muted',
  darkvibrant: 'DarkVibrant',
  darkmuted: 'DarkMuted',
  lightvibrant: 'LightVibrant',
  lightmuted: 'LightMuted',
}

/**
 *
 * @param {string} value Path to image
 * @param {string | readonly string[]} swatches List of swatches to return.
 * First defined swatch is returned.
 * List is case-insensitive.
 */
async function vibrantFilter(value, swatches) {
  if (typeof swatches === 'string') {
    swatches = [swatches];
  }

  const palette = await Vibrant.from(value).getPalette();
  if (Array.isArray(swatches)) {
    for (const swatchName of swatches) {
      const swatch = palette[keys[swatchName.toLowerCase()]];
      if (swatch) {
        return swatch.hex;
      }
    }
    return undefined;
  } else {
    return palette;
  }
}

module.exports = {
  initArguments: {},
  configFunction(eleventyConfig) {
    eleventyConfig.addNunjucksAsyncFilter('vibrant', (value, swatches, callback) => {
      vibrantFilter(value, swatches).then(result => callback(null, result)).catch(err => callback(err));
    });
  }
};
