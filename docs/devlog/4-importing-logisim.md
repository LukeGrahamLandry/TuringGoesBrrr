# Importing .circ Save Files from Logisim (DEV LOG 4)

## Library attempt

found on npm: https://github.com/DLii-Technologies/logisim-emulator

but i really dont think theres any point cause its kinda just a wrapper of an xml parser.
after messing with the library a bit i looked at a .circ and i can interpret whats going on pretty easily i think
so these are what i did to get the library to compile but im just going to write it myself

### Bundle

this part of webpack.config.js lets me split all my npm packages into vendor.js and keep my code separate in main.js

```javascript
{
    // ...
    optimization: {
        // ...
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
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

trying to webpack build gives a bunch of errors that i think are like it saying theres specific packages that browsers sometimes provide that i have to explicitly give it permission 
https://webpack.js.org/guides/shimming/
for each error i npm install and add to webpack

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

### missing package

it depends on `fs` from npm which doesn't exist anymore.
so i went into `logisim-emulator/dist/parser/index.js` and deleted the part that calls that because i can read the files myself. that package was only meaningful for node where it could access the file system anyway
would have to fork it at some point

## Parsing XML

logisim .circ files are just XML structured as follows

```
circuit name="main"
    - comp loc="(x, y)" name="Gate Type"
    - comp loc="(x, y)" name="Gate Type"
    - wire from="(x, y)" to="(x, y)"
    - wire from="(x, y)" to="(x, y)"
```

There's a bunch of extra info about your GUI settings as well that i don't care about right now. 

```
- main name="main": which circuit to show on import i assume
- toolbar: a list of different tools and components you placed recently
- mappings: kind binds to tools 
- lib[]: associates names of groups with numbers that are referenced in lib attribute of components and tools
- options
    - gateundefined
    - simlimit
    - simrand: perhaps a seed to use for random number generation
```

## wires


## components

