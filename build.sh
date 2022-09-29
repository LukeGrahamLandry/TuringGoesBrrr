# create directory for third party libraries
cwd=$(pwd)
mkdir out
mkdir out/lib
cd out/lib
echo "third party libraries, see credits.md for more info" > readme.txt

# fetch and compile library for reading Turing Complete game save files
git clone https://github.com/LukeGrahamLandry/save_monger turingcomplete
cd turingcomplete
nim js -d:release save_monger.nim 
mv save_monger.js ../save_monger.js

# fetch compression library used by save_monger
cd $cwd
cd out/lib
curl "https://raw.githubusercontent.com/zhipeng-jia/snappyjs/3ccc1b6cd959c8618f3dc943f296f9f5ba5ccaf9/dist/snappyjs.js" > snappyjs.js

# compile main ts code
cd $cwd
npx tsc
