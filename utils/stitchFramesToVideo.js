//import ffmpeg from 'fluent-ffmpeg';
const ffmpeg = require('fluent-ffmpeg')

async function stitchFramesToVideo(
  framesFilepath,
  soundtrackFilePath,
  outputFilepath,
  frameRate,
) {

  await new Promise((resolve, reject) => {
    ffmpeg()

      // Tell FFmpeg to stitch all images together in the provided directory
      .input(framesFilepath)
      .inputOptions([
        // Set input frame rate
        `-framerate ${frameRate}`,
      ])

      // Add the soundtrack
      .input(soundtrackFilePath)

      .videoCodec('libx264')
      .outputOptions([
        // YUV color space with 4:2:0 chroma subsampling for maximum compatibility with
        // video players
        '-pix_fmt yuv420p',
      ])

      // Set the output duration. It is required because FFmpeg would otherwise
      // automatically set the duration to the longest input, and the soundtrack might
      // be longer than the desired video length
      //.duration(duration)
      // Set output frame rate
      .fps(frameRate)

      // Resolve or reject (throw an error) the Promise once FFmpeg completes
      .saveToFile(outputFilepath)
      .on('end', () => resolve())
      .on('error', (error) => reject(new Error(error)));
  });
}