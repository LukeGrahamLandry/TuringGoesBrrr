# TuringGoesBrrr Build Scripts

Several small scripts are used to automate the site's build process. They must be able to run remotely on cloudflare pages and locally on Mac OS. Python scripts should work on version 3.7 and have any packages declared in `../requirements.txt`

## build.sh

- install the Nim compiler
- copy all files from the `static` directory to the `dist` directory (which will be exposed by the web server)
- fetch https://github.com/LukeGrahamLandry/save_monger
    - the library used to read Turing Complete save files
    - compile the Nim project to JavaScript
- fetch https://github.com/zhipeng-jia/snappyjs
    - the compression library that save_monger requires 
- fetch https://github.com/MegaIng/turing-complete-interface
    - the pin offset positions for Turing Complete components
- build the TypeScript in `src` with Webpack
- add the commit hash to `circuit.js` (to display in UI) and `service-worker.js` (to force update)
- minimize JavaScript files and add license headers
- run `md.py` and `cloudflare.py`

## md.py

Builds the markdown files from the `docs` directory into html files in the `dist` directory. Files without the `.md` extension are ignored. 

### Command Line Arguments

1. input directory (md files)
2. output directory (html files)
3. url prefix to use for canonical meta tags 
4. include `./README.md` (true or false)

## cloudflare.py

Uses Cloudflare's API to fetch the list of previous deployments. Using `static/versions.html` as a template, generates a table of (Commit Message, Commit Hash, Date, Url) so users can access old versions. 

### Command Line Arguments

1. template html file path, the generated code replaces "TABLE"
2. output file path
3. github project identifier: UserName/RepoName

### Environment Variables

- CLOUDFLARE_PAGES_PROJECT_NAME
- CLOUDFLARE_ACCOUNT_ID
- CLOUDFLARE_API_TOKEN
    - requires the permission (Account - Cloudflare Pages - Read)
