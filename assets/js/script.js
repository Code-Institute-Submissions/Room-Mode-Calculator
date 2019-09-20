$(document).ready(function() {



    //---------------------Define Variables --------------//


    const speedOfSound = 344; //speed of sound in air in meters per second (21 degrees celsius)
    const wavelengthConstant = 1.059463; //multiplier to be used for calculating frequencies/wavelengths relative to the next frequency/wavelength 
    var baseWavelength = 24.94545455; // base wavelength to be used to fill [wavelengths] array - this corresponds to the first "A note" below the threshold of human hearing  

    var noteNames = ["A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab"];
    var dimensions = []; //dimensions array - replace with user input
    var frequencies = [];
    var notes = [];
    var wavelengths = [baseWavelength];
    //var compareArray = []; //subtract the room dimension from [wavelengths]

    //return the dimensions of drawing area for currently selected 
    var drawAreaHeight = $("#drawingArea").height();
    var drawAreaWidth = $("#drawingArea").width();



    //return the array of wavelengths corresponding to musical notes in range
    function generateWavelengths() {
        for (var i = 1; i < 100; i++) {
            wavelengths.push(wavelengths[i - 1] / wavelengthConstant);
        }
    }
    generateWavelengths();






    //--------------------------Input Functions-----------//


    //On submit the inputs will be assigned to the dimension boxes and [dimensions] array

    $("#submitBtn").on("click", addDimensions);

    function addDimensions() {

        //change input values to numbers
        var xIn = parseFloat($("#xInput").val());
        var yIn = parseFloat($("#yInput").val());
        var zIn = parseFloat($("#zInput").val());

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



    //Error to display if invalid dimensions are entered
    function invalidDimensionsError() {
        $("#dimensionsError").show();
    }

    //Dismiss error on click of X
    $("#dismissError").click(function() {
        $("#dimensionsError").hide();
    });




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

        console.log(notes);
    }


    // Determine the closest musicalnote based on the room dimension (wavelength);
    function notesCalc(dimen) {
        //Generate array whoch subtracts the room dimension from the wavelengths array

        var compareArray = wavelengths.map(n => n - dimen);


        // find first wavelength with a negative value and last wavelength with positive value in compareArray
        // whichever of these wavelengths is closest to zero corresponds to the wavelngth of the closest musical note

        var firstNegative = compareArray.find(findNegative);
        var firstNegativeIndex = compareArray.indexOf(compareArray.find(findNegative)); //find the index of the first item in compareArray with a negative value 
        var lastPositiveIndex = firstNegativeIndex - 1; //get last item in compareArray with positive value
        var lastPositive = compareArray[lastPositiveIndex];


        function findNegative(n) {
            return n <= 0;
        }


        var noteIndex;
        if (Math.abs(firstNegative) < Math.abs(lastPositive)) {
            noteIndex = firstNegativeIndex;
        }
        else {
            noteIndex = lastPositiveIndex;
        }

        //Lookup up the correct note from noteNames array 
        if (noteIndex < 12) {
            var noteOutput = noteNames[noteIndex];
        }
        else {
            var noteOutput = noteNames[noteIndex % 12];
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


        var scaleQ = xDim + yDim;
        if (Math.max(...dimensions) === zDim) {
            var baseProportion = Math.round(drawAreaHeight / scaleQ) * 0.8;
        }
        else {
            var baseProportion = Math.round(drawAreaWidth / scaleQ) * 0.8;
        }

        var posQ = drawAreaWidth / (xDim + yDim) * xDim; //x position of origin is based on length of x-axis (red)


        //lengths Are dimension * baseProportion * value in [dimensions] array
        var xLength = Math.round(baseProportion * xDim);
        var yLength = Math.round(baseProportion * yDim);
        var zLength = Math.round(baseProportion * zDim);



        //set origin point - the point where the three main axes meet
        // Test with one third from left [x,y] and 90% from top
        var originX = Math.round(posQ);
        var originY = Math.round(drawAreaHeight) - zLength;
        var angleUp = Math.round(drawAreaHeight * 0.1); //angle x and y axes up by 10% draw area height


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
            var posX = originX;
            var posY = originY;
            var id = setInterval(frame, 0.1);

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
            var pos = originX;
            var id = setInterval(frame, 0.1);

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
            var pos = originY;
            var id = setInterval(frame, 0.1);

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

    $("#lenBtn").on("click", xAxisFocus);
    $("#widBtn").on("click", yAxisFocus);
    $("#heiBtn").on("click", zAxisFocus);


    //View the x-axis only
    function xAxisFocus() {
        $(".line").addClass("d-none");
        $("#sineWave").attr({ d: "" }); //clear the sine wav from screen

        var xStart = drawAreaWidth * 0.1;
        var yStart = drawAreaHeight * 0.1;
        var xEnd = drawAreaWidth * 0.9;
        var yEnd = drawAreaHeight * 0.9;
        var xSize = drawAreaWidth - (xStart * 2); // multiply by two so that is xStart changes length remains centered
        var ySize = drawAreaHeight - (yStart * 2); // multiply by two so that is xStart changes length remains centered
        var xHalf = xStart + xSize / 2;
        var yHalf = yStart + ySize / 2;
        var xControl = xSize / 4;
        var yControl = ySize / 4;

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
        $(".line").addClass("d-none");
        $("#sineWave").attr({ d: "" }); //clear the sine wav from screen

        var xStart = drawAreaWidth * 0.1;
        var yStart = drawAreaHeight * 0.1;
        var xEnd = drawAreaWidth * 0.9;
        var yEnd = drawAreaHeight * 0.9;
        var xSize = drawAreaWidth - (xStart * 2); // multiply by two so that is xStart changes length remains centered
        var ySize = drawAreaHeight - (yStart * 2); // multiply by two so that is xStart changes length remains centered
        var xHalf = xStart + xSize / 2;
        var yHalf = yStart + ySize / 2;
        var xControl = xSize / 5; //
        var yControl = ySize / 5;

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
        $(".line").addClass("d-none");
        $("#sineWave").attr({ d: "" }); //clear the sine wav from screen

        var xStart = drawAreaWidth * 0.1;
        var yStart = drawAreaHeight * 0.1;
        var xEnd = drawAreaWidth * 0.9;
        var yEnd = drawAreaHeight * 0.9;
        var xSize = drawAreaWidth - (xStart * 2); // multiply by two so that is xStart changes length remains centered
        var ySize = drawAreaHeight - (yStart * 2); // multiply by two so that is xStart changes length remains centered
        var xHalf = xStart + xSize / 2;
        var yHalf = yStart + ySize / 2;
        var xControl = xSize / 5;
        var yControl = ySize / 5;


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








    //---------------------------Audio Code  ---------------------//

    //Establish the audio context
    var audioCtx = new(window.AudioContext);
    var sound = audioCtx.createOscillator();
    var volume = audioCtx.createGain();
    sound.start();
    var playCheck = false; //check if audio is playing - initialise as false on page load

    $(".play-button").click(playBtnActions);




    function playBtnActions() {
        var freqIndex = parseInt($(this).attr("id").slice(7));
        var thisPlayBtn = $(this).attr("id");
        playBtnDisplay(thisPlayBtn);

        createNote(frequencies[freqIndex]);
    }

    //Change the display of the play buttons     
    function playBtnDisplay(actBtn) {
        if ($(`#${actBtn}`).text() === "Play") {
            $(".play-button").removeClass("btn-danger").addClass("btn-success");
            $(".play-button").text("Play");
            $(`#${actBtn}`).addClass("btn-danger").removeClass("btn-success").text("Stop");
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
        volume.connect(audioCtx.destination);
    }


    function stopPlayback() {
        volume.disconnect(audioCtx.destination);
    }


    //end of code
});
