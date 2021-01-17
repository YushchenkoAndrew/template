let numberClassifier;
let data = [];

function preload() {
  for (let i = 0; i < 10; i++) {
    data.push([]);
    for (let j = 0; j < 10; j++) {
      let index = `000${j + 1}`.slice(-4);
      data[i][j] = loadImage(`data/Handwriting-${i}-${index}.png`);
    }
  }
}

function setup() {
  createCanvas(400, 400);
  background(0);

  let options = {
    inputs: [28, 28, 4],
    task: "imageClassification",
    debug: true,
  };

  numberClassifier = ml5.neuralNetwork(options);

  for (let i in data) {
    for (let j in data[i]) numberClassifier.addData({ image: data[i][j] }, { label: i });
  }

  numberClassifier.normalizeData();

  numberClassifier.train({ epochs: 100, batchSize: 50 }, finishTraining);
}

function finishTraining() {
  console.log("Training Finished");
  numberClassifier.save();
}

function draw() {}
