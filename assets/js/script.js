$(document).ready(function() {



    //---------------------Define Variables --------------//


    const speedOfSound = 344; //speed of sound in air in meters per second (21 degrees celsius)
    const wavelengthConstant = 1.059463; //multiplier to be used for calculating frequencies/wavelengths relative to the next frequency/wavelength 
    const baseWavelength = 24.94545455; // base wavelength to be used to fill [wavelengths] array - this corresponds to the first "A note" below the threshold of human hearing  

    const noteNames = ["A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab"];
    let dimensions = []; //dimensions array - replace with user input
    let frequencies = [];
    let notes = [];
    let wavelengths = [baseWavelength];

    //return the dimensions of drawing area for currently selected 
    let drawAreaHeight = $("#drawingArea").height();
    let drawAreaWidth = $("#drawingArea").width();



    //return the array of wavelengths corresponding to musical notes in range
    function generateWavelengths() {
        for (i = 1; i < 100; i++) {
            wavelengths.push(wavelengths[i - 1] / wavelengthConstant);
        }
    }
    generateWavelengths();






    //--------------------------Input Functions-----------//


    //On submit the inputs will be assigned to the dimension boxes and [dimensions] array

    $("#submitBtn").on("click", addDimensions);

    function addDimensions() {

        //change input values to numbers
        let xIn = parseFloat($("#xInput").val());
        let yIn = parseFloat($("#yInput").val());
        let zIn = parseFloat($("#zInput").val());

        if (isNaN(xIn) === true || isNaN(yIn) === true || isNaN(zIn) === true ||
            xIn <= 0 || yIn <= 0 || zIn <= 0) {
            invalidDimensionsError();
        }

        else {

            //Remove "d-none" class from svg elements"
            $(".line").removeClass("d-none");

            dimensionOutputs(xIn, yIn, zIn); // call function to fill the output display on left
            drawRoom(xIn, yIn, zIn); // call function to draw the room

            $("#dimensionForm").trigger("reset");
        }
    }

    //blur Function
    $(".input-box").blur(blurFunc)

    function blurFunc() {
        if (isNaN($(this).val()) || $(this).val() <= 0) {
            invalidDimensionsError();
            $(".input-box").attr("disabled", true);
            $("#dimensionForm").trigger("reset");
        }
    }



    //Error to display if invalid dimensions are entered
    function invalidDimensionsError() {
        $("#dimensionsError").show();
        //Dismiss error on click of X
        $("#dismissError").click(function() {
            $("#dimensionsError").hide();
            $(".input-box").attr("disabled", false);
        });


    }



    //calculate frequency based on dimension
    function freqCalc(dimen) {
        return Math.round(speedOfSound / dimen);
    }


    //function to display dimension outputs
    function dimensionOutputs(x, y, z) {

        //Dimension outputs
        //clear dimensions array and push user inputs to dimensions array 
        dimensions.length = 0;
        dimensions.push(x, y, z);

        $("#titleLen").text(`Length: ${x}m`);
        $("#titleWid").text(`Width: ${y}m`);
        $("#titleHei").text(`Height: ${z}m`);



        //Frequencies outputs
        frequencies = dimensions.map(freqCalc);

        $("#freqLen").text(`Frequency: ${frequencies[0]}Hz`);
        $("#freqWid").text(`Frequency: ${frequencies[1]}Hz`);
        $("#freqHei").text(`Frequency: ${frequencies[2]}Hz`);


        //Notes outputs
        notes = dimensions.map(notesCalc);
        $("#noteLen").text(`Note: ${notes[0]}`);
        $("#noteWid").text(`Note: ${notes[1]}`);
        $("#noteHei").text(`Note: ${notes[2]}`);

    }


    // Determine the closest musicalnote based on the room dimension (wavelength);
    function notesCalc(dimen) {
        //Generate array whoch subtracts the room dimension from the wavelengths array

        let compareArray = wavelengths.map(n => n - dimen);


        // find first wavelength with a negative value and last wavelength with positive value in compareArray
        // whichever of these wavelengths is closest to zero corresponds to the wavelngth of the closest musical note

        let firstNegative = compareArray.find(findNegative);
        let firstNegativeIndex = compareArray.indexOf(compareArray.find(findNegative)); //find the index of the first item in compareArray with a negative value 
        let lastPositiveIndex = firstNegativeIndex - 1; //get last item in compareArray with positive value
        let lastPositive = compareArray[lastPositiveIndex];


        function findNegative(n) {
            return n <= 0;
        }
        let noteIndex;
        if (Math.abs(firstNegative) < Math.abs(lastPositive)) {
            noteIndex = firstNegativeIndex;
        }
        else {
            noteIndex = lastPositiveIndex;
        }
        let noteOutput;
        //Lookup up the correct note from noteNames array 
        if (noteIndex < 12) {
            noteOutput = noteNames[noteIndex];
        }
        else {
            noteOutput = noteNames[noteIndex % 12];
        }
        return noteOutput;
    }


    //------------------------------------- Modal -----------------------------//
    $("#showExplainer").click(function() {
        $("#explainerModal").removeClass("d-none");
    });


    $("#modalDismiss").click(function() {
        $("#explainerModal").addClass("d-none");
    });

    //------------------------------------- Display Functions -----------------//



    function drawRoom(xDim, yDim, zDim) {
        //If the z-axis is equal to or larger than other x-axes the room will be
        //too large for the drawing area. This derives a scale to reduce the overall size
        //derive the  to maximise diagram size based on room x-axis and y-axis

        //Remove the sine wave if it was previously on screen  
        $("#sineWave").attr({ d: "" });

        let baseProportion;
        let scaleQ = xDim + yDim;
        if (Math.max(...dimensions) === zDim) {
            baseProportion = Math.round(drawAreaHeight / scaleQ) * 0.8;
        }
        else {
            baseProportion = Math.round(drawAreaWidth / scaleQ) * 0.8;
        }

        let posQ = drawAreaWidth / (xDim + yDim) * xDim; //x position of origin is based on length of x-axis (red)


        //lengths Are dimension * baseProportion * value in [dimensions] array
        let xLength = Math.round(baseProportion * xDim);
        let yLength = Math.round(baseProportion * yDim);
        let zLength = Math.round(baseProportion * zDim);



        //set origin point - the point where the three main axes meet
        // Test with one third from left [x,y] and 90% from top
        let originX = Math.round(posQ);
        let originY = Math.round(drawAreaHeight) - zLength;
        let angleUp = Math.round(drawAreaHeight * 0.1); //angle x and y axes up by 10% draw area height


        //---------------------------------------------------------------------//



        //Draw main, coloured axes
        $("#xAxis").attr({
            x1: originX,
            y1: originY,
            x2: originX - xLength,
            y2: originY - angleUp

        });
        $("#yAxis").attr({
            x1: originX,
            y1: originY,
            x2: originX + yLength,
            y2: originY - angleUp

        });
        $("#zAxis").attr({
            x1: originX,
            y1: originY,
            x2: originX,
            y2: originY + zLength

        });


        //Draw background, grey axes

        $("#backPath").attr("d", `M ${originX - xLength},${originY - angleUp} 
                           v${zLength}
                           l${xLength}, ${angleUp}
                           l${yLength}, ${-angleUp}
                           v${-zLength}
                           l${-xLength}, ${-angleUp}
                           l${-yLength}, ${angleUp}
                  
        `);






        // Animate --------------------------- //

        //Main axes
        xAxisDraw();
        yAxisDraw();
        zAxisDraw();

        //Animate drawing of x-axis
        function xAxisDraw() {
            let posX = originX;
            let posY = originY;
            let id = setInterval(frame, 0.1);

            function frame() {
                if (posX == originX - xLength) {
                    clearInterval(id);
                }
                else {
                    posX--;
                    posY--;
                    $("#xAxis").attr("x2", posX);
                }
            }
        }


        //Animate drawing of y-axis
        function yAxisDraw() {
            let pos = originX;
            let id = setInterval(frame, 0.1);

            function frame() {
                if (pos == originX + yLength) {
                    clearInterval(id);
                }
                else {
                    pos++;
                    $("#yAxis").attr("x2", pos);
                }
            }
        }


        //Animate drawing of z-axis
        function zAxisDraw() {
            let pos = originY;
            let id = setInterval(frame, 0.1);

            function frame() {
                if (pos == originY + zLength) {
                    clearInterval(id);
                }
                else {
                    pos++;
                    $("#zAxis").attr("y2", pos);
                }
            }
        }
    }





    // -------------------------- Axes Focus ---------------------//

    $(".dim-button").on("click", axisFocus);

    function axisFocus() {

        initialiseAxisFocus();

        //variables for drawing sine waves
        let xStart = drawAreaWidth * 0.1;
        let yStart = drawAreaHeight * 0.1;
        let xEnd = drawAreaWidth * 0.9;
        let yEnd = drawAreaHeight * 0.9;
        let xSize = drawAreaWidth - (xStart * 2); // multiply by two so that is xStart changes length remains centered
        let ySize = drawAreaHeight - (yStart * 2); // multiply by two so that is xStart changes length remains centered
        let xHalf = xStart + xSize / 2;
        let yHalf = yStart + ySize / 2;
        let xControl = xSize / 4;
        let yControl = ySize / 4;

        if ($(this).attr("id") === "lenBtn") {
            xAxisFocus();
        }
        else if ($(this).attr("id") === "widBtn") {
            yAxisFocus();
        }
        else if ($(this).attr("id") === "heiBtn") {
            zAxisFocus();
        }


        //View the x-axis only
        function xAxisFocus() {

            //Draw x-axis on left side  of screen
            $("#xAxis").attr({
                x1: drawAreaWidth * 0.1,
                y1: drawAreaHeight * 0.1,
                x2: drawAreaWidth * 0.1,
                y2: drawAreaHeight * 0.9
            });

            $("#xAxis").removeClass("d-none");


            //Draw Sine Wav
            $("#sineWave").attr({
                d: `M${xStart} ${yHalf}  
                Q ${xStart + xControl} ${yStart}, ${xHalf} ${yHalf} 
                Q ${xHalf + xControl} ${yEnd}, ${xEnd} ${yHalf} Z`
            });
        }


        //View the y-axis only
        function yAxisFocus() {


            //Draw y-axis on right side of screen
            $("#yAxis").attr({
                x1: drawAreaWidth * 0.9,
                y1: drawAreaHeight * 0.1,
                x2: drawAreaWidth * 0.9,
                y2: drawAreaHeight * 0.9
            });

            $("#yAxis").removeClass("d-none");


            //Draw Sine Wav
            $("#sineWave").attr({
                d: `M${xStart} ${yHalf}  
                Q ${xStart + xControl} ${yStart}, ${xHalf} ${yHalf} 
                Q ${xHalf + xControl} ${yEnd}, ${xEnd} ${yHalf} Z`
            });
        }

        //View the z-axis only
        function zAxisFocus() {

            $("#zAxis").attr({
                x1: drawAreaWidth * 0.1,
                y1: drawAreaHeight * 0.1,
                x2: drawAreaWidth * 0.9,
                y2: drawAreaHeight * 0.1
            });

            $("#zAxis").removeClass("d-none"); // Show z-axis

            //Draw Sine Wav
            $("#sineWave").attr({
                d: `M${xHalf} ${yStart}  
                Q ${xStart} ${yStart + yControl}, ${xHalf} ${yHalf} 
                Q ${xEnd} ${yHalf + yControl}, ${xHalf} ${yEnd} Z`
            });
        }

        function initialiseAxisFocus() {
            $(".line").addClass("d-none");
            $("#sineWave").attr({ d: "" }); //clear the sine wav from screen
        }

    }






    //---------------------------Audio Code  ---------------------//

    //Establish the audio context
    let audioCtx = new(window.AudioContext);
    let sound = audioCtx.createOscillator();
    let volume = audioCtx.createGain();
    sound.start();

    $(".play-button").click(playBtnActions);




    function playBtnActions() {
        let freqIndex = parseInt($(this).attr("id").slice(7));
        let thisPlayBtn = $(this).attr("id");
        playBtnDisplay(thisPlayBtn);

        createNote(frequencies[freqIndex]);
    }

    //Change the display of the play buttons     
    function playBtnDisplay(actBtn) {
        if ($(`#${actBtn}`).text() === "Play") {
            $(".play-button").removeClass("btn-danger").addClass("btn-success");
            $(".play-button").text("Play");
            $(`#${actBtn}`).addClass("btn-danger").removeClass("btn-success").text("Stop");
            let autoStopExp = new Date().getSeconds();
            let autoStop = (new Date().getSeconds()) + 3;
            console.log(autoStopExp, autoStop);
            startPlayback();
        }
        else {
            $(`#${actBtn}`).addClass("btn-success").removeClass("btn-danger").text("Play");

            stopPlayback();
        }
    }


    function createNote(frequency) {

        sound.frequency.value = frequency;
        sound.type = "sine";
        sound.connect(volume);
        volume.gain.value = 0.2;
    }



    function startPlayback() {
        setTimeout(volume.connect(audioCtx.destination),3000);
    }


    function stopPlayback() {
        volume.disconnect(audioCtx.destination);
    }


    //end of code
});
