# install nim if not present. for cloudflare pages
if ! command -v nim &> /dev/null
then
    yes | (curl https://nim-lang.org/choosenim/init.sh -sSf | sh)
    export PATH=~/.nimble/bin:$PATH  # probably have to change for whatever linus cloudflare uses
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
echo "// Source: https://github.com/LukeGrahamLandry/save_monger \n" > save_monger.min.js
cat save_monger.js | npx terser --compress --mangle >> save_monger.min.js

# fetch compression library used by save_monger
curl "https://raw.githubusercontent.com/zhipeng-jia/snappyjs/3ccc1b6cd959c8618f3dc943f296f9f5ba5ccaf9/dist/snappyjs.js" > snappyjs.js
echo "// Source: https://github.com/zhipeng-jia/snappyjs \n" > snappyjs.min.js
cat snappyjs.js | npx terser --compress --mangle >> snappyjs.min.js

# compile main ts code
cd $cwd
npx npx webpack --config webpack.config.js
echo "// Source: TuringGoesBrrr \n" > temp
cat dist/main.js >> temp
mv temp dist/main.js
cp index.html dist/index.html
