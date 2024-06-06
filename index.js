// Imports
const jimp = require("jimp");
const ffmpeg = require("ffmpeg");
const fs = require("graceful-fs");
const lodash = require("lodash");
const path = require("path");
const videoshow = require("videoshow");
const Ffmpeg = require("fluent-ffmpeg");
//const inquirer = require("inquirer");

//import { stitchFramesToVideo } from ;
//const stitchFramesToVideo = require('./utils/stitchFramesToVideo.js')
const ffmpegStatic = require('ffmpeg-static');
//import ffmpegStatic from 'ffmpeg-static';
Ffmpeg.setFfmpegPath(ffmpegStatic);

// Promt User for Configuration
const videoInPath = "C:\\git\\BadAppleTeeth\\raw_video\\shortinput.mp4";
const videoOutPath = "C:\\git\\BadAppleTeeth\\cooked_video\\out.mp4";

const tooth_chance = 0.05;
const ms_delay = 6;

const frame_width = 1444;

const video_options = 
{
    fps: 35,
    transition: false,
    format: 'mp4'
}

// Teeth Path
const teeth_paths =
[
    "C:\\git\\BadAppleTeeth\\teeth\\example.png",
    "C:\\git\\BadAppleTeeth\\teeth\\0.png",
    "C:\\git\\BadAppleTeeth\\teeth\\1.png",
    "C:\\git\\BadAppleTeeth\\teeth\\2.png",
    "C:\\git\\BadAppleTeeth\\teeth\\3.png",
    "C:\\git\\BadAppleTeeth\\teeth\\4.png",
    "C:\\git\\BadAppleTeeth\\teeth\\5.png",
    "C:\\git\\BadAppleTeeth\\teeth\\6.png",
    "C:\\git\\BadAppleTeeth\\teeth\\7.png",
    "C:\\git\\BadAppleTeeth\\teeth\\7.png",
    "C:\\git\\BadAppleTeeth\\teeth\\9.png"
];

/*let framerate = 29.97003;
                    stitchFramesToVideo(
                        "C:\\git\\BadAppleTeeth\\cooked_frames\\%d.jpg",
                        "C:\\git\\BadAppleTeeth\\raudio\\raudio.mp3",
                        "C:\\git\\BadAppleTeeth\\cooked_video\\out.mp4",
                        framerate)*/

//Extract Frames From Input Video
try
{
    let process = new ffmpeg (videoInPath);

    process.then( (video) =>
    {
        video.fnExtractFrameToJPG( "C:\\git\\BadAppleTeeth\\raw_frames", 
        {
            every_n_frames : 1
        }).then(async (files, err) => 
        {
            await process_frames(err, files);

            video.fnExtractSoundToMP3("C:\\git\\BadAppleTeeth\\raudio\\raudio.mp3").then((ret) => 
            {
                fs.readdir("C:\\git\\BadAppleTeeth\\cooked_frames", (err, files) => 
                {
                    if(err)
                    {
                        return console.error(err);
                    }

                    let framerate = 29.97003;
                    stitchFramesToVideo(
                        "C:\\git\\BadAppleTeeth\\cooked_frames\\%d.jpg",
                        "C:\\git\\BadAppleTeeth\\raudio\\raudio.mp3",
                        "C:\\git\\BadAppleTeeth\\cooked_video\\out.mp4",
                        framerate)
                });
            }, (err) =>
            {
                console.error(err);
            });
        }, (err) =>
        {
            console.error(err);
        });

        


    }, (err) =>
    {
        console.error(err);
    } );

    
} catch (e)
{
    console.error(e);image.composite( src, x, y, [{ mode, opacitySource, opacityDest }] );     // composites another Jimp image over this image at x, y
}

//spread_frame("C:\\git\\BadAppleTeeth\\raw_frames\\cover5.jpg", teeth_paths, jimp.intToRGBA(0xFFFFFFFF), jimp.intToRGBA(0x444444FF), null, null, null, false);
//spread_frame("C:\\git\\BadAppleTeeth\\teeth\\credible.png", teeth_paths, jimp.intToRGBA(0xFFFFFFFF), jimp.intToRGBA(0x111111FF), null, null, null, false);
//spread_frame("C:\\git\\BadAppleTeeth\\teeth\\soy.png", teeth_paths, jimp.intToRGBA(0xFFFFFFFF), jimp.intToRGBA(0xDDDDDDFF), null, null, null, false);
//spread_frame("C:\\git\\BadAppleTeeth\\teeth\\tolg.png", teeth_paths, jimp.intToRGBA(0xFFFFFFFF), jimp.intToRGBA(0xDDDDDDFF), null, null, null, false);
//spread_frame("C:\\git\\BadAppleTeeth\\teeth\\riki.png", teeth_paths, jimp.intToRGBA(0xFFFFFFFF), jimp.intToRGBA(0x111111FF), null, null, null, false);


