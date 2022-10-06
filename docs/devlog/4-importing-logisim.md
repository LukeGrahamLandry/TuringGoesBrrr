# Importing .circ Save Files from Logisim (DEV LOG 4)

## Library attempt

October 4

I found something on npm that claims to parse and simulate logisim .circ files: https://github.com/DLii-Technologies/logisim-emulator  

But I kinda want to write the simulation part myself for fun and it turns out .circ files are just xml that I can parse myself fairly easily. So I wasted some time getting the library to run in my environment but I won't be using it. 

### Bundle Splitting 

I don't like that the giant npm package gets bundled into the same main.js as my code. This part of webpack.config.js lets me split all my npm packages into lib/vendor.js and keep my code separate.

```javascript
{
    // ...
    optimization: {
        // ...
        minSize: 0,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'lib/vendor',
                    chunks: 'all'
                }
            }
        },
        // ...
    },
    output: {
        filename: '[name].js',
        // ...
    }
}
```

### polyfills 

Polyfills let you add code to reimplement node apis or newer browser apis when running on older browsers. When trying to build the project, webpack gives me a bunch of errors for node apis that would be missing and offers that i could add polyfills to replace them. Just have to npm install something and then tell webpack which package maps to each missing api.

```javascript
resolve: {
    // ...
    fallback: { 
      "timers": require.resolve("timers-browserify"),  
      "assert": require.resolve("assert/"), 
      "string_decoder": require.resolve("string_decoder/"),
      "buffer": require.resolve("buffer/"),
      "stream": require.resolve("stream-browserify")
    }
  },
```

### Uncaught ReferenceError: process is not defined

The package is expecting to be run in node.js which gives you a `process` object with some environment variables (doesn't exist in the browser). Webpack can export values for any that it tries to reference. 

```javascript
const webpack = require('webpack');
// ...
plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
],
```

### missing package

The package depends on `fs` from npm which doesn't exist anymore, it's npm page is just "Security holding package". 

It seems like `fs` just helped you interact with the file system from node.js but since I want it to run in the browser I'd have to do that differently anyway. So I went into `logisim-emulator/dist/parser/index.js` and deleted the `require(fs)` and methods that read files for you (leaving the one that just parses an xml string). I'd have to fork `logisim-emulator` to keep these changes. 

## Parsing XML

logisim .circ files are just XML structured as follows.

```
main name="main"
circuit name="main"
    - comp loc="(x, y)" name="Gate Type"
    - comp loc="(x, y)" name="Gate Type"
    - wire from="(x, y)" to="(x, y)"
    - wire from="(x, y)" to="(x, y)"
```

There's a bunch of extra info about your GUI settings as well that i don't care about right now. 

```
- toolbar: a list of different tools and components you placed recently
- mappings: kind binds to tools 
- lib[]: associates names of groups with numbers that are referenced in lib attribute of components and tools
- options
    - gateundefined
    - simlimit
    - simrand: perhaps a seed to use for random number generation
```

## wires

from and to positions as attributes on the tag

## components

position and name of component as attributes on the tag

## Refactor Files UI Code

Now that I support multiple file formats it makes sense to generify some of the UI code for importing and saving to local storage.   

define a class for file formats 
that knows extensions and has a method that maps a data string to a circuit object


## Display Site Version

using `git rev-parse HEAD` to get the hash of the last commit and displaying that on the website so you can see what version is running. 
