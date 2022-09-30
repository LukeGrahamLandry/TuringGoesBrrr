## turingcomplete.game

Super cool game that leads you through building a computer with different levels where you unlock each component by building it from previous ones. We use their save format for circuits so they can be imported. 

Helpfully they provide a library for parsing their save files: [save_monger](https://github.com/Stuffe/save_monger) ([License: CC0](https://github.com/Stuffe/save_monger/blob/ff830c5d215b5ca4614b692359c638be034f1c07/README.md#license)). save_monger gets compiled to JavaScript when this project is built 

save_monger uses suppersnappy ([License: MIT](https://github.com/Stuffe/save_monger/blob/ff830c5d215b5ca4614b692359c638be034f1c07/libraries/supersnappy/LICENSE)) which breaks when compiled to JavaScript so instead i use [snappyjs](https://github.com/zhipeng-jia/snappyjs) ([License: MIT](https://github.com/zhipeng-jia/snappyjs/blob/3ccc1b6cd959c8618f3dc943f296f9f5ba5ccaf9/LICENSE))