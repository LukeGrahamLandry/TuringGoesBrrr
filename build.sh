# install nim if not present. for cloudflare pages
if ! command -v nim &> /dev/null
then
    yes | (curl https://nim-lang.org/choosenim/init.sh -sSf | sh)
    export PATH=~/.nimble/bin:$PATH  # probably have to change for whatever linux cloudflare uses
    pip3 install markdown
fi

# create directory for third party libraries
cwd=$(pwd)
mkdir dist
mkdir dist/lib
cd dist/lib

# fetch library for reading Turing Complete game save files
git clone "https://github.com/LukeGrahamLandry/save_monger" turingcomplete
cd turingcomplete
nim js -d:release --hints:off save_monger.nim 
mv save_monger.js ../save_monger.js
cd ../
echo "/*\n Description: parses Turing Complete game save files \n Source: https://github.com/LukeGrahamLandry/save_monger \n License: CC0 \n*/\n" > save_monger.min.js
cat save_monger.js | npx terser --compress --mangle --toplevel >> save_monger.min.js

# fetch compression library used by save_monger
curl "https://raw.githubusercontent.com/zhipeng-jia/snappyjs/3ccc1b6cd959c8618f3dc943f296f9f5ba5ccaf9/dist/snappyjs.js" > snappyjs.js
echo "/*\n Description: reimplementation of Google's Snappy compression library \n Source: https://github.com/zhipeng-jia/snappyjs \n License: MIT, Copyright (c) 2016 Zhipeng Jia \n*/\n" > snappyjs.min.js
cat snappyjs.js | npx terser --compress --mangle --comments false >> snappyjs.min.js

# fetch json of turing complete component pin offsets 
echo "/*\n Description: turing complete component pin offsets  \n Source: https://github.com/MegaIng/turing-complete-interface \n License: MIT, Copyright (c) 2021 MegaIng \n*/\n" > tc_components.js
printf %s "window.TuringGoesBrrr.tc_components=" >> tc_components.js
curl "https://raw.githubusercontent.com/MegaIng/turing-complete-interface/7f79ca13e1965f7ac9c509437def57dc28d62303/turing_complete_interface/tc_components.json" >> tc_components.js

# compile main ts code
cd $cwd
npx webpack --config webpack.config.js
echo "/*\n Description: application logic for TuringGoesBrrr \n Source: N/A \n License: All Rights Reserved \n*/\n" > temp
cat dist/main.js >> temp
mv temp dist/main.js
cp index.html dist/index.html

# build markdown pages
mkdir dist/c
python3 md.py "docs" "dist/c/" true