async function process_frames( err, files )
{
    if(err)
    {
        return console.error(err);
    }

    let total_frames = files.length;

    for(let i = 1; i < total_frames; ++i)
    {//console.log(`C:\\git\\BadAppleTeeth\\raw_frames\\shortinput_${i}.jpg`);
        await spread_frame(`C:\\git\\BadAppleTeeth\\raw_frames\\shortinput_${i}.jpg`, teeth_paths, jimp.intToRGBA(0xFFFFFFFF), jimp.intToRGBA(0x444444FF), null, null, null, i );
    }
}

async function spread_frame(frame_path, overlay_paths, top_color, bottom_color, mid_color, max_size, min_size, frame_idx)
{//console.log(frame_idx)
    let imgs = [];

    for(let i = 0; i < overlay_paths.length; ++i)
    {
        imgs.push(await jimp.read(overlay_paths[i]));
    }


    let background = await jimp.read("C:\\git\\BadAppleTeeth\\background.png");

    jimp.read(frame_path, (e, frame) =>
    {
        console.log(frame_path);

        if(e)
        {
            console.error(e);
        }

        let out_name = frame_idx;

        if(!frame_idx)
        {
            out_name = "out"
        }

        frame.scan(0, 0, frame.bitmap.width, frame.bitmap.height, (x, y, idx) =>
        {
            //if(x==0) console.log(y);
            if(frame.bitmap.width == frame_width)
            {///console.log("dhick")
                let color = jimp.intToRGBA( frame.getPixelColor(x, y) );

                if( color_subtract(color, bottom_color) >= 0 )
                {
                    //add_tooth(top_color, bottom_color, color, x, y, imgs, background);

                    let chance =  color_scale(top_color, bottom_color, color) * tooth_chance * tooth_chance;

                    if( Math.random() <= chance )
                    {
                        let tooth_idx = Math.floor(Math.random() * imgs.length);

                        //sleep(Math.floor(Math.random * ms_delay));

                        background.composite(imgs[tooth_idx], x-25, y-25);
                    }
                }

                if( x == frame.bitmap.width - 1 && y == frame.bitmap.height - 1 )
                {
                    //console.log(`width:${frame.bitmap.width}`)
                    //console.log(`all done! x:${x} y:${y}`);
                    background.write(`C:\\git\\BadAppleTeeth\\cooked_frames\\${out_name}.jpg`);
                }
            }

                
        });
    });
}

async function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function color_scale(top_color, bottom_color, input_color)
{
    let red_full = top_color.r - bottom_color.r;
    let green_full = top_color.g - bottom_color.g;
    let blue_full = top_color.b - bottom_color.b;

    let dRed = input_color.r - bottom_color.r;
    let dGreen = input_color.g - bottom_color.g;
    let dBlue = input_color.b - bottom_color.b;

    let pRed = dRed / red_full;
    let pGreen = dGreen / green_full;
    let pBlue = dBlue / blue_full;

    let pAvg = (pRed + pGreen + pBlue) / 3;

    return pAvg;
}

function color_subtract(first_color, second_color)
{
    let red_full = first_color.r - second_color.r;
    let green_full = first_color.g - second_color.g;
    let blue_full = first_color.b - second_color.b;

    let pAvg = (red_full + green_full + blue_full) / 3;

    return pAvg;
}

async function add_tooth(top_color, bottom_color, color, x, y, imgs, background)
{
    let chance =  color_scale(top_color, bottom_color, color) * tooth_chance * tooth_chance;

    if( Math.random() <= chance )
    {
        let tooth_idx = Math.floor(Math.random() * imgs.length);

        sleep(Math.floor(Math.random * ms_delay));

        background.composite(imgs[tooth_idx], x, y);
    }
}

async function stitchFramesToVideo(
    framesFilepath,
    soundtrackFilePath,
    outputFilepath,
    frameRate,
  ) {
  
    await new Promise((resolve, reject) => {
      Ffmpeg()
  
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